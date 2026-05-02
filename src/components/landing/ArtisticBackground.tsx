export function ArtisticBackground() {
  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        aria-hidden
        style={{
          background: `radial-gradient(ellipse 80% 50% at 20% 40%, rgba(234, 10, 139, 0.14), transparent 60%),
                       radial-gradient(ellipse 60% 40% at 90% 70%, rgba(31, 114, 68, 0.11), transparent 50%)`,
        }}
      />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="how-float-slow absolute -left-[10%] top-[20%] h-[40vw] w-[40vw] rounded-full bg-[#EA0A8B] opacity-[0.04] blur-[80px]" />
        <div className="how-float-slower absolute -right-[5%] top-[50%] h-[50vw] w-[50vw] rounded-full bg-[#1F7244] opacity-[0.04] blur-[100px]" />
        <div className="how-float-medium absolute left-[30%] top-[80%] h-[30vw] w-[30vw] rounded-full bg-[#EA0A8B] opacity-[0.03] blur-[70px]" />
      </div>
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        aria-hidden
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0v60M0 30h60' stroke='%23000' stroke-width='0.6' fill='none'/%3E%3C/svg%3E")`,
          backgroundSize: "48px 48px",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.02] mix-blend-multiply"
        aria-hidden
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
        }}
      />
    </>
  )
}
