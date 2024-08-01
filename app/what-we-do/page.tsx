import Image from "next/image";
import React from "react";

import mission_bg from "../../public/img/unsplash_AEaTUnvneik.jpg";
import DonationVolunteerCTA from "@/components/donation-cta";
import ProjectSlider from "@/components/projects-slider";
import { events, projects, what_we_do } from "@/config";
import EventSlider from "@/components/events-slider";

const WhatWeDo = () => {
  return (
    <>
      {/* what we do */}
      <div className="flex flex-col gap-8 bg-white p-8 md:px-16 lg:p-16 lg:px-28">
        <p className="uppercase font-bold flex items-center gap-6">
          <span className="hidden lg:flex h-0.5 w-20 bg-dark" />
          what we do
        </p>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:pl-[104px] flex flex-col gap-9">
            <h2 className="text-4xl md:text-5xl font-bold">
              We are working cross country
            </h2>

            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat.
            </p>
          </div>

          <div className="w-full max-w-[476px] mx-auto">
            <Image
              alt="Hero Background"
              src={mission_bg}
              placeholder="blur"
              quality={100}
              width={476}
              height={384}
              sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
              className="object-cover rounded-3xl bg-center w-full"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-[#FDF0B9] py-8 lg:py-24 px-8 md:px-16 lg:px-28">
        <div className="flex flex-1 flex-col gap-4 md:gap-16 w-full">
          <div className="flex flex-col gap-8">
            <h2 className="text-4xl md:text-5xl font-bold">
              What we do for our kids with special needs
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-16 gap-y-12">
            {what_we_do.map(({ description, icon, title }, i) => (
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
      </div>

      {/* projects */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-white py-8 lg:py-16 px-8 md:px-16 lg:px-28 items-center">
        <div className="flex flex-1 flex-col gap-4 md:gap-12 w-full">
          <div className="flex flex-col gap-8 lg:pl-24 max-w-[46rem]">
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden lg:flex h-0.5 -ml-24 w-20 bg-dark" />
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
      <div className="bg-white py-8 lg:py-24 px-8 lg:px-28">
        <div className="flex flex-1 flex-col gap-4 md:gap-12 w-full">
          <div className="flex flex-col gap-8 lg:pl-24 max-w-2xl">
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden lg:flex h-0.5 -ml-24 w-20 bg-dark" />
              our events
            </p>
          </div>

          <EventSlider {...{ events }} />
        </div>
      </div>
    </>
  );
};

export default WhatWeDo;
