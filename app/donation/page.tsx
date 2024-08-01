import Image from "next/image";
import Link from "next/link";
import React from "react";

import DonationVolunteerCTA from "@/components/donation-cta";
import donation_bg from "../../public/img/donation.jpg";
import DonationTabs from "@/components/donation-tabs";

export default function Donation() {
  return (
    <>
      {/* donate */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-[#FDF0B9] py-8 lg:py-16 px-8 md:px-16 lg:px-28">
        <div className="flex flex-col lg:flex-row gap-16 w-full">
          <div
            className="lg:pl-[104px] flex flex1
           flex-col gap-9"
          >
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden lg:flex h-0.5 -ml-24 w-20 bg-dark" />
              donate
            </p>
            <h2 className="text-4xl md:text-6xl font-bold lg:max-w-[627px]">
              Making a donation for our children.
            </h2>

            <p className="lg:max-w-[517px]">
              When you donate, you’re supporting effective care to children with
              special needs—an investment in the leaders of tomorrow.
            </p>

            <Link
              href={"#"}
              className="w-max bg-secondary text-dark rounded-md px-8 py-4"
            >
              Donate now
            </Link>
          </div>

          <div className="w-full max-w-[480px] mx-auto">
            <Image
              alt="Hero Background"
              src={donation_bg}
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

      {/* how you can contribute */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-white py-8 lg:py-16 px-8 md:px-16 lg:px-28">
        <div className="flex flex-col gap-9 lg:w-1/2">
          <h2 className="text-4xl md:text-5xl font-bold">
            How you can contribute to caring for our kids
          </h2>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare, eros dolor interdum nulla, ut commodo diam libero
            vitae erat. Aenean faucibus nibh et justo cursus id rutrum lorem
            imperdiet. Nunc ut sem vitae risus tristique posuere.
          </p>
        </div>

        <div className="flex flex-col lg:w-1/2">
          <DonationTabs />
        </div>
      </div>

      {/* how we use donations */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-white py-8 lg:py-16 px-8 md:px-16 lg:px-28">
        <h2 className="w-full text-4xl md:text-5xl font-bold">
          How we use your donation
        </h2>

        <p className="w-full">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
          Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc
          ut sem vitae risus tristique posuere.
        </p>

        <p className="w-full">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
          Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc
          ut sem vitae risus tristique posuere.
        </p>
      </div>

      {/* donation & volunteer cta */}
      <DonationVolunteerCTA />
    </>
  );
}
