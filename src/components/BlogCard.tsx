import { Link } from "react-router-dom";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { BlogPost } from "@/data/blog-posts";

const BlogCard = ({ post }: { post: BlogPost }) => {
  return (
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col bg-card border border-border rounded-none overflow-hidden card-hover h-full"
    >
      <div className="relative overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-48 object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <span className="absolute top-4 left-4 text-xs font-semibold px-4 py-1.5 rounded-md bg-foreground text-white">
          {post.category}
        </span>
      </div>
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-2 group-hover:underline transition-colors line-clamp-2">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1 leading-relaxed">{post.excerpt}</p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} /> {new Date(post.date).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span className="inline-flex items-center gap-1">
              <Clock size={12} /> {post.readTime}
            </span>
          </div>
          <ArrowRight size={14} className="text-muted-foreground group-hover:underline transition-colors" />
        </div>
      </div>
    </Link>
  );
};

export default BlogCard;
