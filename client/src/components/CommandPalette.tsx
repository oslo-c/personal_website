import { useEffect, useMemo, useState } from "react";
import { useLocation } from "wouter";
import { Command as CommandIcon, FileText, FlaskConical, FolderKanban, Home, Search, User, Download } from "lucide-react";
import { useProjects } from "@/hooks/use-projects";
import { useLabNotes } from "@/hooks/use-lab-notes";
import { usePages } from "@/hooks/use-pages";
import { cn } from "@/lib/utils";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";

type NavItem = { title: string; href: string; icon: React.ComponentType<{ className?: string }> };

export function CommandPalette(props: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [, navigate] = useLocation();
  const [query, setQuery] = useState("");

  const pages = usePages();
  const projects = useProjects();
  const labNotes = useLabNotes();

  const navItems: NavItem[] = useMemo(
    () => [
      { title: "Home", href: "/", icon: Home },
      { title: "About", href: "/about", icon: User },
      { title: "Projects", href: "/projects", icon: FolderKanban },
      { title: "Lab Notes", href: "/lab-notes", icon: FlaskConical },
      { title: "Resume", href: "/resume", icon: Download },
    ],
    [],
  );

  const filteredProjects = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!projects.data) return [];
    if (!q) return projects.data.slice(0, 8);
    return projects.data
      .filter((p: any) => `${p.title} ${p.oneLiner} ${p.techStack ?? ""}`.toLowerCase().includes(q))
      .slice(0, 10);
  }, [projects.data, query]);

  const filteredNotes = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!labNotes.data) return [];
    if (!q) return labNotes.data.slice(0, 8);
    return labNotes.data.filter((n: any) => `${n.title} ${n.content}`.toLowerCase().includes(q)).slice(0, 10);
  }, [labNotes.data, query]);

  const filteredPages = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!pages.data) return [];
    if (!q) return pages.data.slice(0, 8);
    return pages.data.filter((p: any) => `${p.title} ${p.summary ?? ""} ${p.slug}`.toLowerCase().includes(q)).slice(0, 10);
  }, [pages.data, query]);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        if (e.key === "/") {
          const tag = (e.target as HTMLElement | null)?.tagName?.toLowerCase();
          if (tag === "input" || tag === "textarea" || (e.target as HTMLElement | null)?.isContentEditable) return;
        }
        e.preventDefault();
        props.onOpenChange(!props.open);
      }
      if (e.key === "Escape" && props.open) props.onOpenChange(false);
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [props.open, props.onOpenChange]);

  const go = (href: string) => {
    props.onOpenChange(false);
    setQuery("");
    navigate(href);
  };

  return (
    <CommandDialog open={props.open} onOpenChange={props.onOpenChange}>
      <div className="surface-grid">
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Type a page, project, or note…"
          data-testid="command-input"
        />
      </div>
      <CommandList className="max-h-[70vh]">
        <CommandEmpty>
          <div className="px-2 py-10 text-center">
            <div className="mx-auto grid h-11 w-11 place-items-center rounded-md border bg-card shadow-sm">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <div className="mt-3 text-sm font-medium">No results</div>
            <div className="mt-1 text-xs text-muted-foreground">
              Try a different query. Use <span className="kbd">/</span> to open from anywhere.
            </div>
          </div>
        </CommandEmpty>

        <CommandGroup heading="Navigate">
          {navItems.map((it) => {
            const Icon = it.icon;
            return (
              <CommandItem
                key={it.href}
                onSelect={() => go(it.href)}
                data-testid={`command-nav-${it.title.toLowerCase().replace(/\s/g, "-")}`}
                className={cn("gap-2")}
              >
                <Icon className="h-4 w-4 text-muted-foreground" />
                <span>{it.title}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Pages">
          {filteredPages.map((p: any) => (
            <CommandItem
              key={p.slug}
              onSelect={() => go(`/p/${p.slug}`)}
              data-testid={`command-page-${p.slug}`}
              className="gap-2"
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{p.title}</span>
              <span className="mono-chip">/p/{p.slug}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Projects">
          {filteredProjects.map((p) => (
            <CommandItem
              key={p.slug}
              onSelect={() => go(`/projects/${p.slug}`)}
              data-testid={`command-project-${p.slug}`}
              className="gap-2"
            >
              <FolderKanban className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{p.title}</span>
              <span className="mono-chip">/projects/{p.slug}</span>
            </CommandItem>
          ))}
        </CommandGroup>

        <CommandSeparator />

        <CommandGroup heading="Lab Notes">
          {filteredNotes.map((n) => (
            <CommandItem
              key={n.slug}
              onSelect={() => go(`/lab-notes/${n.slug}`)}
              data-testid={`command-lab-note-${n.slug}`}
              className="gap-2"
            >
              <CommandIcon className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{n.title}</span>
              <span className="mono-chip">/lab-notes/{n.slug}</span>
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
