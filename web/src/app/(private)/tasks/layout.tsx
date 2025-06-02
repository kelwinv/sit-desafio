import { Navbar } from "@/components/layout/tasks/navbar";
import type React from "react";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">{children}</main>
    </>
  );
}
