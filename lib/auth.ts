"use server";

import bcrypt from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

import { prisma } from "./prisma";

const SESSION_COOKIE = "bf_session";
const SESSION_MAX_AGE_DAYS = 30;

const signupSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email")
    .transform((v) => v.toLowerCase()),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password is too long"),
  name: z.string().min(1, "Name is required").max(80).optional(),
});

const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email")
    .transform((v) => v.toLowerCase()),
  password: z.string().min(1, "Password is required"),
});

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (!sessionToken) return null;

  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true },
  });

  if (!session) {
    cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
    return null;
  }

  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { id: session.id } });
    cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
    return null;
  }

  return session.user;
}

export async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) redirect("/login");
  return user;
}

export async function signup(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    name: formData.get("name"),
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      formError: "",
    } as const;
  }

  const { email, password, name } = parsed.data;

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      success: false,
      formError: "An account with this email already exists.",
    } as const;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
      name: name?.trim() || null,
    },
  });

  await createSession(user.id);
  redirect("/dashboard");
}

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return {
      success: false,
      fieldErrors: parsed.error.flatten().fieldErrors,
      formError: "",
    } as const;
  }

  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return {
      success: false,
      formError: "Invalid email or password.",
    } as const;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    return {
      success: false,
      formError: "Invalid email or password.",
    } as const;
  }

  await createSession(user.id);
  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

  if (sessionToken) {
    await prisma.session.deleteMany({ where: { sessionToken } });
    cookieStore.set(SESSION_COOKIE, "", { maxAge: 0, path: "/" });
  }

  redirect("/");
}

async function createSession(userId: string) {
  const cookieStore = await cookies();

  const existingToken = cookieStore.get(SESSION_COOKIE)?.value;
  if (existingToken) {
    await prisma.session.deleteMany({ where: { sessionToken: existingToken } });
  }

  const token = await generateSessionToken();
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_MAX_AGE_DAYS);

  await prisma.session.create({
    data: {
      userId,
      sessionToken: token,
      expiresAt,
    },
  });

  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_DAYS * 24 * 60 * 60,
  });
}

async function generateSessionToken() {
  const { randomBytes } = await import("crypto");
  return randomBytes(32).toString("hex");
}
