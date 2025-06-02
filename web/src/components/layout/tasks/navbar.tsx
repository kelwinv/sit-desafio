"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckSquare, Plus, User, LogOut } from "lucide-react";
import { useAuth } from "@/context/auth-context";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  const isActive = (path: string) => pathname === path;

  const handleLogout = () => {
    logout();
  };

  if (!user) {
    return null;
  }

  return (
    <nav className="bg-sitblue-500 text-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link href="/tasks" className="flex items-center space-x-2">
              <CheckSquare className="h-6 w-6 text-sitorange-500" />
              <span className="font-bold text-xl">TaskManager</span>
            </Link>

            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant={isActive("/tasks") ? "secondary" : "ghost"}
                className={cn("text-white", {
                  "text-white hover:text-white hover:bg-sitblue-400 bg-sitblue":
                    !isActive("/tasks"),
                })}
                asChild
              >
                <Link href="/tasks">Tarefas</Link>
              </Button>
              <Button
                variant={isActive("/tasks/new") ? "secondary" : "ghost"}
                className={cn("text-white", {
                  "text-white hover:text-white hover:bg-sitblue-400 bg-sitblue":
                    !isActive("/tasks/new"),
                })}
                asChild
              >
                <Link href="/tasks/new">
                  <Plus className="h-4 w-4 mr-2" />
                  Nova Tarefa
                </Link>
              </Button>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="relative h-8 w-8 rounded-full hover:bg-sitblue-400"
              >
                <Avatar className="h-8 w-8 border-2 border-sitorange-500">
                  <AvatarImage alt={user.name} />
                  <AvatarFallback className="bg-sitblue-400 text-white">
                    {user.name
                      .split(" ")
                      .map((name: string) => name[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuItem className="flex flex-col items-start">
                <div className="font-medium">{user.name}</div>
                <div className="text-xs text-muted-foreground">
                  {user.email}
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Perfil</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
