import { technologyMarquee } from "@/lib/capabilities";

export function TechnologyMarquee() {
  const items = [...technologyMarquee, ...technologyMarquee];

  return (
    <div className="marquee border-y border-border py-5" aria-label={`Technology ecosystem: ${technologyMarquee.join(", ")}`}>
      <div className="marquee-track">
        {items.map((item, index) => (
          <span key={`${item}-${index}`} className="flex items-center gap-7 whitespace-nowrap font-mono text-xs uppercase tracking-[0.18em] text-muted" aria-hidden={index >= technologyMarquee.length}>
            {item}<span className="size-1 rounded-full bg-accent" />
          </span>
        ))}
      </div>
    </div>
  );
}
