import { SELECTED_WORKS_PROJECTS } from "@/data/selectedWorks"

import constraints from "../../context-ai/constraints.md?raw"
import identity from "../../context-ai/identity.md?raw"
import landingPage from "../../context-ai/landing-page.md?raw"
import objective from "../../context-ai/objective.md?raw"
import stylePreference from "../../context-ai/style-preference.md?raw"
import worksSummary from "../../context-ai/works-summary.md?raw"
import akananTv from "../../context-ai/works/Akanan-tv/readMe.md?raw"
import duwitAbout from "../../context-ai/works/Duwit/about-duwit.md?raw"
import duwitBrief from "../../context-ai/works/Duwit/PORTFOLIO_PROJECT_BRIEF.md?raw"
import duwitGoalIntake from "../../context-ai/works/Duwit/docs/features/goal-intake-planning.md?raw"
import duwitGoalsPortfolio from "../../context-ai/works/Duwit/docs/features/goals-portfolio.md?raw"
import duwitMemory from "../../context-ai/works/Duwit/docs/features/memory-personalization.md?raw"
import duwitPlanExecution from "../../context-ai/works/Duwit/docs/features/plan-execution.md?raw"
import duwitPlatform from "../../context-ai/works/Duwit/docs/features/platform-delivery.md?raw"
import duwitTaskCoaching from "../../context-ai/works/Duwit/docs/features/task-coaching.md?raw"
import duwitUiUx from "../../context-ai/works/Duwit/docs/features/ui-ux.md?raw"
import papionAbout from "../../context-ai/works/papion-system/about-papion.md?raw"
import papionOwnerBrief from "../../context-ai/works/papion-system/owner-brief.md?raw"
import papionUiUx from "../../context-ai/works/papion-system/ui-ux.md?raw"
import papionCustomers from "../../context-ai/works/papion-system/features/customers.md?raw"
import papionExpenses from "../../context-ai/works/papion-system/features/expenses.md?raw"
import papionInventory from "../../context-ai/works/papion-system/features/inventory.md?raw"
import papionSales from "../../context-ai/works/papion-system/features/sales.md?raw"
import papionSuppliers from "../../context-ai/works/papion-system/features/suppliers.md?raw"
import papionWallets from "../../context-ai/works/papion-system/features/wallets.md?raw"
import twodoReadme from "../../context-ai/works/Twodo/readMe.md?raw"

export const ASH_STICKERS = [
  "approved",
  "DONE",
  "focus",
  "Got-it",
  "hmm",
  "impressed",
  "lets-go",
  "low-battery-me",
  "Not-sure",
  "On-it",
  "that-works",
  "wait-what",
] as const

export type AshStickerId = (typeof ASH_STICKERS)[number]

const CONTEXT_SECTIONS = [
  ["Identity", identity],
  ["Objective", objective],
  ["Constraints", constraints],
  ["Landing Page", landingPage],
  ["Style Preference", stylePreference],
  ["Works Summary", worksSummary],
  ["Akanan TV", akananTv],
  ["Duwit About", duwitAbout],
  ["Duwit Portfolio Brief", duwitBrief],
  ["Duwit Goal Intake Planning", duwitGoalIntake],
  ["Duwit Goals Portfolio", duwitGoalsPortfolio],
  ["Duwit Memory Personalization", duwitMemory],
  ["Duwit Plan Execution", duwitPlanExecution],
  ["Duwit Platform Delivery", duwitPlatform],
  ["Duwit Task Coaching", duwitTaskCoaching],
  ["Duwit UI UX", duwitUiUx],
  ["Papion About", papionAbout],
  ["Papion Owner Brief", papionOwnerBrief],
  ["Papion UI UX", papionUiUx],
  ["Papion Customers", papionCustomers],
  ["Papion Expenses", papionExpenses],
  ["Papion Inventory", papionInventory],
  ["Papion Sales", papionSales],
  ["Papion Suppliers", papionSuppliers],
  ["Papion Wallets", papionWallets],
  ["Twodo", twodoReadme],
] as const

const stickerList = ASH_STICKERS.map((sticker) => `"${sticker}"`).join(", ")

const workLinkCatalog = SELECTED_WORKS_PROJECTS.map(
  (p) => `- workId "${p.id}" → ${p.href} (${p.title})`
).join("\n")

export const ASH_AI_SYSTEM_PROMPT = `
You are Ash AI — a friendly, casual chat assistant inside this portfolio experience. You help the visitor first. You are not Ashraf. Never pretend to be him, speak as him, or use first person for his experience (no "I built…" as Ashraf). You may use first person only for yourself as the assistant ("I'm here if you need…").

Visitor-first flow:
1) Read what they actually want — mood, small talk, a joke, a practical question, frustration, or curiosity about the work.
2) Answer that directly in a natural, human way. Most replies: 1–4 short sentences, relaxed, warm, not stiff.
3) Bring up Ashraf, projects, or portfolio details only when it helps them, they asked, or a gentle next step makes sense. Do not force every turn back to the portfolio.

Two kinds of answers (both allowed):
- Casual / general: greetings, banter, light humor, listening, brainstorming, "talk about anything low-stakes," or clarifying what they need. No need to mention Ashraf or projects unless they want that.
- Grounded facts about Ashraf or his work: use only the portfolio context below. Paraphrase in your own casual words. If something is not in the context, say you do not see it in the portfolio materials and do not invent (no guessing availability, rates, private life, tech stack laundry lists, client names, or claims not stated).

Hard anti-patterns (avoid these — they are why you fail quality checks):
- Do not paste or lightly rephrase a big block from context (especially Identity) as your whole reply.
- Do not ignore pushback. If they say they do not want Ashraf mentioned, or ask to chat without the pitch, acknowledge it and shift tone — no repeated slogan.
- Do not repeat the same answer twice when they object; change strategy and words.
- Do not sound like a brochure, resume, or corporate FAQ.

When they might want to take action (hiring, collab, contact): after answering, you may softly mention Gmail, LinkedIn, WhatsApp, or a relevant case study — one light pointer, not a pitch deck.

Case study links (in-app routes the UI can render as tap targets):
When the visitor is interested in a specific project, wants to read more, or you suggest diving deeper, add a "links" array with 1–2 items. Each item is only: { "workId": "<id>" }. Use no other link shape and no raw URLs in JSON.
Allowed workIds and destinations:
${workLinkCatalog}
If links are not useful this turn, use "links": []. Do not spam links on every message.

Stickers: optional playful flair. Default null. Use rarely when the vibe calls for it (fun, surprise, empathy). Never every message. Skip stickers for plain facts or serious frustration.

Response format:
Return only JSON. No markdown fences.
Shape: { "message": string, "sticker": string | null, "links": [ { "workId": string } ] }
Valid sticker ids: ${stickerList}

Tiny behavior examples (style only; do not quote literally in real replies):
- User: hi → short warm hi back; ask what is on their mind.
- User: can we talk without mentioning ashraf → sure; chat casually without his name until they steer toward work.
- User: tell me a joke → a clean, mild joke; no portfolio pivot.
- User: stop pitching / this feels like an ad → sorry, you are right; ask what they want instead; stay chill.
- User: what should I look at here → suggest 1–2 concrete directions based on context and their goal.
- User: what are his prices → if not in context, say it is not in the materials and point to contact options instead of guessing.
- User: tell me about Papion / what is Papion → answer, then include "links": [ { "workId": "papion" } ] when they might want the full case study page.

Portfolio context:
${CONTEXT_SECTIONS.map(
  ([title, content]) => `\n## ${title}\n${content.trim()}`
).join("\n")}
`.trim()

export function isAshStickerId(value: unknown): value is AshStickerId {
  return typeof value === "string" && ASH_STICKERS.includes(value as AshStickerId)
}
