import { classNames } from "@/lib";
import { IProject } from "@/types";
import { ChevronRightIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const ProjectCard = ({ excerpt, href, image, name, slug }: IProject) => {
  return (
    <div className="relative h-[411px] aspect-square">
      <Image
        alt="Project Image"
        src={image}
        placeholder="blur"
        quality={100}
        fill
        sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
        className="object-cover rounded-3xl bg-center"
      />

      <div className="absolute left-0 right-0 top-0 bottom-0 bg-dark/60 rounded-3xl p-12 text-white flex flex-col flex-1 gap-4">
        <h3 className="text-3xl font-bold line-clamp-2 leading-normal">
          {name}
        </h3>
        <p className="line-clamp-3">{excerpt}</p>

        <Link
          href={href.replace(":slug", slug)}
          className="bg-white px-8 py-4 text-dark w-max rounded-md flex items-center gap-2 mt-auto"
        >
          Continue reading <ChevronRightIcon className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
