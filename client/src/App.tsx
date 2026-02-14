import React, { useState } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

import { TopNav } from "@/components/TopNav";
import { CommandPalette } from "@/components/CommandPalette";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Projects from "@/pages/Projects";
import ProjectDetail from "@/pages/ProjectDetail";
import LabNotes from "@/pages/LabNotes";
import LabNoteDetail from "@/pages/LabNoteDetail";
import Resume from "@/pages/Resume";
import PageDetail from "@/pages/PageDetail";
import NotFound from "@/pages/NotFound";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />

      <Route path="/about" component={About} />

      <Route path="/projects" component={Projects} />
      <Route path="/projects/:slug" component={ProjectDetail} />

      <Route path="/lab-notes" component={LabNotes} />
      <Route path="/lab-notes/:slug" component={LabNoteDetail} />

      <Route path="/resume" component={Resume} />

      {/* Generic site pages */}
      <Route path="/p/:slug" component={PageDetail} />

      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [commandOpen, setCommandOpen] = useState(false);
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  React.useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  const onOpenCommand = () => setCommandOpen(true);
  const toggleTheme = () => setTheme(prev => prev === "dark" ? "light" : "dark");

  const style = {
    "--sidebar-width": "20rem",
    "--sidebar-width-icon": "4rem",
  } as React.CSSProperties;

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <div className="min-h-screen w-full" style={style}>
          <TopNav onOpenCommand={onOpenCommand} theme={theme} onThemeToggle={toggleTheme} />
          <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

          <div className="min-h-[calc(100vh-60px)]">
            <Router />
          </div>

          <footer className="border-t bg-background/70 backdrop-blur" data-testid="site-footer">
            <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-6 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">Ethan Hamilton</span> — builder of systems.
              </div>
              <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                <span className="mono-chip">Cmd+K</span>
                <span className="mono-chip">/</span>
              </div>
            </div>
          </footer>
        </div>

        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
