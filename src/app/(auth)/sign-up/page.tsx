"use client";

import { authClient } from "@/lib/auth-client";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignUp() {
  const handleSignInWithGoogle = async () => {
    await authClient.signIn.social({
      provider: "google",
    });
  };

  const handleSignInWithGithub = async () => {
    await authClient.signIn.social({
      provider: "github",
    });
  };

  return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-app-surface/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Join Us
            </h1>
            <p className="text-gray-400">Start your journey 🚀</p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-gray-500">
                Sign up with
              </span>
            </div>
          </div>

          {/* Social Signups */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
              onClick={handleSignInWithGithub}
            >
              <Image src={'/GithubIcon.png'} alt="githubIcon" width={5} height={5}/> GitHub
            </button>
            <button
              className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
              onClick={handleSignInWithGoogle}
            >
              <Image src={'/ChromeIcon.png'} alt="ChromeIcon" width={25} height={25} className="invert"/> Google
            </button>
          </div>

          {/* Footer */}
          <p className="text-gray-400 text-sm mt-8 text-center">
            Already have an account?{" "}
            <a
              href="/sign-in"
              className="text-white font-semibold hover:text-brand-indigo transition-colors underline underline-offset-4 decoration-brand-indigo/50"
            >
              Sign in
            </a>
          </p>
        </div>
      </div>
  );
}
