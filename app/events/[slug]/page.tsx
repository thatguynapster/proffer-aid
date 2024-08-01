import EventCard from "@/components/event-card";
import EventSlider from "@/components/events-slider";
import { events } from "@/config";
import { CalendarIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Image from "next/image";
import React from "react";

type Props = { params: { slug: string } };

const EventDetailsPage = ({ params }: Props) => {
  console.log(params.slug);

  return (
    <div className="flex flex-col gap-24">
      <div className="bg-[#FDF0B9] py-8 lg:py-16 px-8 md:px-16 lg:px-0">
        <div className="flex flex-col gap-6 md:gap-8 lg:gap-12 w-full lg:max-w-[832px] mx-auto">
          <h1 className="text-3xl md:text-4xl lg:text-6xl font-bold">
            A day with our wonderful children
          </h1>

          <div className="flex gap-6 font-medium">
            <p className="flex gap-1 items-center">
              <MapPinIcon className="w-6 h-6" /> Somewhere, Accra, Ghana
            </p>
            <p className="flex gap-1 items-center">
              <CalendarIcon className="w-6 h-6" /> April 13, 2024 8:30am
            </p>
          </div>
        </div>
      </div>

      {/* project details */}
      <div className="flex flex-col gap-8 lg:max-w-[832px] mx-auto px-8 md:px-16 lg:px-0">
        {/* event details */}
        <p>
          Et morbi vitae lobortis nam odio. Faucibus vitae vel neque nullam in
          in lorem platea mattis. Euismod aenean rhoncus scelerisque amet
          tincidunt scelerisque aliquam. Luctus porttitor elit vel sapien,
          accumsan et id ut est. Posuere molestie in turpis quam. Scelerisque in
          viverra mi ut quisque. In sollicitudin sapien, vel nulla quisque
          vitae. Scelerisque eget accumsan, non in. Posuere magna erat bibendum
          amet, nisi eu id.
          <br /> <br />
          Viverra at diam nunc non ornare. Sed ultricies pulvinar nunc, lacus
          sem. Tellus aliquam ut euismod cursus dui lectus. Ut amet, cras
          volutpat dui. A bibendum viverra eu cras.
          <br />
          Mauris morbi sed dignissim a in nec aliquam fringilla et. Mattis elit
          dignissim nibh sit. Donec arcu sed elit scelerisque tempor ornare
          tristique. Integer faucibus duis praesent tempor feugiat ornare in.
          Erat libero egestas porttitor nunc pellentesque mauris et pulvinar
          eget.
        </p>

        <div className="relative w-full h-80">
          <Image
            src={"/img/unsplash_cVEOh_JJmEE.jpg"}
            alt={"Proffer Aid International Foundation"}
            fill
            className="object-cover rounded-3xl aspect-square lg:aspect-auto"
            sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>

        <p>
          Et morbi vitae lobortis nam odio. Faucibus vitae vel neque nullam in
          in lorem platea mattis. Euismod aenean rhoncus scelerisque amet
          tincidunt scelerisque aliquam. Luctus porttitor elit vel sapien,
          accumsan et id ut est. Posuere molestie in turpis quam. Scelerisque in
          viverra mi ut quisque. In sollicitudin sapien, vel nulla quisque
          vitae. Scelerisque eget accumsan, non in. Posuere magna erat bibendum
          amet, nisi eu id.
        </p>
      </div>

      {/* events */}
      <div className="flex flex-col gap-8 w-full lg:max-w-[832px] mx-auto pb-24 px-8 md:px-16 lg:px-0">
        <div className="flex flex-1 flex-col gap-4 md:gap-12 w-full">
          <div className="flex flex-col gap-8 lg:pl-24 max-w-[46rem]">
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden lg:flex h-0.5 -ml-24 w-20 bg-dark" />
              other events
            </p>
          </div>

          <div className="flex flex-col gap-6 w-full">
            {events
              .filter((event) => event.slug !== params.slug)
              .map((event) => (
                <EventCard {...event} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailsPage;
