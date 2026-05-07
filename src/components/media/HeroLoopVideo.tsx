import type { VideoHTMLAttributes } from "react"

import { cn } from "@/lib/utils"

type HeroLoopVideoProps = Omit<
  VideoHTMLAttributes<HTMLVideoElement>,
  "muted" | "loop" | "playsInline" | "autoPlay" | "preload"
> & {
  /** Default `auto` pulls enough data for smoother first-loop on heroes. */
  preload?: HTMLVideoElement["preload"]
}

/** Above-the-fold heroes: muted loop with eager-enough buffering. */
export function HeroLoopVideo({
  className,
  preload = "auto",
  poster,
  ...rest
}: HeroLoopVideoProps) {
  return (
    <video
      className={cn(className)}
      poster={poster}
      autoPlay
      muted
      loop
      playsInline
      preload={preload}
      {...rest}
    />
  )
}
