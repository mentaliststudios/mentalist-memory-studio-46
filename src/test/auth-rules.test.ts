import { describe, expect, it } from "vitest";

import { AUTH_MESSAGES, friendlyAuthError, isAlreadyRegistered } from "@/lib/auth/errors";
import { safeRedirectPath } from "@/lib/auth/redirect";
import { loginSchema, resetPasswordSchema, signupSchema } from "@/lib/auth/validation";

const validSignup = {
  displayName: "  Ana  ",
  email: " ana@example.com ",
  password: "memory123",
  confirmPassword: "memory123",
};

function fieldErrors(result: {
  success: boolean;
  error?: { issues: { path: (string | number)[] }[] };
}) {
  return result.error?.issues.map((i) => i.path.join(".")) ?? [];
}

describe("signup rules", () => {
  it("accepts valid details and trims the display name and email", () => {
    const r = signupSchema.safeParse(validSignup);
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.displayName).toBe("Ana");
      expect(r.data.email).toBe("ana@example.com");
    }
  });

  it("requires a display name (whitespace only is empty)", () => {
    expect(fieldErrors(signupSchema.safeParse({ ...validSignup, displayName: "   " }))).toContain(
      "displayName",
    );
  });

  it("limits display names to 50 characters", () => {
    expect(
      fieldErrors(signupSchema.safeParse({ ...validSignup, displayName: "a".repeat(51) })),
    ).toContain("displayName");
  });

  it("rejects an invalid email", () => {
    expect(fieldErrors(signupSchema.safeParse({ ...validSignup, email: "ana@" }))).toContain(
      "email",
    );
  });

  it("requires passwords of at least 8 characters", () => {
    const r = signupSchema.safeParse({
      ...validSignup,
      password: "abc1234",
      confirmPassword: "abc1234",
    });
    expect(fieldErrors(r)).toContain("password");
  });

  it("requires a letter and a number in the password", () => {
    expect(
      fieldErrors(
        signupSchema.safeParse({
          ...validSignup,
          password: "12345678",
          confirmPassword: "12345678",
        }),
      ),
    ).toContain("password");
    expect(
      fieldErrors(
        signupSchema.safeParse({
          ...validSignup,
          password: "abcdefgh",
          confirmPassword: "abcdefgh",
        }),
      ),
    ).toContain("password");
  });

  it("rejects passwords longer than 72 characters", () => {
    const long = `a1${"x".repeat(71)}`;
    expect(
      fieldErrors(
        signupSchema.safeParse({ ...validSignup, password: long, confirmPassword: long }),
      ),
    ).toContain("password");
  });

  it("flags mismatched password confirmation", () => {
    expect(
      fieldErrors(signupSchema.safeParse({ ...validSignup, confirmPassword: "memory124" })),
    ).toEqual(["confirmPassword"]);
  });

  it("applies the same password rules when resetting", () => {
    expect(
      fieldErrors(resetPasswordSchema.safeParse({ password: "short1", confirmPassword: "short1" })),
    ).toContain("password");
    expect(
      fieldErrors(
        resetPasswordSchema.safeParse({ password: "memory123", confirmPassword: "memory999" }),
      ),
    ).toEqual(["confirmPassword"]);
  });

  it("does not apply new-password rules at login", () => {
    expect(loginSchema.safeParse({ email: "ana@example.com", password: "x" }).success).toBe(true);
  });
});

describe("post-login redirect", () => {
  it("keeps same-site app paths including query strings", () => {
    expect(safeRedirectPath("/progress")).toBe("/progress");
    expect(safeRedirectPath("/training?level=2")).toBe("/training?level=2");
  });

  it("falls back to /dashboard for missing values", () => {
    expect(safeRedirectPath(undefined)).toBe("/dashboard");
    expect(safeRedirectPath("")).toBe("/dashboard");
  });

  it.each([
    "https://evil.example",
    "//evil.example",
    "/\\evil.example",
    "javascript:alert(1)",
    "dashboard",
  ])("refuses off-site or malformed target %s", (target) => {
    expect(safeRedirectPath(target)).toBe("/dashboard");
  });

  it.each(["/login", "/signup?x=1", "/forgot-password", "/reset-password"])(
    "never redirects back to %s (loop guard)",
    (target) => {
      expect(safeRedirectPath(target)).toBe("/dashboard");
    },
  );
});

describe("auth error messages", () => {
  it("uses one message for wrong password and unknown email (no account enumeration)", () => {
    expect(friendlyAuthError({ code: "invalid_credentials", status: 400 })).toBe(
      AUTH_MESSAGES.invalidCredentials,
    );
    expect(friendlyAuthError({ code: "user_not_found", status: 400 })).toBe(
      AUTH_MESSAGES.invalidCredentials,
    );
  });

  it("treats an already-registered email as a normal signup outcome", () => {
    expect(isAlreadyRegistered({ code: "user_already_exists" })).toBe(true);
    expect(isAlreadyRegistered({ code: "email_exists" })).toBe(true);
    expect(isAlreadyRegistered({ code: "weak_password" })).toBe(false);
  });

  it("reports connection problems separately", () => {
    expect(friendlyAuthError({ name: "AuthRetryableFetchError", status: 0 })).toBe(
      AUTH_MESSAGES.network,
    );
    expect(friendlyAuthError(new TypeError("Failed to fetch"))).toBe(AUTH_MESSAGES.network);
  });

  it("reports rate limits", () => {
    expect(friendlyAuthError({ status: 429, code: "over_email_send_rate_limit" })).toBe(
      AUTH_MESSAGES.rateLimited,
    );
  });

  it("never echoes unknown provider messages", () => {
    expect(
      friendlyAuthError({ status: 500, message: "relation public.profiles does not exist" }),
    ).toBe(AUTH_MESSAGES.generic);
  });
});
