import { useState } from "react";
import { Link } from "react-router-dom";
import type { SkillCategory } from "@/hooks/use-skills";

/** Skill domains on the left, the levels of the selected domain on the right. */
const SkillsExplorer = ({ categories, moreLink }: { categories: SkillCategory[]; moreLink?: string }) => {
  const [index, setIndex] = useState(0);
  const active = categories[Math.min(index, categories.length - 1)];
  if (!active) return null;

  return (
    <div className="grid grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
      <div role="tablist" aria-label="Domaines de compétences" className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
        {categories.map((category, i) => {
          const selected = category.name === active.name;
          return (
            <button
              key={category.name}
              role="tab"
              aria-selected={selected}
              aria-controls="skills-panel"
              onClick={() => setIndex(i)}
              className={`flex items-center justify-between gap-4 border bg-card px-6 py-5 text-left transition-colors ${
                selected ? "border-foreground" : "border-border hover:border-foreground/40"
              }`}
            >
              <span>
                <span className="block font-semibold text-foreground">{category.name}</span>
                <span className="mt-1 block text-sm text-muted-foreground">
                  {category.skills.length} {category.skills.length > 1 ? "compétences" : "compétence"}
                </span>
              </span>
              {selected && <span aria-hidden="true" className="h-2 w-2 shrink-0 rounded-full bg-foreground" />}
            </button>
          );
        })}
      </div>

      <div id="skills-panel" role="tabpanel" className="flex flex-col border border-foreground bg-card font-mono">
        <div className="flex border-b border-foreground">
          <p className="bg-foreground px-4 py-2.5 font-semibold text-background">{active.name}</p>
          {moreLink && (
            <Link to={moreLink} className="ml-auto border-l border-foreground px-4 py-2.5 text-sm hover:bg-secondary">
              Tout voir
            </Link>
          )}
        </div>
        <div className="px-6 py-6 text-[13px] leading-7">
          <p className="mb-3 text-muted-foreground">// niveau sur 100</p>
          <ul>
            {active.skills.map((skill) => (
              <li
                key={skill.name}
                className="grid grid-cols-[minmax(0,1fr)_3ch] items-center gap-x-4 sm:grid-cols-[minmax(0,38ch)_10rem_3ch]"
              >
                <span className="truncate text-foreground">{skill.name}</span>
                <span aria-hidden="true" className="hidden h-2 bg-foreground/10 sm:block">
                  <span className="block h-full bg-foreground" style={{ width: `${skill.level}%` }} />
                </span>
                <span className="text-right text-foreground">{skill.level}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SkillsExplorer;
