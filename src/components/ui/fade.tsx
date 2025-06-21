import React, { useEffect, useState } from "react";

interface FadeProps {
  durationMs?: number;
  children: React.ReactNode;
  className?: string;
}

export const Fade: React.FC<FadeProps> = ({
  durationMs = 500,
  children,
  className = "",
}) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setShow(true), 50); // allow browser to render before fading in
    return () => clearTimeout(timeout);
  }, []);
  return (
    <div
      className={`transition-opacity ${
        show ? "opacity-100" : "opacity-0"
      } ${className}`}
      style={{ transitionDuration: `${durationMs}ms` }}
    >
      {children}
    </div>
  );
};
