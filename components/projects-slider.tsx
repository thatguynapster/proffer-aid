"use client";

import Image from "next/image";
import Link from "next/link";

import { useRouter } from "next/navigation";
import Slider from "@/components/slider";
import { classNames } from "@/lib";
import { Fragment } from "react";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

type Props = { projects: any[] };

const ProjectSlider = ({ projects }: Props) => {
  return (
    <Slider options={{ showButtons: false, offset: 0.1, spaceBetween: 24 }}>
      {projects.map(({ excerpt, href, image, name, slug }) => (
        <Fragment key={slug}>
          <div
            className={classNames(
              "fixed overflow-hidden -z-10",
              "h-full max-h-[421px] w-full",
              "rounded-3xl"
            )}
          >
            <Image
              alt={"Project Image"}
              src={image}
              placeholder="blur"
              quality={100}
              fill
              sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover"
            />
            <div className="bg-dark opacity-60 w-full h-full"></div>
          </div>

          <div className="flex flex-col gap-16 min-h-[421px] pt-20 pb-12 px-12 text-white">
            <div className="flex flex-1 flex-col gap-4">
              <h3 className="text-3xl font-bold line-clamp-2 leading-normal">
                {name}
              </h3>
              <p className="line-clamp-3">{excerpt}</p>
            </div>
            <Link
              href={href.replace(":slug", slug)}
              className="bg-white px-8 py-4 text-dark w-max rounded-md flex items-center gap-2"
            >
              Continue reading <ChevronRightIcon className="w-5 h-5" />
            </Link>
          </div>
        </Fragment>
      ))}
    </Slider>
  );
};

export default ProjectSlider;
