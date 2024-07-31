import Image from "next/image";
import React from "react";
import donate_bg from "../public/img/unsplash_cVEOh_JJmEE.jpg";
import Link from "next/link";
import { routes } from "@/routes";

type Props = {};

const DonationVolunteerCTA = (props: Props) => {
  return (
    <div className="bg-white py-8 lg:py-24 px-8 lg:px-28">
      <div className="relative w-full h-96">
        <Image
          alt="Hero Background"
          src={donate_bg}
          placeholder="blur"
          quality={100}
          fill
          sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
          className="object-cover rounded-3xl bg-center"
        />

        <div className="absolute left-0 right-0 top-0 bottom-0 bg-dark/50 rounded-3xl">
          <div className="flex flex-col items-center justify-center gap-8 h-full p-4 md:px-8">
            <h3 className="text-3xl md:text-5xl font-bold text-center leading-tight text-white lg:max-w-[62.89%]">
              You can contribute to provide a place for children with special
              needs!
            </h3>

            <div className="flex flex-col md:flex-row gap-8 text-center">
              <div className="bg-secondary rounded-md px-8 py-4 font-medium">
                Join as a volunteer
              </div>

              <Link
                href={routes.donation}
                className="bg-white rounded-md px-8 py-4 font-medium"
              >
                Donate
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationVolunteerCTA;
