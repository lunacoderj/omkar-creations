import React from "react";

export function Card({ className = "", children, variant = "default", ...props }) {
  const baseStyles = "relative rounded-2xl overflow-hidden transition-all duration-500";
  
  const variants = {
    default: "bg-surface/30 border border-border/20 backdrop-blur-sm",
    glass: "bg-surface/50 border border-white/10 backdrop-blur-md",
    elevated: "bg-surface shadow-xl border border-border/10",
    interactive: "bg-bg hover:bg-surface/30 hover:border-border/50 border border-border/20 group cursor-default"
  };

  return (
    <div className={`${baseStyles} ${variants[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
}

export function CardContent({ className = "", children, ...props }) {
  return (
    <div className={`p-6 sm:p-8 relative z-10 ${className}`} {...props}>
      {children}
    </div>
  );
}
