import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Project } from "@/data/projects";
import { categoryColors, categoryLabel } from "@/data/project-categories";

const ProjectCard = ({ project }: { project: Project }) => {
  return (
    <Link
      to={`/projet/${project.slug}`}
      className="group block bg-card border border-border rounded-none overflow-hidden card-hover"
    >
      <div className="relative overflow-hidden">
        <img
          src={project.image}
          alt={project.title}
          className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <span className={`absolute top-4 left-4 text-xs font-semibold px-4 py-1.5 rounded-md border ${categoryColors[project.category] || categoryColors["data-science"]}`}>
          {categoryLabel(project.category)}
        </span>
      </div>
      <div className="p-6">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:underline transition-colors">
          {project.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 leading-relaxed">{project.shortDescription}</p>
        <div className="flex flex-wrap gap-2 mb-5">
          {project.techStack.slice(0, 4).map((tech) => (
            <span key={tech} className="text-xs px-3 py-1 rounded-md bg-foreground/5 text-foreground/70 font-medium">
              {tech}
            </span>
          ))}
        </div>
        <span className="link-arrow">
          Voir le projet <ArrowRight size={14} />
        </span>
      </div>
    </Link>
  );
};

export default ProjectCard;
