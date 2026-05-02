# Scroll-Driven Portfolio Showcase (Laptop + Video System)

## Objective

Build a high-end, scroll-driven portfolio section where:

* A hero intro transforms into a pinned showcase
* Projects are displayed inside a laptop mockup
* Videos play inside the laptop screen
* Transitions between projects are smooth, synchronized, and state-driven
* No heavy 3D or runtime rendering is used

This system prioritizes **illusion, synchronization, and control**, not complexity.

---

## Core Mental Model

This is **not a continuous animation system**.

It is a **state machine driven by scroll**:

```
scroll → progress (0 → 1) → activeIndex → transition timeline
```

* `progress` is continuous
* `activeIndex` is discrete (0, 1, 2, 3)
* Animations trigger **only when index changes**

---

## Section Breakdown

### Phase 1 — Intro Transformation

Initial state:

* Title ("Selected Work")
* Subtitle
* Small preview rectangle (contains laptop system, scaled down)

On scroll:

* Section is pinned
* A GSAP timeline (with `scrub`) handles:

  1. Title scales down and moves upward
  2. Subtitle follows
  3. Preview rectangle scales up → becomes main stage
  4. Stage shifts left
  5. Right-side content fades/slides in

End state:

* Title becomes a small label at top
* Laptop showcase is centered
* Content panel appears on the right

---

### Phase 2 — Pinned Showcase

This is where the project system runs.

* Section remains pinned
* Scroll is mapped to `progress`
* `progress` determines `activeIndex`

```
activeIndex = Math.floor(progress * totalProjects)
```

When `activeIndex` changes:
→ trigger a transition timeline

---

## Asset Preparation (Critical)

### Laptop Images

* 4 images (one per project)
* Same resolution
* Same camera angle
* Same exact positioning
* Screen area must align perfectly across all

### Videos

* 4 MP4 videos
* Same aspect ratio
* Cropped to fit screen perfectly
* Loopable
* Muted

Misalignment here breaks the entire illusion.

---

## DOM Structure (Conceptual)

```
<section class="work">

  <div class="work__intro">
    <h2>Selected Work</h2>
    <p>Subtitle</p>
    <div class="preview"></div>
  </div>

  <div class="work__stage">

    <div class="laptop-stack">
      <img data-project="0" />
      <img data-project="1" />
      <img data-project="2" />
      <img data-project="3" />
    </div>

    <div class="media-container">
      <video data-project="0" />
      <video data-project="1" />
      <video data-project="2" />
      <video data-project="3" />
    </div>

    <div class="content">
      <h3></h3>
      <p></p>
      <button>View Case Study</button>
    </div>

  </div>

</section>
```

---

## Video System (Key Mechanism)

### All Videos Are Always Playing

Each video has:

* `autoplay`
* `muted`
* `loop`
* `playsinline`

There is:

* no play/pause logic
* no source swapping

All videos run simultaneously in the background.

---

### Stacking

All videos:

* occupy the same position
* same dimensions
* absolutely positioned

They differ only by:

* `clip-path`
* `transform`
* `z-index`

---

### Visibility Control (Clip Path)

Active video:

```
clip-path: inset(0% 0% 0% 0%)
```

Hidden video:

```
clip-path: inset(100% 0% 0% 0%)
```

---

### Transition (Project Switch)

When switching from project A → B:

1. Video B is already playing (hidden)

2. Animate:

   * Video B:

     ```
     clip-path: inset(100% → 0%)
     ```

     (reveals from bottom to top)

   * Video A and B:

     ```
     scale: 1 → 1.05 → 1
     ```

     (shared motion)

3. After transition:

   * Video A remains hidden
   * Video B is fully visible

No flicker. No restart.

---

## Laptop Image System

Mirrors the video system.

Two approaches:

* stack images and animate with `clip-path` (preferred)
* or swap after transition

Best approach:

* use same wipe logic as videos
* keep both layers synchronized

---

## Transition Timeline (Per Index Change)

Every project switch runs this sequence:

1. **Stage Scale Up**

   * subtle zoom (1 → 1.05)

2. **Wipe Transition**

   * new image + video reveal via `clip-path`

3. **Text Transition**

   * old content fades out + shifts
   * new content fades in

4. **Scale Normalize**

   * return to scale 1

Optional:

* slight variation for even/odd indices

---

## Scroll Handling

Use a pinned ScrollTrigger:

```
start: "top top"
end: "+=3000"
scrub: true
```

But:

* DO NOT animate transitions directly with scrub
* Use scrub only to compute `progress`

---

## Index Change Logic

```
let previousIndex = -1

onUpdate(progress):
  index = floor(progress * total)

  if index !== previousIndex:
    runTransition(previousIndex, index)
    previousIndex = index
```

---

## Text + Content Panel

For each project:

* title
* description
* CTA button

Transition:

* fade out old
* fade in new
* slight vertical motion

Keep it fast and clean.

---

## Progress Indicator

Derived only:

```
display = index + 1 / total
```

Can be:

* text (e.g. "02 / 04")
* progress bar (width = progress)

---

## Performance Guidelines

Keep within limits:

* max 4 videos
* 720p–1080p
* compressed bitrate
* images optimized (WebP)

Animate only:

* `transform`
* `opacity`
* `clip-path`

Avoid:

* layout changes
* DOM creation/removal
* video source swapping

---

## Build Order (Important)

1. Static layout (no animation)
2. Align laptop + video perfectly
3. Implement video stacking + clip-path manually
4. Add transition timeline (no scroll)
5. Add index logic
6. Connect scroll → progress → index
7. Build intro animation

---

## Key Principles

* Everything is layered, not replaced
* Everything is preloaded, not triggered
* Scroll selects states, not frames
* Transitions are controlled, not reactive

---

## Outcome

If implemented correctly:

* No flicker
* No lag
* Perfect visual alignment
* Seamless transitions
* High-end “agency” feel without heavy rendering

---

## Current Implementation Context

The first implementation is only a prototype to validate the engine.

Available assets:

* 4 final laptop/background images
* Each image canvas size: `1600px × 1200px`
* Laptop position is already aligned across all images
* Laptop screen video area: approximately `830px × 532px`
* Only 2 test videos are available for now
* Reuse the 2 videos across the 4 projects temporarily:
  * Project 1 → Video 1
  * Project 2 → Video 2
  * Project 3 → Video 1
  * Project 4 → Video 2

The goal of this stage is not final content quality.  
The goal is to prove:

* the image stack aligns
* the video fits inside the laptop screen
* clip-path wipes work
* project switching works
* text transitions sync correctly
* no flicker happens between states

Do not implement the full scroll sequence first.

Start with manual project switching using buttons or temporary controls.  
Only after the manual switch system works should ScrollTrigger be connected.

## Required Technical Stack

Use:

* React
* TypeScript
* GSAP
* ScrollTrigger later, not in the first prototype
* Tailwind CSS if useful, but keep animation logic in GSAP

## Initial Prototype Requirements

Build a data-driven component with a `projects` array.

Each project should contain:

* id
* title
* short description
* image source
* video source
* case study URL or placeholder

The component should:

* render all 4 images at once
* render all 4 video elements at once
* stack them absolutely
* avoid dynamically mounting/unmounting during transitions
* avoid swapping video `src`
* use `clip-path` to reveal/hide layers
* keep videos muted, autoplaying, looping, and playsInline

## Important Styling Constraints

The main visual canvas should respect the original image ratio:

* base image ratio: `1600 / 1200`
* use `aspect-ratio: 1600 / 1200`

The screen overlay must be positioned relative to the 1600×1200 canvas.

The screen box is approximately:

* width: `830px`
* height: `532px`

Use percentage-based positioning once the exact screen coordinates are known.

Example formula:

```ts
const screenStyle = {
  left: `${screenLeft / 1600 * 100}%`,
  top: `${screenTop / 1200 * 100}%`,
  width: `${830 / 1600 * 100}%`,
  height: `${532 / 1200 * 100}%`,
}

Do not hardcode pixel positioning unless the stage is fixed at 1600×1200.

Manual Transition Function

Create a function:

switchProject(nextIndex: number)

It should:

Ignore the call if nextIndex === activeIndex
Prevent overlapping transitions while one is running
Identify:
current image
next image
current video
next video
Put the next image/video above the current layers
Set next image/video to:
clip-path: inset(100% 0% 0% 0%)
Animate next image/video to:
clip-path: inset(0% 0% 0% 0%)
Apply a subtle shared scale pulse to the stage:
scale: 1 → 1.04 → 1
Animate text out, update content, then animate text in
After transition:
previous image/video should become hidden
next image/video should remain visible
update activeIndex
Do Not Do Yet

Do not add the hero intro animation yet.

Do not add ScrollTrigger yet.

Do not build the final scroll-based active index yet.

Do not optimize prematurely.

First objective: make manual project switching look correct and smooth.