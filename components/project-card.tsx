import Image from "next/image";
import Link from "next/link";
import React from "react";

import { ChevronRightIcon } from "@heroicons/react/24/outline";
import { IProject } from "@/types";

const ProjectCard = ({ excerpt, href, image, name, slug }: IProject) => {
  return (
    <div className="relative h-[411px] aspect-square snap-center">
      <Image
        src={image}
        alt={"Proffer Aid International Foundation"}
        fill
        className="object-cover rounded-3xl aspect-square"
        sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
      />

      <div className="absolute left-0 right-0 top-0 bottom-0 bg-dark/60 rounded-3xl p-6 md:p-8 lg:p-12 text-white flex flex-col flex-1 gap-4">
        <h3 className="text-2xl lg:text-3xl font-bold line-clamp-2 leading-normal">
          {name}
        </h3>
        <p className="line-clamp-2 lg:line-clamp-3">{excerpt}</p>

        <Link
          href={href.replace(":slug", slug)}
          className="bg-white px-4 md:px-8 py-2 md:py-4 text-dark w-max rounded-md flex items-center gap-2 mt-auto"
        >
          Continue reading <ChevronRightIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
