import type { Route } from "./+types/home";
import { motion } from "framer-motion";

export function meta({ }: Route.MetaArgs) {
  return [
    { title: "OpenClone | AI Web Builder" },
    { name: "description", content: "Build production-ready web apps in seconds with OpenClone AI." },
  ];
}

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-neutral-950 overflow-hidden font-sans">
      <motion.div
        className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-blue-600/20 rounded-full blur-[100px] pointer-events-none"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      <div className="z-10 flex flex-col items-center text-center px-4">

        <motion.div
          className="w-24 h-24 mb-8 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-[0_0_40px_rgba(59,130,246,0.4)] flex items-center justify-center"
          animate={{
            y: [0, -15, 0],
            rotate: [0, 2, -2, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          <img src="Logo.svg" alt="Logo" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-neutral-400 tracking-tight mb-6"
        >
          OpenClone
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="text-lg md:text-xl text-neutral-400 max-w-2xl mb-10"
        >
          The open-source AI web builder. Describe your vision and let intelligent agents construct your interface in seconds.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.6 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white text-black font-semibold rounded-full hover:bg-neutral-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.1)] flex items-center gap-2"
          >
            Start Building
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}