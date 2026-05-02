export type CursorType = "arrow" | "hand" | "ibeam"

export type ProblemTone = "sales" | "stock" | "expense"

export type Problem = {
  id: string
  tone: ProblemTone
  cursor: CursorType
  label: string
  steps: string[]
  struggleLine: string
  ashLine: string
  position: { x: number; y: number }
  rotate: number
  color: string
}
