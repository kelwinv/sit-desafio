import type React from "react";
import { AuthGuard } from "../guards/auth-guard";

export default function TasksLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AuthGuard>{children}</AuthGuard>;
}
