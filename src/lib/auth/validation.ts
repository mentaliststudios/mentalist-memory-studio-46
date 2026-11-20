import { z } from "zod";

export const PASSWORD_MIN_LENGTH = 8;
/** Passwords are hashed with bcrypt, which only uses the first 72 bytes. */
export const PASSWORD_MAX_LENGTH = 72;
export const DISPLAY_NAME_MAX_LENGTH = 50;

const email = z
  .string()
  .trim()
  .min(1, "Enter your email address.")
  .max(255, "That email is too long.")
  .email("Enter a valid email address, like name@example.com.");

const newPassword = z
  .string()
  .min(PASSWORD_MIN_LENGTH, `Use at least ${PASSWORD_MIN_LENGTH} characters.`)
  .max(PASSWORD_MAX_LENGTH, `Use at most ${PASSWORD_MAX_LENGTH} characters.`)
  .regex(/[A-Za-z]/, "Include at least one letter.")
  .regex(/[0-9]/, "Include at least one number.");

export const signupSchema = z
  .object({
    displayName: z
      .string()
      .trim()
      .min(1, "Tell us what to call you.")
      .max(DISPLAY_NAME_MAX_LENGTH, `Keep it under ${DISPLAY_NAME_MAX_LENGTH} characters.`),
    email,
    password: newPassword,
    confirmPassword: z.string().min(1, "Repeat your password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export const loginSchema = z.object({
  email,
  password: z.string().min(1, "Enter your password."),
});

export const forgotPasswordSchema = z.object({ email });

export const resetPasswordSchema = z
  .object({
    password: newPassword,
    confirmPassword: z.string().min(1, "Repeat your new password."),
  })
  .refine((v) => v.password === v.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match.",
  });

export type SignupValues = z.infer<typeof signupSchema>;
export type LoginValues = z.infer<typeof loginSchema>;
export type ForgotPasswordValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordValues = z.infer<typeof resetPasswordSchema>;
