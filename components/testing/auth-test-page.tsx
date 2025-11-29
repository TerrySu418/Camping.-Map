"use client";

import { useState } from "react";
import {
  createPostAction,
  protectedPostAction,
  publicPostAction,
  signInWithGoogle,
  signOutAction,
} from "@/lib/actions/test/test-post";
import { authClient } from "@/lib/auth-client";

interface User {
  id: string;
  email: string;
  name?: string;
  image?: string | null;
}

interface AuthTestPageProps {
  initialUser: User | null;
}

export default function AuthTestPage({ initialUser }: AuthTestPageProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [loading, setLoading] = useState(false);

  // Public form state
  const [publicResult, setPublicResult] = useState("");
  const [publicData, setPublicData] = useState("");
  const [publicOptional, setPublicOptional] = useState("");

  // Protected form state
  const [protectedResult, setProtectedResult] = useState("");
  const [protectedData, setProtectedData] = useState("");
  const [protectedTitle, setProtectedTitle] = useState("");

  // Create post form state
  const [postResult, setPostResult] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postContent, setPostContent] = useState("");
  const [postPublished, setPostPublished] = useState(false);

  async function handleGoogleSignIn() {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error("Sign in failed:", error);
      setLoading(false);
    }
  }

  const _handleGoogleSignIn = async () => {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  async function handleSignOut() {
    setLoading(true);
    try {
      const result = await signOutAction();
      if (result.success) {
        setUser(null);
        setPublicResult("");
        setProtectedResult("");
      }
    } catch (error) {
      console.error("Sign out failed:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePublicPost(e: React.FormEvent) {
    e.preventDefault();
    setPublicResult("Loading...");

    try {
      const result = await publicPostAction({
        data: publicData,
        optionalField: publicOptional || undefined,
      });

      if (result.success) {
        setPublicResult(
          `✅ Success: ${JSON.stringify({ message: result.message, receivedData: result.receivedData, timestamp: result.timestamp }, null, 2)}`,
        );
      } else {
        // Handle validation errors
        if (result.fieldErrors) {
          setPublicResult(
            `❌ Validation Error:\n${JSON.stringify(result.fieldErrors, null, 2)}`,
          );
        } else {
          setPublicResult(`❌ Error: ${result.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      setPublicResult(`❌ Error: ${error}`);
    }
  }

  async function handleProtectedPost(e: React.FormEvent) {
    e.preventDefault();
    setProtectedResult("Loading...");

    try {
      const result = await protectedPostAction({
        data: protectedData,
        title: protectedTitle || undefined,
      });

      if (result.success) {
        setProtectedResult(
          `✅ Success: ${JSON.stringify({ message: result.message, user: result.user, receivedData: result.receivedData, timestamp: result.timestamp }, null, 2)}`,
        );
      } else {
        // Handle validation errors
        if (result.fieldErrors) {
          setProtectedResult(
            `❌ Validation Error:\n${JSON.stringify(result.fieldErrors, null, 2)}`,
          );
        } else {
          setProtectedResult(`❌ Error: ${result.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      setProtectedResult(`❌ Error: ${error}`);
    }
  }

  async function handleCreatePost(e: React.FormEvent) {
    e.preventDefault();
    setPostResult("Loading...");

    try {
      const result = await createPostAction({
        title: postTitle,
        content: postContent,
        published: postPublished,
      });

      if (result.success) {
        setPostResult(
          `✅ Success: ${JSON.stringify({ message: result.message, post: result.post }, null, 2)}`,
        );
        // Clear form on success
        setPostTitle("");
        setPostContent("");
        setPostPublished(false);
      } else {
        // Handle validation errors
        if (result.fieldErrors) {
          setPostResult(
            `❌ Validation Error:\n${JSON.stringify(result.fieldErrors, null, 2)}`,
          );
        } else {
          setPostResult(`❌ Error: ${result.error || "Unknown error"}`);
        }
      }
    } catch (error) {
      setPostResult(`❌ Error: ${error}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="mx-auto max-w-5xl">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text font-bold text-5xl text-transparent">
              Better Auth Test Suite
            </h1>
            <p className="text-gray-600 text-lg">
              Test Google authentication and server actions with validation
            </p>
          </div>

          {/* Auth Section */}
          <div className="mb-8 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
            <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-8 py-6">
              <h2 className="flex items-center gap-3 font-bold text-2xl text-white">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Auth</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
                Authentication
              </h2>
            </div>

            <div className="p-8">
              {user ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-4 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-5">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500 font-bold text-white text-xl">
                      {user.name?.charAt(0) ||
                        user.email.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1">
                      <p className="mb-1 font-medium text-green-700 text-sm">
                        Signed in as
                      </p>
                      <p className="font-semibold text-gray-900 text-lg">
                        {user.email}
                      </p>
                      {user.name && (
                        <p className="text-gray-600">{user.name}</p>
                      )}
                    </div>
                    <div className="h-3 w-3 animate-pulse rounded-full bg-green-500"></div>
                  </div>
                  <form action={handleSignOut}>
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:from-red-600 hover:to-red-700 hover:shadow-lg disabled:cursor-not-allowed disabled:from-gray-400 disabled:to-gray-500"
                    >
                      {loading ? "Signing out..." : "Sign Out"}
                    </button>
                  </form>
                </div>
              ) : (
                <form action={_handleGoogleSignIn}>
                  <button
                    type="submit"
                    disabled={loading}
                    className="group flex w-full items-center justify-center gap-3 rounded-xl border-2 border-gray-300 bg-white px-8 py-4 transition-all duration-200 hover:border-blue-500 hover:shadow-lg disabled:cursor-not-allowed disabled:bg-gray-100"
                  >
                    <svg
                      className="h-6 w-6 transition-transform group-hover:scale-110"
                      viewBox="0 0 24 24"
                    >
                      <title>Auth</title>
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                    <span className="font-semibold text-gray-700 text-lg">
                      {loading ? "Signing in..." : "Continue with Google"}
                    </span>
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Forms Grid */}
          <div className="mb-8 grid gap-8 md:grid-cols-2">
            {/* Public POST Test */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-5">
                <h2 className="flex items-center gap-2 font-bold text-white text-xl">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Auth</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  Public Test
                </h2>
                <p className="mt-1 text-green-100 text-sm">
                  No authentication required
                </p>
              </div>

              <form onSubmit={handlePublicPost} className="space-y-4 p-6">
                <div>
                  <label
                    htmlFor="publicData"
                    className="mb-2 block font-semibold text-gray-700 text-sm"
                  >
                    Test Data <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="publicData"
                    type="text"
                    value={publicData}
                    onChange={(e) => setPublicData(e.target.value)}
                    placeholder="Enter test data"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="publicOptional"
                    className="mb-2 block font-semibold text-gray-700 text-sm"
                  >
                    Optional Field
                  </label>
                  <input
                    id="publicOptional"
                    type="text"
                    value={publicOptional}
                    onChange={(e) => setPublicOptional(e.target.value)}
                    placeholder="Optional data"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-green-500 to-emerald-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:from-green-600 hover:to-emerald-700 hover:shadow-lg"
                >
                  Send Public POST
                </button>
              </form>

              {publicResult && (
                <div className="mx-6 mb-6 rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
                  <p className="mb-2 flex items-center gap-2 font-semibold text-gray-700 text-sm">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <title>Auth</title>
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Result
                  </p>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-gray-900 text-sm">
                    {publicResult}
                  </pre>
                </div>
              )}
            </div>

            {/* Protected POST Test */}
            <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
              <div className="bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-5">
                <h2 className="flex items-center gap-2 font-bold text-white text-xl">
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>Auth</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  Protected Test
                </h2>
                <p className="mt-1 text-purple-100 text-sm">
                  Authentication required
                </p>
              </div>

              <form onSubmit={handleProtectedPost} className="space-y-4 p-6">
                <div>
                  <label
                    htmlFor="protectedData"
                    className="mb-2 block font-semibold text-gray-700 text-sm"
                  >
                    Test Data <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="protectedData"
                    type="text"
                    value={protectedData}
                    onChange={(e) => setProtectedData(e.target.value)}
                    placeholder="Enter test data"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <div>
                  <label
                    htmlFor="protectedTitle"
                    className="mb-2 block font-semibold text-gray-700 text-sm"
                  >
                    Title (min 3 chars)
                  </label>
                  <input
                    id="protectedTitle"
                    type="text"
                    value={protectedTitle}
                    onChange={(e) => setProtectedTitle(e.target.value)}
                    placeholder="Optional title"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-purple-500"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 px-6 py-3 font-medium text-white shadow-md transition-all duration-200 hover:from-purple-600 hover:to-indigo-700 hover:shadow-lg"
                >
                  Send Protected POST
                </button>
              </form>

              {protectedResult && (
                <div className="mx-6 mb-6 rounded-xl border-2 border-gray-200 bg-gray-50 p-4">
                  <p className="mb-2 flex items-center gap-2 font-semibold text-gray-700 text-sm">
                    <svg
                      className="h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <title>Auth</title>
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Result
                  </p>
                  <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-3 font-mono text-gray-900 text-sm">
                    {protectedResult}
                  </pre>
                </div>
              )}
            </div>
          </div>

          {/* Create Post Form */}
          <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg">
            <div className="bg-gradient-to-r from-orange-500 to-amber-600 px-8 py-6">
              <h2 className="flex items-center gap-3 font-bold text-2xl text-white">
                <svg
                  className="h-7 w-7"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <title>Auth</title>
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                  />
                </svg>
                Create Post
              </h2>
              <p className="mt-2 text-orange-100 text-sm">
                Full validation example with multiple fields
              </p>
            </div>

            <form onSubmit={handleCreatePost} className="space-y-6 p-8">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label
                    htmlFor="postTitle"
                    className="mb-2 block font-semibold text-gray-700 text-sm"
                  >
                    Title <span className="text-red-500">*</span>
                    <span className="ml-2 font-normal text-gray-500">
                      (3-100 characters)
                    </span>
                  </label>
                  <input
                    id="postTitle"
                    type="text"
                    value={postTitle}
                    onChange={(e) => setPostTitle(e.target.value)}
                    placeholder="Enter post title"
                    className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="postContent"
                    className="mb-2 block font-semibold text-gray-700 text-sm"
                  >
                    Content <span className="text-red-500">*</span>
                    <span className="ml-2 font-normal text-gray-500">
                      (minimum 10 characters)
                    </span>
                  </label>
                  <textarea
                    id="postContent"
                    value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}
                    placeholder="Enter post content"
                    rows={4}
                    className="w-full resize-none rounded-xl border-2 border-gray-200 px-4 py-3 transition-all focus:border-transparent focus:ring-2 focus:ring-orange-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-center gap-3 rounded-xl bg-gray-50 p-4 transition-colors hover:bg-gray-100">
                    <input
                      id="postPublished"
                      type="checkbox"
                      checked={postPublished}
                      onChange={(e) => setPostPublished(e.target.checked)}
                      className="h-5 w-5 cursor-pointer rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                    />
                    <span className="font-medium text-gray-700 text-sm">
                      Publish immediately
                    </span>
                  </label>
                </div>
              </div>
              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-4 font-semibold text-lg text-white shadow-md transition-all duration-200 hover:from-orange-600 hover:to-amber-700 hover:shadow-lg"
              >
                Create Post
              </button>
            </form>

            {postResult && (
              <div className="mx-8 mb-8 rounded-xl border-2 border-gray-200 bg-gray-50 p-5">
                <p className="mb-3 flex items-center gap-2 font-semibold text-gray-700 text-sm">
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <title>Auth</title>
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Result
                </p>
                <pre className="overflow-x-auto whitespace-pre-wrap rounded-lg bg-white p-4 font-mono text-gray-900 text-sm">
                  {postResult}
                </pre>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Built with Next.js, Better Auth, and Zod validation</p>
          </div>
        </div>
      </div>
    </div>
  );
}
