import { and, desc, eq, ilike, or } from "drizzle-orm";
import { db } from "./db";
import {
  labNotes,
  projects,
  sitePages,
  type LabNoteResponse,
  type ListQueryParams,
  type SitePageResponse,
  type ProjectResponse,
} from "@shared/schema";

export interface IStorage {
  listPages(query?: ListQueryParams): Promise<SitePageResponse[]>;
  getPageBySlug(slug: string): Promise<SitePageResponse | undefined>;

  listProjects(query?: ListQueryParams): Promise<ProjectResponse[]>;
  getProjectBySlug(slug: string): Promise<ProjectResponse | undefined>;

  listLabNotes(query?: ListQueryParams): Promise<LabNoteResponse[]>;
  getLabNoteBySlug(slug: string): Promise<LabNoteResponse | undefined>;

  seedIfEmpty(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async listPages(query?: ListQueryParams): Promise<SitePageResponse[]> {
    const search = query?.search?.trim();

    if (!search) {
      return await db.select().from(sitePages).orderBy(sitePages.slug);
    }

    return await db
      .select()
      .from(sitePages)
      .where(or(ilike(sitePages.title, `%${search}%`), ilike(sitePages.content, `%${search}%`)))
      .orderBy(sitePages.slug);
  }

  async getPageBySlug(slug: string): Promise<SitePageResponse | undefined> {
    const [row] = await db.select().from(sitePages).where(eq(sitePages.slug, slug)).limit(1);
    return row;
  }

  async listProjects(query?: ListQueryParams): Promise<ProjectResponse[]> {
    const search = query?.search?.trim();

    if (!search) {
      return await db.select().from(projects).orderBy(projects.slug);
    }

    return await db
      .select()
      .from(projects)
      .where(
        or(
          ilike(projects.title, `%${search}%`),
          ilike(projects.oneLiner, `%${search}%`),
          ilike(projects.overview, `%${search}%`),
        ),
      )
      .orderBy(projects.slug);
  }

  async getProjectBySlug(slug: string): Promise<ProjectResponse | undefined> {
    const [row] = await db
      .select()
      .from(projects)
      .where(eq(projects.slug, slug))
      .limit(1);
    return row;
  }

  async listLabNotes(query?: ListQueryParams): Promise<LabNoteResponse[]> {
    const search = query?.search?.trim();

    if (!search) {
      return await db.select().from(labNotes).orderBy(desc(labNotes.date));
    }

    return await db
      .select()
      .from(labNotes)
      .where(or(ilike(labNotes.title, `%${search}%`), ilike(labNotes.content, `%${search}%`)))
      .orderBy(desc(labNotes.date));
  }

  async getLabNoteBySlug(slug: string): Promise<LabNoteResponse | undefined> {
    const [row] = await db
      .select()
      .from(labNotes)
      .where(eq(labNotes.slug, slug))
      .limit(1);
    return row;
  }

  async seedIfEmpty(): Promise<void> {
    const existingProjects = await db.select({ id: projects.id }).from(projects).limit(1);
    if (existingProjects.length === 0) {
      await db.insert(projects).values([
        {
          slug: "orpheos",
          title: "Orpheos",
          oneLiner: "Orchestrating multi-model AI systems to accelerate expert output.",
          overview:
            "Built an AI-native document editor utilizing 5 frontier LLMs for cross-model debate and synthesis. Designed orchestration logic to maximize implemented creative potential while stabilizing emergent behavioral conflicts in high-stakes production workflows.",
          architecture:
            "System Components:\n- Orchestration Layer: cross-model interaction logic and budget management\n- Synthesis Engine: artifact consolidation from multiple frontier LLMs\n- Conflict Resolution: behavioral stability and consensus modules",
          technicalDecisions:
            "- Evaluated multiple frontier LLMs for specialized synthesis tasks\n- Implemented deterministic orchestration for interaction reproducibility",
          techStack:
            "TypeScript, Node.js, AI Model Orchestration, Frontier LLMs",
          links:
            "Repository: (Internal)",
          lessonsLearned:
            "Automation in creative workflows requires explicit arbitration protocols to maintain business-grade reliability.",
        },
        {
          slug: "imagine-replay",
          title: "Imagine Replay",
          oneLiner: "Transforming media discovery through semantic AI automation.",
          overview:
            "Developed a voice-driven AI search agent to automate content discovery based on mood and pacing. Scraped data for 1200+ films and embedded 250k films into a vector database to optimize search efficiency and catalog ROI.",
          architecture:
            "Search Architecture:\n- Voice Interface: real-time intent extraction\n- Vector Database: Milvus-based semantic search (250k embeddings)\n- Metadata Filter: structured constraint management\n- Ingestion Pipeline: automated film data scraping",
          technicalDecisions:
            "- Selected Milvus for high-scale vector search with complex filtering\n- Implemented custom embeddings for film-specific attributes",
          techStack:
            "Python, Milvus, Vector Databases, Semantic Search",
          links:
            "Tech Demos: (Internal)",
          lessonsLearned:
            "Vector search precision is a direct driver of user retention and discovery ROI.",
        },
        {
          slug: "mountain-leisure-living",
          title: "Mountain Leisure Living",
          oneLiner: "Automating enterprise operations to scale service capacity.",
          overview:
            "Advised on system architecture for CRM and field service management. Developed a Work Order generation system automating 800+ service visits per month across 23 SLA classes, directly reducing management turnover and overhead.",
          architecture:
            "System Layers:\n- CRM Integration: data synchronization and legacy migration\n- Automation Pipeline: automated Work Order generation for 23 SLA classes\n- IT Infrastructure: secure centralized remote access for 15+ devices\n- API Bridge: custom REST API integration for real-time scheduling",
          technicalDecisions:
            "- Normalized customer data using Power Query (M) for migration accuracy\n- Automated scheduling via REST API integrations",
          techStack:
            "Power Query (M), Zoho, Shopify, WorkWave, REST APIs",
          links:
            "Case Study: (Internal)",
          lessonsLearned:
            "Real-world automation requires meticulous data normalization to survive operational pressure.",
        },
      ]);
    }

    const existingNotes = await db.select({ id: labNotes.id }).from(labNotes).limit(1);
    if (existingNotes.length === 0) {
      await db.insert(labNotes).values([
        {
          slug: "automation-roi",
          title: "Measuring the ROI of AI-driven automation",
          date: new Date("2025-02-12T12:00:00.000Z"),
          content:
            "Automation isn't just about speed; it's about shifting the ceiling of what a team can produce. When we orchestrate models to handle the synthesis of structured artifacts, we free humans to focus on direction and decision-making. I'm focusing on systems where automation serves a clear business goal.",
        },
        {
          slug: "cross-model-synthesis",
          title: "Stabilizing emergent conflicts in model synthesis",
          date: new Date("2025-02-10T12:00:00.000Z"),
          content:
            "Notes on stabilizing conflicts during cross-model interactions. When 5 frontier models debate, behavioral divergence is the norm. I've been refining arbitration logic to prioritize synthesis over raw output, ensuring a stable consensus artifact.",
        },
      ]);
    }

    const existingPages = await db.select({ id: sitePages.id }).from(sitePages).limit(1);
    if (existingPages.length === 0) {
      await db.insert(sitePages).values([
        {
          slug: "about",
          title: "About",
          summary: "Systems engineer maximizing business potential through AI automation.",
          content:
            "I build systems at the intersection of software engineering, AI orchestration, and infrastructure. Currently, I am a Computer Science student at the University of Washington (Paul G. Allen School), where I focus on translating ambiguous goals into structured, executable systems that deliver real-world business value.\n\nMy approach is rooted in rigor and accountability. I excel in environments where quality is the primary measure and difficult problems are the norm. I treat AI not as a novelty, but as a development partner—a cognitive multiplier designed to maximize human creativity, productivity, and potential through strategic automation.\n\nBeyond technical implementation, I value the discipline of shared goals. I spent 12 years pitching on competitive baseball teams, learning to handle pressure while sharing both wins and losses with teammates. I also competed in Team Policy debate for four years, ranking 73rd in the nation, which sharpened my ability to build arguments and reason through complexity in real-time.\n\nMost recently, I spent eighteen months consulting on an operational overhaul for a field-service business, building automated systems that reduced management turnover and delivered tools with real-world consequences. I am currently building orchestration logic at Orpheos and leading Lilybrook Consulting (UW Consulting Club) as Founder and President.",
        },
        {
          slug: "resume",
          title: "Resume",
          summary: "Ethan Hamilton — Systems Engineer / AI-Native Builder",
          content:
            "## Education\n- **University of Washington**: B.S. Computer Science (GPA: 3.77)\n- **Bellevue College**: AAS Direct Transfer Agreement (GPA: 3.94)\n\n## Experience\n- **Orpheos, LLC**: Product Development Intern (AI)\n- **Mountain Leisure Living**: Consulting (Tech Strategy and Implementation)\n- **Imagine Replay**: Product Development Intern (AI)\n\n## Extracurricular\n- **Lilybrook Consulting**: Founder/President\n- **AI Hackathon**: First Place\n- **Leaner Startups**: Head of Business Development\n\n## Tools & Languages\n- **Languages**: Python, Java, Javascript, Power Query (M)\n- **Platforms**: Zoho, Shopify, RouteManager (WorkWave)\n- **Tools**: Linux, Docker, Milvus, Tailscale, Excel, Jupyter\n- **Certifications**: OCI Foundations Associate (2025)",
        },
        {
          slug: "contact",
          title: "Contact",
          summary: "Technical inquiries and collaboration.",
          content:
            "Email: hamil4@uw.edu\nLinkedIn: linkedin.com/in/ethanphamilton\nLocation: Seattle, Washington",
        },
      ]);
    }

  }
}

export const storage = new DatabaseStorage();
