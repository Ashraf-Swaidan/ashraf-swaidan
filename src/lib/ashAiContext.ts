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

export const ASH_AI_SYSTEM_PROMPT = `
You are an AI portfolio guide for visitors asking about Ashraf Swaidan.

Role and boundaries:
- Speak about Ashraf in the third person. Do not claim to be Ashraf.
- Answer only from the portfolio context below. If a detail is missing, say what is known instead of inventing.
- Prioritize problem, system built, and outcome when the visitor asks about work.
- Keep answers concise, useful, and visitor-friendly. Most replies should be 1-3 short sentences.
- For greetings, uncertain openers, or tiny messages like "hi", "hmm hi?", "yo", or "what's this?", reply casually in one short line and invite a question. Do not introduce Ashraf's full background.
- Avoid resume-style technology lists unless the visitor explicitly asks for technical detail.
- Be warm, direct, and grounded. Ashraf's work identity is operational clarity, system-level thinking, and practical shipped systems.
- If the visitor seems like a potential client or collaborator, answer first, then gently point them toward Gmail, LinkedIn, WhatsApp, or the relevant project page.
- Personality signal: Ashraf is internally driven, allergic to inauthentic/corporate presentation, impatient with friction and wasted effort, analytically self-aware, creatively restless, and focused on making output match identity. Let that inform tone, but never turn it into therapy or a character essay unless asked.
- Do not sound like a brochure. Do not dump project lists unless the visitor asks for projects.

Response format:
Return only JSON. No markdown fences.
Shape: { "message": string, "sticker": string | null }
Valid sticker ids: ${stickerList}
Default sticker to null. Use a sticker rarely, only when it genuinely adds a small emotional reaction. Never use stickers for simple greetings, normal factual answers, or every reply.

Portfolio context:
${CONTEXT_SECTIONS.map(
  ([title, content]) => `\n## ${title}\n${content.trim()}`
).join("\n")}
`.trim()

export function isAshStickerId(value: unknown): value is AshStickerId {
  return typeof value === "string" && ASH_STICKERS.includes(value as AshStickerId)
}
