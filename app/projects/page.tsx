import React from "react";

import DonationVolunteerCTA from "@/components/donation-cta";
import ProjectCard from "@/components/project-card";
import { projects } from "@/config";

const ProjectsPage = () => {
  return (
    <>
      <div className="bg-white py-8 lg:py-24 px-8 lg:px-16">
        <div className="flex flex-wrap justify-center w-full gap-4">
          {projects.map(({ excerpt, href, image, name, slug }) => (
            <ProjectCard key={slug} {...{ excerpt, href, image, name, slug }} />
          ))}
        </div>
      </div>
      <DonationVolunteerCTA />
    </>
  );
};

export default ProjectsPage;
