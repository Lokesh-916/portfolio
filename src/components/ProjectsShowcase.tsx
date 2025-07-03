'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Github, Calendar } from 'lucide-react';
import Image from 'next/image';

export function ProjectsShowcase() {
  const projects = [
    {
      title: 'Synto',
      description: 'AI-powered interface that transforms complex blockchain interactions into simple, natural language commands.',
      image: '/syntopreview.png',
      tech: ['Next.js', 'TypeScript', 'Web3.js', 'OpenAI API'],
      year: '2025',
      links: [
        { name: 'Website', url: 'https://synto.fun', icon: ExternalLink },
        { name: 'GitHub', url: 'https://github.com/toukoum/synto', icon: Github },
      ],
    },
    {
      title: 'Rrate',
      description: 'Fun website to compare your salary with the richest people in the world.',
      image: '/ratepreview.png',
      tech: ['HTML', 'CSS', 'JavaScript'],
      year: '2024',
      links: [
        { name: 'Website', url: 'https://rrate.app', icon: ExternalLink },
        { name: 'GitHub', url: 'https://github.com/toukoum/Rrate', icon: Github },
      ],
    },
    {
      title: 'Defai',
      description: 'AI-powered chat interface that simplifies on-chain operations on the Avalanche blockchain.',
      image: '/defaipreview.png',
      tech: ['Next.js', 'TypeScript', 'Vercel AI SDK'],
      year: '2025',
      links: [
        { name: 'GitHub', url: 'https://github.com/toukoum/DEFAI', icon: Github },
      ],
    },
    {
      title: 'Fitgear',
      description: 'Virtual voice seller accessible by QR code to improve customer-seller ratio.',
      image: '/fitgearpreview.png',
      tech: ['Next.js', 'OpenAI API', 'Langchain'],
      year: '2024',
      links: [
        { name: 'LinkedIn', url: 'https://linkedin.com', icon: ExternalLink },
      ],
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <div className="mx-auto w-full max-w-6xl py-8 font-sans">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="space-y-6"
      >
        <motion.div variants={itemVariants} className="text-center">
          <h2 className="text-3xl font-bold text-foreground mb-2">Featured Projects</h2>
          <p className="text-muted-foreground">Some of my recent work and personal projects</p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
          {projects.map((project, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group relative overflow-hidden rounded-xl border bg-white/30 backdrop-blur-lg transition-all duration-300 hover:bg-white/40 dark:bg-neutral-800/30 dark:hover:bg-neutral-800/40"
            >
              {/* Project Image */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={project.image}
                  alt={project.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/20" />
              </div>

              {/* Project Content */}
              <div className="p-6 space-y-4">
                <div className="flex items-start justify-between">
                  <h3 className="text-xl font-semibold text-foreground">
                    {project.title}
                  </h3>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>{project.year}</span>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2">
                  {project.tech.map((tech, techIndex) => (
                    <span
                      key={techIndex}
                      className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* Links */}
                <div className="flex gap-3 pt-2">
                  {project.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20"
                    >
                      <link.icon className="h-4 w-4" />
                      {link.name}
                    </a>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default ProjectsShowcase; 