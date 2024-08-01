"use client";

import Slider from "@/components/slider";
import ProjectCard from "./project-card";

type Props = { projects: any[] };

const ProjectSlider = ({ projects }: Props) => {
  return (
    <Slider options={{ showButtons: false, offset: 0.1, spaceBetween: 24 }}>
      {projects.map(({ excerpt, href, image, name, slug }) => (
        <ProjectCard key={slug} {...{ excerpt, href, image, name, slug }} />
      ))}
    </Slider>
  );
};

export default ProjectSlider;
