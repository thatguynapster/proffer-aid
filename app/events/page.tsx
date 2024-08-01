import DonationVolunteerCTA from "@/components/donation-cta";
import EventCard from "@/components/event-card";
import { events } from "@/config";
import React from "react";

const EventsPage = () => {
  return (
    <>
      <div className="bg-white py-8 lg:py-24 px-8 lg:px-16">
        <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {events.map(({ start_date, end_date, href, title, slug }) => {
            return (
              <EventCard
                key={slug}
                {...{ end_date, href, slug, start_date, title }}
              />
            );
          })}
        </div>
      </div>
      <DonationVolunteerCTA />
    </>
  );
};

export default EventsPage;
