/** Hardcoded portfolio notes (read-only for visitors). */
export type NotesFolderMeta = {
  id: string
  label: string
  kind: "folder" | "trash"
}

export type AuthorNote = {
  id: string
  folderId: string
  title: string
  body: string
  createdAt: number
  updatedAt: number
  tags?: string[]
}

export const NOTES_ACCENT = "#e1b400"

export const NOTES_FOLDERS: NotesFolderMeta[] = [
  { id: "about-me", label: "About me", kind: "folder" },
  { id: "work", label: "Work", kind: "folder" },
  { id: "my-thoughts-about-ai", label: "My Thoughts About AI", kind: "folder" },
  { id: "visitor-notes", label: "Visitor notes", kind: "folder" },
  { id: "recently-deleted", label: "Recently deleted", kind: "trash" },
]

const T = (y: number, m: number, d: number) =>
  new Date(Date.UTC(y, m - 1, d)).getTime()

export const AUTHOR_NOTES: AuthorNote[] = [
  {
    id: "a-about-1",
    folderId: "about-me",
    title: "About me",
    body:
      "I'm Ashraf Swaidan, a 22-year-old developer from Lebanon.\n\nI graduated with a Computer Science degree, though most of what shaped me came outside the classroom. During university, I was simultaneously working inside Papion, an event decoration business and Print & Cut workshop, where I eventually led workshop operations while building internal software systems alongside it.\n\nThat environment exposed me to far more than code.\n\nI worked directly with customers on a daily basis, handled constantly changing requirements, helped manage real operational pressure, and learned how businesses actually function beyond theory. Leading part of the workshop taught me communication, decision making, business analysis, workflow thinking, and the importance of building systems around real human behavior rather than ideal assumptions.\n\nAlongside operations, I worked across design, production workflows, printing systems, machine-related software, and fabrication processes. I also built strong experience with Photoshop and Illustrator, while working with After Effects, Premiere Pro, and various software connected to workshop machinery and production pipelines.\n\nOver the past few years, I've been building [Papion System](/works/papion-system), a custom internal platform that gradually transformed how the business operates. Through that journey, I taught myself far beyond the limits of the university curriculum, learning frontend engineering, UX thinking, workflow optimization, business logic architecture, and the realities of maintaining software people genuinely rely on every day.\n\nI also grew alongside the rise of AI tools.\n\nRather than treating AI as something that replaces thinking, I learned how to work with it as an accelerator for experimentation and execution. Tools like Cursor and Codex became part of my workflow, helping me move faster while still keeping problem-solving, judgment, and product direction deeply human.\n\nOutside of Papion, I've worked on smaller systems for other businesses, as well as personal tools designed around problems I couldn't find existing solutions for myself.\n\nMost of my journey after graduation has been solo, and honestly, I miss collaboration. I enjoy working with people who genuinely care about what they build, and I'm excited to create alongside others again.\n\nIf you think my mindset fits your team or project, feel free to reach out.",
    createdAt: T(2025, 11, 2),
    updatedAt: T(2026, 1, 18),
    tags: ["#Portfolio"],
  },
  {
    id: "a-about-2",
    folderId: "about-me",
    title: "How I Work",
    body:
      "The title says \"How,\" but for me, everything starts with why.\n\nThere is always a reason something exists, and most of the time, that reason is a problem waiting to be solved. I naturally gravitate toward friction, the annoying parts, the repetitive workflows, the moments where something feels heavier than it should be.\n\nThat's usually where my process begins.\n\nI research the problem deeply, explore different approaches, then choose the stack that fits the situation best. I'm not heavily attached to a single stack, and over the years I've experimented across many different ecosystems. On the frontend, though, React, Vite, and Tailwind have become my natural home. I also genuinely enjoy working with shadcn/ui when it fits the project.\n\nFor backend and personal systems, I've worked with PHP, Django, Node-based stacks, SQL, and NoSQL databases depending on the needs of the project.\n\nOnce the direction becomes clear, I design a blueprint, build a rough base version, and begin my favorite part of the process:\n\nIteration.\n\nI genuinely love iteration.\n\nBase versions are necessary, but refinement is where things become exciting. I enjoy taking something functional and continuously improving it, reducing friction, simplifying workflows, testing patterns, and turning processes that take seven steps into two.\n\nUX is always a priority in my work.\n\nThere were many moments where I built interfaces that looked \"correct\" on paper, only to realize after days of usage that repetition itself was becoming exhausting. That's usually when I start redesigning the experience around automation, smart defaults, suggestions, prefills, and reducing unnecessary effort.\n\nI want people using my software to feel spared from annoyance, not trapped inside it.\n\nI care deeply about interfaces that feel smooth, breathable, and psychologically comfortable to interact with. Design, to me, is not decoration. It's clarity, flow, rhythm, and reducing cognitive weight.\n\nPerformance is expected. Rethinking workflows is the real goal.\n\nI constantly question existing patterns, because I don't believe things are \"finished.\" Doubt is part of the process. There is almost always a better way to approach something, and discovering that better version is what keeps the work interesting to me.",
    createdAt: T(2025, 8, 14),
    updatedAt: T(2026, 2, 4),
  },
  {
    id: "a-about-3",
    folderId: "about-me",
    title: "My Education",
    body:
      "I studied Computer Science at Lebanese International University and graduated in late 2023.\n\nHonestly, university was way easier than I expected. High school felt so smooth that I thought university was going to be THE UNIVERSITY. Independence, responsibility, freedom, finally wearing whatever the hell you want instead of a uniform.\n\nBut in reality, it mostly felt like a template.\n\nAt some point, I realized I felt more trapped mentally than I ever did wearing an actual school uniform. A mental uniform. Same repeated structures, outdated curriculums, recycled PowerPoint slides, memorization over genuine understanding, and barely any real breakthroughs happening.\n\nI wouldn't fully blame the tutors though. Some were clearly struggling within the system themselves, while a few genuinely stood out and understood the deeper issues education in Lebanon faces.\n\nMost of the real learning I did happened outside the curriculum anyway.\n\nWhile studying, I was simultaneously self-learning newer technologies, building actual systems, experimenting constantly, and trying to stay connected to the real pace of technology rather than the academic version of it. Honestly, that never stopped. Even today, I'm always chasing the latest shifts in software, design, AI workflows, and problem-solving approaches.\n\nDespite all the criticism, I still loved parts of university life.\n\nI genuinely loved sitting under a certain tree in the university playground.\n\nIf you know, you know.",
    createdAt: T(2026, 5, 7),
    updatedAt: T(2026, 5, 7),
    tags: ["#Portfolio"],
  },
  {
    id: "a-work-1",
    folderId: "work",
    title: "Work notes placeholder",
    body: "I'll be writing here about the Behind the scenes of many of my works soon.",
    createdAt: T(2026, 5, 7),
    updatedAt: T(2026, 5, 7),
    tags: ["#Work"],
  },
  {
    id: "a-ai-thoughts-1",
    folderId: "my-thoughts-about-ai",
    title: "First Impression",
    body:
      "A year after getting into Computer Science, GPT-3.5 started flooding my FYPs.\n\nHonestly, for the first week, I barely cared. Then I tried it.\n\nAnd wow man, I genuinely did NOT see this coming.\n\nSuddenly, machine learning and NLP became more mainstream than ever, and AI stopped feeling like some distant research topic hidden behind giant companies and academic papers.\n\nPersonally, this was never about cheating homework or solving online tests.\n\nI was honestly just lost.\n\nI had already finished a year of university and still felt like:\n\"Wait... I still don't know how to build most real things.\"\n\nHow do people actually make mobile apps? Functional websites? Desktop software? Systems like Facebook, WhatsApp, Discord, or anything at scale? Where do all these concepts we're studying even connect together?\n\nI think I entered university with unreal expectations.\n\nTurns out every real product is a world on its own, and university was mostly teaching concepts rather than actual production reality.\n\nGPT became that reality check for me.\n\nBut more importantly, it stayed with me through every stage after that.\n\nAt this point, I probably text AI more than I text humans.\n\nI'm literally writing this right now inside ChatGPT, discussing my own thoughts with it, trying to articulate things better without losing a single genuine inch of myself in the process.",
    createdAt: T(2026, 5, 7),
    updatedAt: T(2026, 5, 7),
    tags: ["#Process"],
  },
  {
    id: "a-ai-thoughts-2",
    folderId: "my-thoughts-about-ai",
    title: "My Work And AI",
    body:
      "Cursor. Cursor. Cursor.\n\nIt's honestly been a long time since I fully wrote raw code completely alone from start to finish.\n\nAt first, the workflow was simple:\nwrite code -> paste into GPT -> get feedback -> improve it.\n\nThen AI became more like Stack Overflow on steroids.\nThen it became writing code with AI from the start instead of after the fact.\n\nAt some point, development stopped feeling like \"coding alone\" and became more like directing, iterating, debugging, structuring, and refining alongside a second brain.\n\nMeanwhile, AI companies kept marketing this dream where AI could supposedly build entire apps in one shot.\n\nHonestly?\nMost of it felt, and still feels, like slop.\n\nThe whole \"vibe-coding\" era never fully clicked for me. Tools promising instant perfect apps without touching files, architecture, workflows, or debugging always felt disconnected from reality. AI was still terrible at many things, especially setup, structure, maintenance, and long-term consistency.\n\nI didn't want pure raw coding.\nBut I also didn't want slop.\n\nI wanted something balanced between both extremes.\n\nThen Cursor released.\n\nAt the time, they offered one year free for students, and genuinely, it changed everything for me.\n\nFor the first time, AI stopped feeling like a separate tab in the browser and became part of the actual development environment itself. Editing files directly, iterating faster, planning systems, navigating codebases, restructuring components, fixing repetitive work; suddenly the workflow itself evolved.\n\nMy speed genuinely multiplied.\n\nI still consider Cursor one of the first truly foundational shifts in how developers interact with software creation. Even though they originally relied on external models and acted more like a middle layer, the experience itself was transformative.\n\nToday, AI tools and models are evolving at a ridiculous speed.\n\nHonestly, so fast that sometimes it feels impossible to fully keep up anymore.\n\nAnd weirdly enough, that speed itself became one of the biggest problems of this era.\n\nI wrote more about that in:\n[The Disaster of the AI Era.](note://a-ai-thoughts-3)",
    createdAt: T(2026, 5, 7),
    updatedAt: T(2026, 5, 7),
    tags: ["#Process"],
  },
  {
    id: "a-ai-thoughts-3",
    folderId: "my-thoughts-about-ai",
    title: "The Disaster of the AI Era",
    body:
      "AI brings trouble to many fields, but I'll talk from a developer's perspective.\n\nAI is insanely good right now. GPT-5.5 feels ridiculous at times, although very costly. But the better AI gets, the more it creates a strange problem for developers:\n\nCode intimacy.\n\nWe are slowly becoming brain-fried by the speed and scale AI brought into software.\n\nYou could spend a year carefully shipping something stable by yourself, while someone else ships a rougher version in two weeks with AI. It may be less stable, less understood, and less carefully built, but it works enough to exist.\n\nThat changes the market.\n\nIt raises competitiveness, compresses timelines, and makes things feel unfair for the careful ones. The stable ones. The people who don't want to blindly accept generated code on the go.\n\nFor me, I use Cursor, and I won't pretend otherwise. Cursor helps me ship AI-generated code, and honestly, I can feel the effect it has on me.\n\nI'm starting to become less doubtful of the code quality in the moment, and more addicted to asking for more features. More and more and more. It starts feeling like a dopamine spike of features.\n\nAnd that is dangerous.\n\nBecause suddenly, the project grows faster than your understanding of it.\n\nYou look at the codebase and realize there are too many files, too many changes, too many flows, and not enough time to fully read, debug, and understand everything. I'm the kind of person who genuinely hates not knowing how something works, so a large part of my work is now shifting toward reviewing, tracing, testing, and making sure the code is actually clean.\n\nCursor rules, MCPs, AI skills, and careful prompting all help produce more stable outputs. They make AI more controllable. More structured. Less random.\n\nBut still, something has changed.\n\nThe intimacy between our fingers and the code is fading.\n\nWe are entering a time where developers may be surrounded by mountains of files they barely touched directly, forced to trust that there is no hidden backdoor, no misunderstood logic, no fragile edge case waiting somewhere deep inside the system.\n\nThat scares me.\n\nBut I also think AI can help us fight the problems AI created.\n\nI'm currently working on an app that tries to bridge this gap. The idea is simple: every commit should not only change the codebase, but also come with a real explanation of what changed, why it changed, what files were affected, what features were touched, and how everything connects down to the smallest detail.\n\nBecause if AI is going to increase the speed of code, then we need tools that increase the speed of understanding too.\n\nModern problems require modern solutions.",
    createdAt: T(2026, 5, 7),
    updatedAt: T(2026, 5, 7),
    tags: ["#Process"],
  },
  {
    id: "a-ai-thoughts-4",
    folderId: "my-thoughts-about-ai",
    title: "How To Deal With AI As A Developer",
    body:
      "Prompt engineering is a very real thing.\n\nHonestly, I've never felt more proud of my linguistic skills than during the AI era. Long before AI, I spent years writing analytical content about shows, cinema, characters, and storytelling online, so I naturally became comfortable writing essays, long-form thoughts, and deeply detailed text.\n\nTurns out, that skill became insanely valuable with AI.\n\nPeople often imagine prompts as one-liners. In reality, some of my prompts are massive. Entire structured plans, detailed workflows, UI explanations, feature logic, architecture direction, edge cases, user experience intentions, all written carefully before even touching development.\n\nThe better the prompt, the better the output.\n\nIf you cannot deeply describe the project, then honestly, you probably do not fully understand what you are trying to build either.\n\nThat's why I almost always begin projects with multiple markdown files before writing real code. Usually things like:\nContext.\nPlan.\nUI preferences.\nGoals.\nArchitecture direction.\n\nStaying organized massively improves working with AI. Not only for the model itself, but for you as the developer too. Chaos in prompts usually becomes chaos in projects.\n\nAfter preparing the documentation, I usually provide the AI with base assets, references, screenshots, visual directions, or existing files, then begin building the first rough version of the app.\n\nAnd then comes iteration.\n\nIteration is honestly most of the process.\n\nThe base version is just the introduction. The real work starts afterward. Refining workflows, restructuring components, improving UX, simplifying interactions, optimizing layouts, fixing architectural mistakes, testing edge cases, rewriting features cleaner, and continuously making the product feel better.\n\nI also constantly cross-check outputs between different AI models. Sometimes I ask multiple models to critique the same files, challenge architecture decisions, or suggest better approaches. Then I iterate again based on the feedback.\n\nThe process starts becoming less like \"asking AI to make an app,\" and more like directing a constantly evolving technical discussion between multiple systems and yourself.\n\nThere's still a lot more I could write here.\n\nHonestly, this entire field still feels like it's only beginning.",
    createdAt: T(2026, 5, 7),
    updatedAt: T(2026, 5, 7),
    tags: ["#Process"],
  },
  {
    id: "a-visitor-1",
    folderId: "visitor-notes",
    title: "Welcome to this folder",
    body:
      "Anything you add here is saved only on your device — a small playful layer, like the Ash AI chats in this phone.\n\nIf you want me to actually read something, use Gmail or WhatsApp from the home screen.",
    createdAt: T(2026, 2, 10),
    updatedAt: T(2026, 2, 10),
    tags: ["#Portfolio"],
  },
]

export function authorNotesInFolder(folderId: string): AuthorNote[] {
  return AUTHOR_NOTES.filter((n) => n.folderId === folderId)
}

export function authorNoteCountByFolderId(): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const n of AUTHOR_NOTES) {
    counts[n.folderId] = (counts[n.folderId] ?? 0) + 1
  }
  return counts
}

export const NOTES_STATIC_TAGS = [
  "All tags",
  "#Portfolio",
  "#Process",
  "#Work",
] as const
