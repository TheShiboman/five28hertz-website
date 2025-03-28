import { motion } from "framer-motion";
import { type Project } from "@shared/schema";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  project: Project;
  index: number;
}

const ProjectCard = ({ project, index }: ProjectCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      viewport={{ once: true }}
    >
      <Card className="h-full flex flex-col overflow-hidden group card-hover">
        <CardHeader className="p-0">
          <div className="aspect-video overflow-hidden relative">
            {project.logoUrl && (
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-sm rounded-lg p-2">
                <img
                  src={project.logoUrl}
                  alt={`${project.title} logo`}
                  className="h-8 w-auto"
                />
              </div>
            )}
            <img
              src={project.imageUrl}
              alt={project.title}
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        </CardHeader>
        <CardContent className="flex-grow p-6">
          <div className="mb-2">
            <span className="text-sm text-muted-foreground">{project.category}</span>
          </div>
          <h3 className="text-xl font-playfair font-bold mb-2">{project.title}</h3>
          <p className="text-muted-foreground mb-4">{project.description}</p>
          <div className="flex flex-wrap gap-2">
            {project.technologies.map((tech) => (
              <span
                key={tech}
                className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </CardContent>
        {project.link && (
          <CardFooter className="p-6 pt-0">
            <Button variant="outline" asChild>
              <a
                href={project.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2"
              >
                Visit Project <ExternalLink size={16} />
              </a>
            </Button>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
};

export default ProjectCard;