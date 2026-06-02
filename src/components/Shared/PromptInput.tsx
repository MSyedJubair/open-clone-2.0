'use client'

import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { ArrowUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Spinner } from "../ui/spinner";

const PromptInput = ({ isAuthenticated }: { isAuthenticated: boolean }) => {
    const trpc = useTRPC();
    const router = useRouter();

    const [prompt, setPrompt] = useState("");
    const [isRedirecting, setIsRedirecting] = useState(false);

    const { mutateAsync: createProject, isPending } = useMutation(
        trpc.project.newProject.mutationOptions(),
    );

    const { mutateAsync: sendMessage, isPending: isSendingMsg } = useMutation(
        trpc.message.sendMessage.mutationOptions(),
    );

    const isLoading = isPending || isSendingMsg || isRedirecting;

    const handleSend = async () => {
        if (isLoading || !prompt.trim()) return;

        try {
            if (!isAuthenticated) {
                toast("Please Create An Account First");
                return;
            }

            const projectId = await createProject();

            if (projectId) {
                setIsRedirecting(true);
                toast.success("Project created! Initializing workspace...");

                await sendMessage({
                    message: prompt,
                    projectId: projectId,
                });
            } else {
                toast.error('Something went wrong, please try again.')
            }

            toast.success("Workspace created! Redirecting...");
            router.push(`/project/${projectId}`);
        } catch (error) {
            toast.error("Failed to create project.");
            setIsRedirecting(false);
            console.log(error);
        }
    };

    return (
        <>
            <div className={`relative w-full max-w-3xl group ${isLoading ? "opacity-80" : ""}`}>
                <div className="absolute -inset-1 bg-linear-to-tr from-indigo-500 via-purple-500 to-pink-500 rounded-4xl blur-lg opacity-20 group-hover:opacity-40 transition duration-500"></div>

                <div className="relative bg-app-surface/80 backdrop-blur-xl border border-white/10 rounded-4xl p-3 shadow-2xl flex flex-col">
                    <textarea
                        value={prompt}
                        disabled={isLoading}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder={isLoading ? "Generating your project..." : "Describe your app in detail... e.g. 'Build a real estate dashboard with a map view'"}
                        className="w-full bg-transparent text-white placeholder-zinc-500 resize-none outline-none p-6 min-h-35 text-xl disabled:cursor-not-allowed"
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                handleSend();
                            }
                        }}
                    />

                    <div className="flex items-center justify-end pt-4 px-3 pb-2 border-t border-white/5">
                        <button
                            disabled={isLoading || prompt.length === 0}
                            className={`p-3 rounded-2xl flex items-center justify-center transition-all duration-300 ${prompt.length > 0 && !isLoading
                                ? "bg-white text-black hover:bg-zinc-200 hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                                : "bg-white/10 text-white/30 cursor-not-allowed"
                                }`}
                            onClick={handleSend}
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-2 px-1">
                                    <Spinner className="w-5 h-5" />
                                </div>
                            ) : (
                                <ArrowUp className="w-6 h-6" />
                            )}
                        </button>
                    </div>
                </div>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-10">
                {[
                    "Social Network feed",
                    "Landing page for an AI startup",
                    "Task management app",
                    "Crypto tracker",
                ].map((suggestion) => (
                    <button
                        key={suggestion}
                        disabled={isLoading}
                        onClick={() => setPrompt(`Build a ${suggestion.toLowerCase()}...`)}
                        className="px-5 py-2.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {suggestion}
                    </button>
                ))}
            </div>
        </>
    )
}

export default PromptInput