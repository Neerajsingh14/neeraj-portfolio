"use client";
import { useEffect, useState } from "react";
import { animate } from "motion/react";

// "4+" -> 0 se 4 tak ginta hai, "+" aakhir me rehta hai
export default function CountUp({
  value,
  delay = 0,
}: {
  value: string;
  delay?: number;
}) {
  const m = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  const ok = !!m;
  const target = m ? parseFloat(m[1]) : 0;
  const suffix = m ? m[2] : "";
  const decimals = m && m[1].includes(".") ? m[1].split(".")[1].length : 0;

  const [n, setN] = useState(0);

  useEffect(() => {
    if (!ok) return;
    const controls = animate(0, target, {
      duration: 1.4,
      delay,
      ease: "easeOut",
      onUpdate: (v) => setN(v),
    });
    return () => controls.stop();
  }, [ok, target, delay]);

  if (!ok) return <>{value}</>;
  return (
    <>
      {n.toFixed(decimals)}
      {suffix}
    </>
  );
}