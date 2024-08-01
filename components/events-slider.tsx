"use client";

import Slider from "@/components/slider";
import { IEvent } from "@/types";
import EventCard from "./event-card";
import useWidth from "@/hooks/useWidth";

const EventSlider = ({ events }: { events: IEvent[] }) => {
  const width = useWidth();

  const base = (width as number) < 1024;
  const lg = (width as number) < 1280;
  const xl = (width as number) < 1536;

  const svp = base ? 1 : 2;

  return (
    <Slider
      options={{
        showButtons: false,
        offset: 0.1,
        spaceBetween: 24,
        slidesPerView: svp,
      }}
    >
      {events.map(({ start_date, end_date, href, title, slug }) => {
        return (
          <EventCard
            key={slug}
            {...{ end_date, href, slug, start_date, title }}
          />
        );
      })}
    </Slider>
  );
};

export default EventSlider;
