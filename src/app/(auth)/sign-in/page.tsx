"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

export default function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleSignin = async (e?: React.FormEvent) => {
    e?.preventDefault(); // Prevent page reload if called from form

    if (!email || !password) {
      return toast.error("Please enter both email and password");
    }

    await authClient.signIn.email(
      {
        email,
        password,
        callbackURL: "/",
        rememberMe: true,
      },
      {
        onRequest: () => setIsLoading(true),
        onSuccess: () => {
          setIsLoading(false);
          toast.success("Welcome back!");
          router.push("/");
        },
        onError: (ctx) => {
          setIsLoading(false);
          toast.error(ctx.error.message || "Invalid credentials");
        },
      },
    );
  };

  const handleSignInWithGoogle = async () => {
    const data = await authClient.signIn.social({
      provider: "google",
    });
  };

  const handleSignInWithGithub = async () => {
    const data = await authClient.signIn.social({
      provider: "github",
    });
  };
  
  return (
      <div className="w-full max-w-md mx-auto">
        <div className="bg-app-surface/40 backdrop-blur-2xl border border-white/5 rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold tracking-tight text-white mb-2">
              Sign In
            </h1>
            <p className="text-gray-400">
              Select Sign In method to access your account
            </p>
          </div>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-white/10"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0a0a0a] px-2 text-gray-500">
                Continue with
              </span>
            </div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button
              className="flex items-center justify-center gap-2 py-2.5 border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium"
              onClick={handleSignInWithGithub}
            >
              <Image src={'/GithubIcon.png'} alt="GithubIcon" width={25} height={25}/> GitHub
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
            New here?{" "}
            <a
              href="/sign-up"
              className="text-white font-semibold hover:text-brand-pink transition-colors underline underline-offset-4 decoration-brand-purple/50"
            >
              Create an account
            </a>
          </p>
        </div>
      </div>
  );
}
