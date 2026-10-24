interface MarqueeProps {
  items: string[];
  label: string;
}

/** Black ticker tape. The list is written twice so the loop is seamless; the copy is hidden from screen readers. */
const Marquee = ({ items, label }: MarqueeProps) => (
  <section data-dark aria-label={label} className="overflow-hidden bg-deep-black py-4 text-off-white md:py-5">
    <div className="flex w-max animate-marquee-fast hover:[animation-play-state:paused]">
      {[0, 1].map((copy) => (
        <ul key={copy} aria-hidden={copy === 1} className="flex shrink-0 items-center">
          {items.map((item) => (
            <li key={item} className="flex items-center gap-6 px-6 font-mono text-sm uppercase tracking-widest md:text-base">
              <span>{item}</span>
              <span className="text-dutch-orange" aria-hidden="true">
                ✶
              </span>
            </li>
          ))}
        </ul>
      ))}
    </div>
  </section>
);

export default Marquee;
