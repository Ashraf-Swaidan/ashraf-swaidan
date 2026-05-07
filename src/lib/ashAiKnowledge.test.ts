import assert from "node:assert/strict"

import {
  buildAshAiSupplementalContext,
  selectedKnowledgeTitles,
} from "./ashAiKnowledge.ts"

function ask(content: string) {
  return [{ role: "user" as const, content }]
}

function run(name: string, fn: () => void) {
  fn()
  console.log(`ok - ${name}`)
}

run("grounds AK requests in AK-specific context", () => {
  const context = buildAshAiSupplementalContext(ask("tell me about AK system"))
  assert.match(context, /AK System/i)
  assert.match(context, /offline-first/i)
  assert.doesNotMatch(context, /No strong match found/i)
})

run("prefers education note-aware grounding", () => {
  const context = buildAshAiSupplementalContext(
    ask("what is Ashraf's education background?")
  )
  assert.match(context, /Lebanese International University/i)
  assert.match(context, /noteId "a-about-3"/i)
})

run("pulls Duwit serious-mode framing", () => {
  const context = buildAshAiSupplementalContext(
    ask("what makes Duwit different from normal AI chat?")
  )
  assert.match(context, /serious-mode|serious mode/i)
  assert.match(context, /hype man|vague hype/i)
})

run("pulls Twodo one-click and low-friction framing", () => {
  const context = buildAshAiSupplementalContext(
    ask("what is Twodo optimizing for?")
  )
  assert.match(context, /one-click|one click/i)
  assert.match(context, /little friction|fewer steps|tour of the interface/i)
})

run("pulls Papion operational specifics", () => {
  const context = buildAshAiSupplementalContext(ask("tell me about Papion"))
  assert.match(context, /eight inventories/i)
  assert.match(context, /wallets/i)
  assert.match(context, /role-aware/i)
})

run("surfaces biography and process on personal questions", () => {
  const titles = selectedKnowledgeTitles(
    ask("who is Ashraf and how does he work?")
  )
  assert.ok(titles.includes("Ashraf biography"))
  assert.ok(
    titles.includes("How Ashraf works") || titles.includes("How I Work")
  )
})

run("keeps unknowns explicit when no strong match exists", () => {
  const context = buildAshAiSupplementalContext(
    ask("what are Ashraf's pricing packages for freelance work?")
  )
  assert.match(
    context,
    /If a detail is not present here or in the base prompt, say it is not in the portfolio materials/i
  )
})

run("includes live-site facts for Duwit and Twodo", () => {
  const context = buildAshAiSupplementalContext(
    ask("which projects have live websites?")
  )
  assert.match(context, /duwit-45a37\.web\.app/i)
  assert.match(context, /twodo\.ashraf-swaidan-10\.workers\.dev/i)
  assert.match(context, /Papion: public case study only/i)
})

run("includes rare Papion feature material", () => {
  const context = buildAshAiSupplementalContext(
    ask("does papion support unifying loans or inventory export?")
  )
  assert.match(context, /Unify similar loans/i)
  assert.match(context, /Filtered exports|export it to Excel|barcode sheet/i)
})

run("includes full note catalog for note browsing", () => {
  const context = buildAshAiSupplementalContext(
    ask("list the notes you know about")
  )
  assert.match(context, /title="About me"/i)
  assert.match(context, /title="My Education"/i)
  assert.match(context, /title="The Disaster of the AI Era"/i)
})
