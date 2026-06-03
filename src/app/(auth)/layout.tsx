export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-app-bg text-white flex items-center justify-center relative overflow-hidden">
      
      {/* Animated Background Blobs */}
      <div className="absolute w-125 h-125 bg-brand-indigo opacity-20 blur-3xl rounded-full animate-drift -top-25 -left-25" />
      <div className="absolute w-100 h-100 bg-brand-purple opacity-20 blur-3xl rounded-full animate-drift-slow -bottom-25 -right-25" />
      <div className="absolute w-75 h-75 bg-brand-pink opacity-20 blur-3xl rounded-full animate-drift top-[40%] left-[60%]" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-md">
        {children}
      </div>
    </div>
  );
}