import { morePages, pages, socials } from "@/config";
import { classNames } from "@/lib/helpers";
import { routes } from "@/routes";
import Image from "next/image";
import Link from "next/link";
import React from "react";

type Props = {};

const Footer = ({}: Props) => {
  return (
    <div
      className={classNames(
        "flex flex-col lg:flex-row gap-8",
        "px-8 lg:px-16 py-6 lg:py-12",
        "bg-dark text-gray-50"
      )}
    >
      <div
        className={classNames(
          "flex flex-col lg:flex-row gap-8",
          "mx-auto",
          "justify-between"
        )}
      >
        <Link href={routes.home} className="relative w-[210px] h-[210px]">
          <Image
            src={"/img/logo-square.png"}
            alt={"Proffer Aid International Foundation"}
            fill
          />
        </Link>
        <div className="flex flex-col md:flex-row gap-16">
          <div className="flex flex-col gap-4 w-full">
            {pages.map(({ href, text }, i) => (
              <Link key={i} href={href}>
                {text}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4 w-full">
            {morePages.map(({ href, text }, i) => (
              <Link key={i} href={href}>
                {text}
              </Link>
            ))}
          </div>

          <div className="flex flex-col gap-4 w-full">
            {socials.map(({ href, text }, i) => (
              <Link key={i} href={href}>
                {text}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-8 lg:gap-16">
          <h2 className="text-2xl lg:text-4xl font-bold">
            Subscribe to get latest updates
          </h2>
          <div className="flex">
            <div className="border border-neutral-200 rounded-md pr-12 -mr-12 w-full">
              <input
                type="email"
                name="email"
                id="email"
                placeholder="name@domain.com"
                className="focus:outline-none px-4 w-full h-full bg-transparent"
              />
            </div>
            <button
              type="submit"
              className="text-neutral-900 bg-neutral-50 font-medium px-8 py-5 rounded-md"
            >
              Subscribe
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
