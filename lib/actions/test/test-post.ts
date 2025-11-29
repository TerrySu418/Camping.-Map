"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { action } from "@/lib/handlers/action";

// ============================================
// AUTH ACTIONS
// ============================================

// This should be use in server action not button!
export async function signInWithGoogle() {
  const { url } = await auth.api.signInSocial({
    body: {
      provider: "google", // or any other provider id
    },
  });

  if (url) redirect(url);
}

export async function signOutAction() {
  try {
    await auth.api.signOut({
      headers: await headers(),
    });
    return { success: true };
  } catch (error) {
    console.error("Sign out error:", error);
    return { success: false, error: "Failed to sign out" };
  }
}

export async function getSessionAction() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return { user: null };
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
        image: session.user.image,
      },
    };
  } catch (error) {
    console.error("Session check error:", error);
    return { user: null };
  }
}

// ============================================
// PUBLIC POST ACTION
// ============================================

const publicPostSchema = z.object({
  data: z.string().min(1, "Data is required"),
  optionalField: z.string().optional(),
});

type PublicPostInput = z.infer<typeof publicPostSchema>;

export async function publicPostAction(input: PublicPostInput) {
  const validation = await action({
    params: input,
    schema: publicPostSchema,
    authorize: false, // No auth required
  });

  // Check if validation returned an error
  if (validation instanceof Error) {
    return {
      success: false,
      error: validation.message,
      fieldErrors:
        "fieldErrors" in validation ? validation.fieldErrors : undefined,
    };
  }

  // Success - process the validated data
  return {
    success: true,
    message: "Public action - no auth required",
    receivedData: validation?.params,
    timestamp: new Date().toISOString(),
  };
}

// ============================================
// PROTECTED POST ACTION
// ============================================

const protectedPostSchema = z.object({
  data: z.string().min(1, "Data is required"),
  title: z.string().min(3, "Title must be at least 3 characters").optional(),
  amount: z.number().positive("Amount must be positive").optional(),
});

type ProtectedPostInput = z.infer<typeof protectedPostSchema>;

export async function protectedPostAction(input: ProtectedPostInput) {
  const validation = await action({
    params: input,
    schema: protectedPostSchema,
    authorize: true, // Auth required
  });

  // Check if validation or auth returned an error
  if (validation instanceof Error) {
    return {
      success: false,
      error: validation.message,
      fieldErrors:
        "fieldErrors" in validation ? validation.fieldErrors : undefined,
    };
  }

  // Get the current user (we know they're authenticated from validation)
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Success - process the validated data with user info
  return {
    success: true,
    message: "Protected action - auth required",
    user: {
      id: session?.user.id,
      email: session?.user.email,
      name: session?.user.name,
    },
    receivedData: validation?.params,
    timestamp: new Date().toISOString(),
  };
}

// ============================================
// EXAMPLE: CREATE POST ACTION (More Complex)
// ============================================

const createPostSchema = z.object({
  title: z
    .string()
    .min(3, "Title must be at least 3 characters")
    .max(100, "Title too long"),
  content: z.string().min(10, "Content must be at least 10 characters"),
  tags: z.array(z.string()).max(5, "Maximum 5 tags allowed").optional(),
  published: z.boolean().default(false),
});

type CreatePostInput = z.infer<typeof createPostSchema>;

export async function createPostAction(input: CreatePostInput) {
  const validation = await action({
    params: input,
    schema: createPostSchema,
    authorize: true, // Must be logged in to create posts
  });

  if (validation instanceof Error) {
    return {
      success: false,
      error: validation.message,
      fieldErrors:
        "fieldErrors" in validation ? validation.fieldErrors : undefined,
    };
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Here you would typically save to database
  // Example: await db.post.create({ data: { ...validation.params, authorId: session.user.id } })

  return {
    success: true,
    message: "Post created successfully",
    post: {
      ...validation?.params,
      id: Math.random().toString(36).substring(7), // Mock ID
      authorId: session?.user.id,
      createdAt: new Date().toISOString(),
    },
  };
}
