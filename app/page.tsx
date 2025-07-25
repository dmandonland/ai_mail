"use client"
import LogoEnter from "@/components/motion/enteranimation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FaBolt, FaLock, FaInfinity, FaPalette } from "react-icons/fa";

const features = [
  {
    icon: <FaBolt className="text-4xl text-[#A24AD9]" />,
    title: "Ultra Fast",
    desc: "Lightning-quick email delivery and search."
  },
  {
    icon: <FaLock className="text-4xl text-[#A24AD9]" />,
    title: "Secure",
    desc: "End-to-end encryption keeps your mail private."
  },
  {
    icon: <FaInfinity className="text-4xl text-[#A24AD9]" />,
    title: "Unlimited Storage",
    desc: "Never delete an email again. Infinite space for your conversations."
  },
  {
    icon: <FaPalette className="text-4xl text-[#A24AD9]" />,
    title: "Modern UI",
    desc: "A beautiful, intuitive interface for productivity and ease."
  }
];

export default function HomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e9d5ff] dark:from-background dark:to-[#1e1b4b] overflow-x-hidden">
      <div className="mt-12 mb-6">
        <LogoEnter />
      </div>
      <div className="text-center p-8 max-w-xl">
        <h1 className="text-5xl font-extrabold mb-4 text-[#A24AD9] drop-shadow-lg">Infinite</h1>
        <p className="text-xl text-muted-foreground mb-6 font-medium">
          Experience the future of email. Fast. Secure. Limitless.
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center mb-12">
          <Button className="bg-[#A24AD9] text-white px-8 py-3 text-lg font-semibold shadow-lg hover:bg-[#7c2bbf] transition" asChild>
            <Link href="/auth/sign-in">Get Started</Link>
          </Button>
        </div>
      </div>
      {/* Animated Features Section */}
      <div className="relative w-full flex flex-col items-center">
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle animated background blobs */}
          <div className="absolute top-0 left-1/4 w-72 h-72 bg-[#A24AD9]/30 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#7c2bbf]/20 rounded-full blur-3xl animate-pulse-slow animation-delay-1000" />
        </div>
        <div className="relative flex flex-wrap justify-center gap-8 z-10 py-8">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`flex flex-col items-center bg-white/80 dark:bg-zinc-900/80 rounded-2xl shadow-xl px-8 py-10 min-w-[220px] max-w-xs transition-all duration-500 opacity-0 translate-y-8 animate-fade-in-up`}
              style={{ animationDelay: `${i * 0.2 + 0.2}s` }}
            >
              {f.icon}
              <h3 className="font-bold text-xl mt-4 mb-2 text-[#A24AD9]">{f.title}</h3>
              <p className="text-base text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
      <style jsx global>{`
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(32px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite alternate;
        }
        @keyframes pulse-slow {
          0% { opacity: 0.7; transform: scale(1); }
          100% { opacity: 1; transform: scale(1.15); }
        }
      `}</style>
    </div>
  );
}
