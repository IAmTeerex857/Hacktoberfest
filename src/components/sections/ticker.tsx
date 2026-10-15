const items = [
  "AI agents",
  "payment assistants",
  "transaction analysis",
  "payout workflows",
  "tool definitions",
  "integration recipes",
  "skills.md",
  "documentation",
  "SDK templates",
  "open source",
];
const marks = ["✦", "₦", "{ }", "→", "$", "</>"];

function Row({ hidden = false }: { hidden?: boolean }) {
  return (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li key={t} className="flex items-center">
          <span className="whitespace-nowrap px-6 text-[15px] font-medium text-ink-2">{t}</span>
          <span className="font-mono text-[12px] text-blue">{marks[i % marks.length]}</span>
        </li>
      ))}
    </ul>
  );
}

export function Ticker() {
  return (
    <section aria-label="What you can build" className="frame relative overflow-hidden py-10 md:py-14">
      <div className="flex h-14 items-center [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
        <div className="marquee flex w-max">
          <Row />
          <Row hidden />
        </div>
      </div>
    </section>
  );
}
