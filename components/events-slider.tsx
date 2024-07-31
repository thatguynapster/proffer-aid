"use client";

import dayjs from "dayjs";
import Slider from "@/components/slider";
import { useRouter } from "next/navigation";
import { IEvent } from "@/types";

const EventSlider = ({ events }: { events: IEvent[] }) => {
  const router = useRouter();
  return (
    <Slider options={{ showButtons: false, offset: 0.1, spaceBetween: 24 }}>
      {events.map(({ start_date, end_date, href, title, slug }, i: number) => {
        let eventStatus = "next event";
        if (dayjs().valueOf() >= start_date && dayjs().valueOf() <= end_date) {
          eventStatus = "ongoing";
        }
        if (dayjs().valueOf() >= end_date) {
          eventStatus = "past event";
        }

        return (
          <div
            key={i}
            className="bg-secondary p-8 rounded-3xl flex gap-6"
            onClick={() => {
              router.push(href.replace(":slug", slug));
            }}
          >
            <div className="flex flex-col">
              <h2 className="text-5xl font-medium">
                {dayjs(start_date).format("DD")}
              </h2>
              <p className="font-medium uppercase">
                {dayjs(start_date).format("MMM")}
              </p>
            </div>

            <div className="flex flex-col gap-2 flex-grow">
              <div className="flex gap-6 items-center">
                <p className="text-sm uppercase font-medium whitespace-nowrap">
                  {eventStatus}
                </p>
                <span className="h-0.5 w-11 bg-dark" />
              </div>
              <h3 className="text-3xl font-bold line-clamp-2">{title}</h3>
            </div>
          </div>
        );
      })}
    </Slider>
  );
};

export default EventSlider;
