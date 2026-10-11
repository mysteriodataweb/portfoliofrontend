import React, { useEffect, useRef, useState } from "react";

export interface StorySlide {
  title: string;
  description: string;
  image: string;
  bgColor: string;
  textColor: string;
  badge?: string;
  ctaHref?: string;
}

interface InteractiveScrollingStoryProps {
  slides: StorySlide[];
  ctaLabel?: string;
  ctaHref?: string;
  renderActions?: (activeIndex: number) => React.ReactNode;
}

export function InteractiveScrollingStory({
  slides,
  ctaLabel = "Get Started",
  ctaHref = "#get-started",
  renderActions,
}: InteractiveScrollingStoryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [panelH, setPanelH] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const update = () => setPanelH(container.clientHeight);
    update();
    const observer = new ResizeObserver(update);
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollableHeight = container.scrollHeight - container.clientHeight;
      if (scrollableHeight <= 0) return;
      const stepHeight = scrollableHeight / slides.length;
      const nextIndex = Math.min(
        slides.length - 1,
        Math.floor(container.scrollTop / stepHeight)
      );
      setActiveIndex(nextIndex);
    };

    container.addEventListener("scroll", handleScroll);
    return () => container.removeEventListener("scroll", handleScroll);
  }, [slides.length]);

  const scrollToSlide = (index: number) => {
    const container = containerRef.current;
    if (!container) return;
    const scrollableHeight = container.scrollHeight - container.clientHeight;
    const stepHeight = scrollableHeight / slides.length;
    container.scrollTo({ top: stepHeight * index, behavior: "smooth" });
  };

  if (slides.length === 0) return null;

  const activeSlide = slides[activeIndex];
  const gridPatternStyle = {
    "--grid-color": "rgba(0, 0, 0, 0.12)",
    backgroundImage: `
      linear-gradient(to right, var(--grid-color) 1px, transparent 1px),
      linear-gradient(to bottom, var(--grid-color) 1px, transparent 1px)
    `,
    backgroundSize: "3.5rem 3.5rem",
  } as React.CSSProperties;

  const dynamicStyles = {
    backgroundColor: activeSlide.bgColor || "#F7F4EE",
    transition: "background-color 0.7s ease",
    height: panelH || "100%",
  } as React.CSSProperties;

  return (
    <div
      ref={containerRef}
      className="h-full w-full overflow-y-auto"
      style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
    >
      <div style={{ height: panelH ? slides.length * panelH : `${slides.length * 100}vh` }}>
        <div className="sticky top-0 w-full flex flex-col items-center justify-center relative overflow-hidden" style={dynamicStyles}>
          {/* Mobile background image */}
          <div className="md:hidden absolute inset-0 overflow-hidden">
            <div
              className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
              style={{ transform: `translateY(-${activeIndex * 100}%)` }}
            >
              {slides.map((slide, index) => (
                <div key={index} className="w-full h-full">
                  <img
                    src={slide.image}
                    alt={slide.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = "https://placehold.co/800x1200/e2e8f0/4a5568?text=Image+Not+Found";
                    }}
                  />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-black/50" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 h-full w-full max-w-7xl mx-auto">
            {/* Left Column: Text Content, Pagination & Button */}
            <div className="relative flex flex-col justify-center p-8 md:p-16 border-r border-black/10 text-white md:text-black">
              {/* Pagination Bars */}
              <div className="absolute top-8 left-8 md:top-16 md:left-16 flex space-x-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => scrollToSlide(index)}
                    className={`h-1 rounded-full transition-all duration-500 ease-in-out ${
                      index === activeIndex ? "w-12 bg-white/90 md:bg-black/80" : "w-6 bg-white/40 md:bg-black/20"
                    }`}
                    aria-label={`Aller à la diapositive ${index + 1}`}
                  />
                ))}
              </div>

              {renderActions && (
                <div className="absolute top-8 right-8 md:top-16 md:right-16 z-10 flex items-center gap-2">
                  {renderActions(activeIndex)}
                </div>
              )}

              <div className="relative h-64 w-full">
                {slides.map((slide, index) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                      index === activeIndex
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-10"
                    }`}
                  >
                    {slide.badge && (
                      <span className="inline-block mb-4 px-3 py-1 rounded-md text-xs font-semibold bg-white/25 text-white border border-white/40 backdrop-blur md:bg-black md:text-white md:border-transparent">
                        {slide.badge}
                      </span>
                    )}
                    <h2 className="text-3xl md:text-4xl font-medium tracking-tight">{slide.title}</h2>
                    <p className="mt-5 text-base md:text-lg max-w-md">{slide.description}</p>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <div className="absolute bottom-24 left-8 md:bottom-28 md:left-16">
                <a
                  href={activeSlide.ctaHref || ctaHref}
                  className="px-8 py-3 bg-black text-white text-sm font-semibold rounded-md hover:bg-gray-800 transition-colors border border-white/40 md:border-black/10"
                >
                  {ctaLabel}
                </a>
              </div>
            </div>

            {/* Right Column: Image Content with Grid Background */}
            <div className="hidden md:flex items-center justify-center p-8" style={gridPatternStyle}>
              <div className="relative w-[50%] h-[80vh] overflow-hidden border border-black/10 bg-white">
                <div
                  className="absolute top-0 left-0 w-full h-full transition-transform duration-700 ease-in-out"
                  style={{ transform: `translateY(-${activeIndex * 100}%)` }}
                >
                  {slides.map((slide, index) => (
                    <div key={index} className="w-full h-full">
                      <img
                        src={slide.image}
                        alt={slide.title}
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.onerror = null;
                          e.currentTarget.src = "https://placehold.co/800x1200/e2e8f0/4a5568?text=Image+Not+Found";
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default InteractiveScrollingStory;
