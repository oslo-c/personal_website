import { cn } from "@/lib/utils";

function escapeHtml(input: string) {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function formatInline(text: string) {
  // Inline code: `code`
  const escaped = escapeHtml(text);
  return escaped.replace(/`([^`]+)`/g, (_m, g1) => `<code>${g1}</code>`);
}

function markdownishToHtml(markdown: string) {
  const lines = markdown.replace(/\r\n/g, "\n").split("\n");

  let html = "";
  let inCode = false;
  let codeLang = "";
  let codeBuf: string[] = [];

  let paragraphBuf: string[] = [];
  let listBuf: string[] = [];
  const flushParagraph = () => {
    const p = paragraphBuf.join(" ").trim();
    if (p) html += `<p>${formatInline(p)}</p>`;
    paragraphBuf = [];
  };
  const flushList = () => {
    if (listBuf.length) {
      html += `<ul>${listBuf.map((li) => `<li>${formatInline(li)}</li>`).join("")}</ul>`;
      listBuf = [];
    }
  };

  for (const raw of lines) {
    const line = raw ?? "";

    const fence = line.match(/^```(\w+)?\s*$/);
    if (fence) {
      if (!inCode) {
        flushParagraph();
        flushList();
        inCode = true;
        codeLang = fence[1] ?? "";
        codeBuf = [];
      } else {
        const code = escapeHtml(codeBuf.join("\n"));
        const langAttr = codeLang ? ` data-lang="${escapeHtml(codeLang)}"` : "";
        html += `<pre${langAttr}><code>${code}</code></pre>`;
        inCode = false;
        codeLang = "";
        codeBuf = [];
      }
      continue;
    }

    if (inCode) {
      codeBuf.push(line);
      continue;
    }

    const h2 = line.match(/^##\s+(.+)$/);
    const h3 = line.match(/^###\s+(.+)$/);
    if (h2) {
      flushParagraph();
      flushList();
      html += `<h2>${escapeHtml(h2[1])}</h2>`;
      continue;
    }
    if (h3) {
      flushParagraph();
      flushList();
      html += `<h3>${escapeHtml(h3[1])}</h3>`;
      continue;
    }

    const li = line.match(/^\s*[-*]\s+(.+)$/);
    if (li) {
      flushParagraph();
      listBuf.push(li[1]);
      continue;
    }

    if (line.trim() === "") {
      flushParagraph();
      flushList();
      continue;
    }

    paragraphBuf.push(line.trim());
  }

  // flush remaining
  if (inCode) {
    const code = escapeHtml(codeBuf.join("\n"));
    const langAttr = codeLang ? ` data-lang="${escapeHtml(codeLang)}"` : "";
    html += `<pre${langAttr}><code>${code}</code></pre>`;
  } else {
    flushParagraph();
    flushList();
  }

  return html;
}

export function Prose(props: { content: string; className?: string; "data-testid"?: string }) {
  const html = markdownishToHtml(props.content);

  return (
    <div
      className={cn(
        "prose prose-slate max-w-none dark:prose-invert",
        "prose-headings:scroll-mt-24 prose-headings:tracking-tight",
        "prose-p:leading-relaxed prose-p:text-[0.98rem] md:prose-p:text-[1.02rem]",
        "prose-code:rounded-md prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:font-medium",
        "prose-pre:rounded-lg prose-pre:border prose-pre:bg-card prose-pre:shadow-sm",
        "prose-pre:p-4 md:prose-pre:p-5",
        "prose-pre:overflow-x-auto",
        "[&_*]:selection:bg-primary/20",
        "prose-pre:font-mono prose-code:font-mono",
        props.className,
      )}
      data-testid={props["data-testid"]}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
