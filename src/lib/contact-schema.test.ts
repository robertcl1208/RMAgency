import { describe, expect, it } from "vitest";
import {
  contactFormSchema,
  formatZodFieldErrors,
} from "./contact-schema";

describe("contactFormSchema", () => {
  const valid = {
    name: "Robert Tan",
    email: "robert@example.com",
    company: "Acme",
    phone: "+1 000 000 0000",
    message: "Hello, we need help with a SaaS MVP timeline and budget.",
  };

  it("accepts a complete valid payload", () => {
    const r = contactFormSchema.safeParse(valid);
    expect(r.success).toBe(true);
  });

  it("accepts optional company and phone omitted or empty", () => {
    const r = contactFormSchema.safeParse({
      name: "Bob",
      email: "bob@test.co",
      company: "",
      phone: "   ",
      message: "1234567890",
    });
    expect(r.success).toBe(true);
    if (r.success) {
      expect(r.data.company).toBeUndefined();
      expect(r.data.phone).toBeUndefined();
    }
  });

  it("rejects name shorter than 2 chars", () => {
    const r = contactFormSchema.safeParse({ ...valid, name: "A" });
    expect(r.success).toBe(false);
  });

  it("rejects invalid email", () => {
    const r = contactFormSchema.safeParse({ ...valid, email: "not-an-email" });
    expect(r.success).toBe(false);
  });

  it("rejects message shorter than 10 chars", () => {
    const r = contactFormSchema.safeParse({ ...valid, message: "short" });
    expect(r.success).toBe(false);
  });

  it("maps zod issues to field keys", () => {
    const r = contactFormSchema.safeParse({
      name: "",
      email: "bad",
      message: "x",
    });
    expect(r.success).toBe(false);
    if (!r.success) {
      const fe = formatZodFieldErrors(r.error);
      expect(fe.name).toBeDefined();
      expect(fe.email).toBeDefined();
      expect(fe.message).toBeDefined();
    }
  });
});
