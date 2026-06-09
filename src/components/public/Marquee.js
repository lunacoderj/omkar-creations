"use client";

export default function Marquee({
  children,
  reverse = false,
  speed = 30,
  className = "",
  pauseOnHover = true,
}) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <div
        className={reverse ? "marquee-track-reverse" : "marquee-track"}
        style={{
          animationDuration: `${speed}s`,
          ...(pauseOnHover ? {} : { animationPlayState: "running" }),
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}
