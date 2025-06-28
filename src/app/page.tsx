"use client";
import dynamic from "next/dynamic";

const HomeCanvas = dynamic(() => import("@/components/scenes/Hero"), {
  ssr: false,
});

export default function Home() {
  return (
    <div className="w-full min-h-screen bg-black flex">
      <HomeCanvas />
    </div>
  );  
}
