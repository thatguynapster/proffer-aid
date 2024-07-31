import Image from "next/image";
import Link from "next/link";

import DonationVolunteerCTA from "@/components/donation-cta";
import ProjectSlider from "@/components/projects-slider";
import { events, projects, WhatWeDo } from "@/config";
import EventSlider from "@/components/events-slider";
import hero_bg from "../public/img/hero-bg.jpg";
import { routes } from "@/routes";

export default function Home() {
  return (
    <>
      {/* hero */}
      <div className="relative w-full h-[85vh] px-24">
        <Image
          alt="Hero Background"
          src={hero_bg}
          placeholder="blur"
          quality={100}
          fill
          sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="object-cover"
        />

        <div className="absolute left-0 right-0 top-0 bottom-0 bg-dark/60 pt-32 pb-4 md:pb-8 lg:pb-16 px-8 md:px-16 lg:px-28 mx-auto flex flex-1 flex-col mb-auto">
          <div className="flex flex-1 flex-col gap-12 mb-auto">
            <h1 className="text-4xl md:text-6xl font-bold max-w-[640px] leading-tight text-white">
              Inclusive care for children with special needs
            </h1>
            <Link
              href={routes.what_we_do}
              className="bg-white px-8 py-4 font-medium w-max rounded-md"
            >
              What we do
            </Link>
          </div>
          <div className="flex flex-col md:flex-row gap-5 md:items-center">
            <p className="mt-auto text-white whitespace-nowrap">
              230 children under our care
            </p>
            <hr className="hidden md:flex w-full" />
            <p className="mt-auto text-white whitespace-nowrap">
              58 donations collected
            </p>
          </div>
        </div>
      </div>

      {/* know about us */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-white py-8 lg:py-16 px-8 md:px-16 lg:px-28 items-center">
        <div className="flex flex-1 flex-col gap-4 md:gap-8 w-full">
          <div className="flex flex-col gap-8 md:pl-24">
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden md:flex h-0.5 -ml-24 w-20 bg-dark" />
              know about us
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              We provide a place for children with special needs
            </h2>
            <p className="text-neutral-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique.
              <br />
              <br />
              Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut
              commodo diam libero vitae erat. Aenean faucibus nibh et justo
              cursus id rutrum lorem imperdiet. Nunc ut sem vitae risus
              tristique posuere.
            </p>
          </div>

          <Link
            href={routes.about_us}
            className="w-max bg-secondary text-dark rounded-md px-8 py-4 ml-24"
          >
            Learn more
          </Link>
        </div>

        <Image
          src={"/img/video-bg.jpg"}
          alt={"Proffer Aid International Foundation"}
          width={480}
          height={578}
          className="object-cover rounded-3xl aspect-square lg:aspect-auto"
          sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
      </div>

      {/* what we do */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-[#FDF0B9] py-8 lg:py-16 px-8 md:px-16 lg:px-28 items-center">
        <div className="flex flex-1 flex-col gap-4 md:gap-12 w-full">
          <div className="flex flex-col gap-8 md:pl-24">
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden md:flex h-0.5 -ml-24 w-20 bg-dark" />
              what we do
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              Some services we provide for our children
            </h2>
            <p className="text-neutral-600">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique.
            </p>
          </div>
          <div className="border-l border-neutral-300 pl-6 flex flex-col gap-6">
            {WhatWeDo.map(({ description, icon, title }, i) => (
              <div key={i} className="flex items-start gap-6">
                <div className="p-1.5 bg-dark rounded-md flex items-center justify-center">
                  {icon}
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="text-2xl font-bold">{title}</h3>
                  <p className="text-neutral-600">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Image
          src={"/img/what-we-do.jpg"}
          alt={"Proffer Aid International Foundation"}
          width={480}
          height={658}
          className="object-cover rounded-3xl aspect-square lg:aspect-auto"
          sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
        />
      </div>

      {/* projects */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-white py-8 lg:py-16 px-8 md:px-16 lg:px-28 items-center">
        <div className="flex flex-1 flex-col gap-4 md:gap-12 w-full">
          <div className="flex flex-col gap-8 md:pl-24 max-w-2xl">
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden md:flex h-0.5 -ml-24 w-20 bg-dark" />
              projects we have done
            </p>
            <h2 className="text-4xl md:text-5xl font-bold">
              We are creating a place where children with special needs can
              thrive
            </h2>
          </div>

          <ProjectSlider {...{ projects }} />
        </div>
      </div>

      {/* donation & volunteer cta */}
      <DonationVolunteerCTA />

      {/* events */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-white py-8 lg:py-16 px-8 md:px-16 lg:px-28 items-center">
        <div className="flex flex-1 flex-col gap-4 md:gap-12 w-full">
          <div className="flex flex-col gap-8 md:pl-24 max-w-2xl">
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden md:flex h-0.5 -ml-24 w-20 bg-dark" />
              our events
            </p>
          </div>

          <EventSlider {...{ events }} />
        </div>
      </div>
    </>
  );
}
