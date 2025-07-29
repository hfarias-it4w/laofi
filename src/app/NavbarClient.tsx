"use client";
import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("../components/ui/Navbar"), { ssr: false });

export default function NavbarClient() {
  return <Navbar />;
}
