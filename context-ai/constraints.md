# Constraints

This document defines strict boundaries for design, content, and implementation decisions.

---

Content Constraints:
- All npm commands shall be done my myself manually, you tell me the command and i do it
- Do not introduce personal narrative or storytelling beyond functional context
- Do not include technology stack explanations in the UI
- Do not present the portfolio as a resume or CV
- Do not prioritize process over outcomes
- Do not add filler content for visual balance

All content must map to one of the following:
- Problem
- System built
- Outcome achieved

---

Design Constraints:

- Avoid visual clutter at all times
- Do not overuse colors or gradients
- Do not introduce decorative elements without functional purpose
- Avoid excessive shadows, blur effects, or visual noise
- Do not rely on animation as decoration

---

Motion Constraints:

- All animations must be purposeful and tied to scroll or interaction state
- No infinite or looping animations unless functionally necessary
- Avoid simultaneous competing motion layers
- All motion must be transform/opacity-based for performance

---

Structural Constraints:

- The portfolio must not behave like a traditional multi-page website
- Sections should behave as narrative states rather than separate pages
- Each section must contribute to a single unified narrative flow
- Avoid redundant navigation elements

---

AI Generation Constraints:

When generating UI or code:
- Prefer simplicity over abstraction
- Avoid over-engineering component structures
- Do not introduce unnecessary libraries or architectural patterns
- Maintain direct mapping between intent and implementation

---

Behavioral Constraint:

Every element in the interface must answer one question:

"What does this contribute to understanding the system or the outcome?"

If the answer is unclear, the element must not exist.