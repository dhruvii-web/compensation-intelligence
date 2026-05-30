"use client";

import Link from "next/link";
import {
  UserButton,
  SignInButton,
  useUser,
} from "@clerk/nextjs";

export default function Navbar() {
  const { isSignedIn } =
    useUser();

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-8 h-18 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-2xl tracking-tight text-slate-900"
        >
          Compensation
          Intelligence
        </Link>

        <div className="flex items-center gap-8 text-sm font-medium text-slate-600">
          <Link
            href="/explore"
            className="hover:text-black transition"
          >
            Explore
          </Link>

          <Link
            href="/compare"
            className="hover:text-black transition"
          >
            Compare
          </Link>

          <Link
            href="/submit"
            className="hover:text-black transition"
          >
            Submit
          </Link>

          <Link
            href="/leaderboard"
            className="hover:text-black transition"
          >
            Leaderboard
          </Link>

          {isSignedIn && (
            <Link
              href="/profile"
              className="hover:text-black transition"
            >
              Profile
            </Link>
          )}

          {!isSignedIn ? (
            <SignInButton mode="modal">
              <button className="hover:text-black transition font-medium">
                Sign In
              </button>
            </SignInButton>
          ) : (
            <UserButton
              appearance={{
                elements: {
                  avatarBox:
                    "w-10 h-10",
                },
              }}
            />
          )}
        </div>
      </div>
    </nav>
  );
}