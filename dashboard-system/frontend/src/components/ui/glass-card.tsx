import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  variant?: "primary" | "secondary" | "micro";
}

export function GlassCard({ children, className = "", variant = "primary" }: GlassCardProps) {
  const variantStyles = {
    primary: "bg-white/65 backdrop-blur-[28px] shadow-[0_4px_20px_rgba(0,0,0,0.08)] border border-white/35",
    secondary: "bg-white/50 backdrop-blur-[20px] shadow-[0_2px_12px_rgba(0,0,0,0.06)] border border-white/30",
    micro: "bg-white/40 backdrop-blur-[16px] shadow-[0_1px_6px_rgba(0,0,0,0.04)] border border-white/25",
  };

  return (
    <div className={`rounded-[24px] ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
}
