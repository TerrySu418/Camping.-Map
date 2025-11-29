"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; // Adjust path to your Better Auth instance

/**
 * Sign in with Google OAuth
 * This redirects the user to Google's OAuth page
 */
export async function signInWithGoogle() {
  redirect("/api/auth/sign-in/google");
}

/**
 * Sign out the current user
 */
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

/**
 * Get current session
 * This is called server-side to pass initial user to the client component
 */
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

/**
 * Public POST action - no authentication required
 */
export async function publicPostAction(data: string) {
  try {
    return {
      success: true,
      message: "Public action - no auth required",
      receivedData: data,
      timestamp: new Date().toISOString(),
    };
  } catch (_error) {
    return {
      success: false,
      error: "Invalid request",
    };
  }
}

/**
 * Protected POST action - requires authentication
 */
export async function protectedPostAction(data: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session || !session.user) {
      return {
        success: false,
        error: "Unauthorized - Please sign in first",
      };
    }

    return {
      success: true,
      message: "Protected action - auth required",
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
      receivedData: data,
      timestamp: new Date().toISOString(),
    };
  } catch (_error) {
    return {
      success: false,
      error: "Invalid request or unauthorized",
    };
  }
}
