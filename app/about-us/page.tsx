import Image from "next/image";
import Link from "next/link";

import {
  FacebookIcon,
  TwitterIcon,
  InstagramIcon,
  LinkedInIcon,
} from "@/components/icons";
import DonationVolunteerCTA from "@/components/donation-cta";
import mission_bg from "../../public/img/mission-bg.jpg";
import EventSlider from "@/components/events-slider";
import { events, team } from "@/config";

export default function AboutUsPage() {
  return (
    <>
      {/* know about us */}
      <div className="flex flex-col gap-8 bg-white p-8 md:px-16 lg:p-16 lg:px-28">
        <p className="uppercase font-bold flex items-center gap-6">
          <span className="hidden lg:flex h-0.5 w-20 bg-dark" />
          know about us
        </p>

        <div className="flex flex-col lg:flex-row gap-8 lg:gap-0">
          <h2 className="lg:pl-[104px] text-4xl md:text-5xl font-bold">
            We are a non-governmental organization
          </h2>

          <p className="lg:max-w-[465px]">
            <span className="text-xl font-bold">
              Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet.
              Nunc ut sem vitae risus tristique posuere.
            </span>
            <br />
            <br />
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique. Duis cursus, mi quis
            viverra ornare, eros dolor interdum nulla, ut commodo diam libero
            vitae erat. Suspendisse varius enim elementum tristique.
          </p>
        </div>
      </div>

      {/* mission & vision */}
      <div className="flex flex-col gap-12 lg:gap-24 bg-[#FDF0B9] py-8 lg:py-16 lg:pt-0 px-8 md:px-16 lg:px-28 lg:mt-56">
        <div className="relative w-full lg:-mt-56">
          <Image
            alt="Hero Background"
            src={mission_bg}
            placeholder="blur"
            quality={100}
            width={1280}
            height={448}
            sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
            className="object-cover rounded-3xl bg-center w-full"
          />
          <div className="absolute left-0 right-0 top-0 bottom-0 bg-dark/20 rounded-3xl"></div>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 lg:px-24">
          <div className="flex flex-col">
            <h2 className="font-bold uppercase mb-4">our mission</h2>
            <h3 className="text-[1.75rem] font-bold">
              We make sure to provide inclusive care for children with special
              needs
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum
              lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
            </p>
          </div>

          <div className="flex flex-col">
            <h2 className="font-bold uppercase mb-4">our vision</h2>
            <h3 className="text-[1.75rem] font-bold">
              Provide more inclusive care to children around the world
            </h3>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit.
              Suspendisse varius enim in eros elementum tristique. Duis cursus,
              mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam
              libero vitae erat. Aenean faucibus nibh et justo cursus id rutrum
              lorem imperdiet. Nunc ut sem vitae risus tristique posuere.
            </p>
          </div>
        </div>
      </div>

      {/* our team */}
      <div className="flex flex-col gap-8 bg-white p-8 md:px-16 lg:p-16 lg:px-28 items-center">
        <div className="flex flex-col gap-4 items-center max-w-lg">
          <h1 className="text-5xl font-bold">Meet our team</h1>
          <p className="text-muted text-center">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
            varius enim in eros elementum tristique.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map(({ image, name, role, socials }) => (
            <div key={name} className="flex flex-col gap-4 items-center">
              <Image
                src={image}
                alt={name}
                width={295}
                height={295}
                className="object-cover rounded-3xl aspect-square"
                sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
              />
              <div className="flex flex-col gap-2 items-center">
                <h2 className="text-xl font-medium capitalize">{name}</h2>
                <p className="text-xs font-medium text-muted capitalize">
                  {role}
                </p>
              </div>

              <div className="flex gap-5">
                {socials.facebook && (
                  <Link
                    href={socials.facebook}
                    aria-label={`Connect with ${name} on facebook`}
                  >
                    <FacebookIcon className="w-5 h-5 text-dark-muted" />
                  </Link>
                )}
                {socials.twitter && (
                  <Link
                    href={socials.twitter}
                    aria-label={`Connect with ${name} on twitter`}
                  >
                    <TwitterIcon className="w-5 h-5 text-dark-muted" />
                  </Link>
                )}
                {socials.instagram && (
                  <Link
                    href={socials.instagram}
                    aria-label={`Connect with ${name} on instagram`}
                  >
                    <InstagramIcon className="w-5 h-5 text-dark-muted" />
                  </Link>
                )}
                {socials.linkedin && (
                  <Link
                    href={socials.linkedin}
                    aria-label={`Connect with ${name} on linkedin`}
                  >
                    <LinkedInIcon className="w-5 h-5 text-dark-muted" />
                  </Link>
                )}
              </div>
            </div>
          ))}
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
}
