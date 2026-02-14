import React from "react";
import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Command, Moon, Sun, User, FolderKanban, FlaskConical, Download } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface TopNavProps {
  onOpenCommand: () => void;
  theme?: "dark" | "light";
  onThemeToggle?: () => void;
}

export function TopNav({ onOpenCommand, theme, onThemeToggle }: TopNavProps) {
  const [location] = useLocation();

  const navItems = [
    { label: "About", href: "/about", icon: User },
    { label: "Projects", href: "/projects", icon: FolderKanban },
    { label: "Lab Notes", href: "/lab-notes", icon: FlaskConical },
    { label: "Resume", href: "/resume", icon: Download },
  ];

  const isActive = (href: string) => (href === "/" ? location === "/" : location.startsWith(href));

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md" data-testid="top-nav">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link href="/">
            <a className="flex items-center gap-2 rounded-md px-2 py-1 transition-colors hover:bg-muted" data-testid="nav-home">
              <span className="font-mono text-sm font-bold tracking-tighter text-foreground">EH</span>
              <Separator orientation="vertical" className="h-4" />
              <span className="text-sm font-semibold tracking-tight text-foreground">Ethan Hamilton</span>
            </a>
          </Link>

          <div className="hidden items-center gap-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link key={item.href} href={item.href}>
                  <a
                    className={cn(
                      "inline-flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground",
                      isActive(item.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground"
                    )}
                    data-testid={`link-${item.label.toLowerCase()}`}
                  >
                    <Icon className="h-4 w-4 opacity-70" />
                    <span>{item.label}</span>
                  </a>
                </Link>
              );
            })}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onThemeToggle}
            data-testid="button-theme-toggle"
            title="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={onOpenCommand}
            className="hidden h-9 w-40 justify-start gap-2 border-input/50 px-3 text-muted-foreground md:flex"
            data-testid="button-command-palette"
          >
            <Command className="h-4 w-4" />
            <span className="text-xs">Search...</span>
            <kbd className="pointer-events-none ml-auto flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
              <span className="text-xs">/</span>
            </kbd>
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={onOpenCommand}
            className="md:hidden"
            data-testid="button-command-palette-mobile"
          >
            <Command className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </nav>
  );
}
