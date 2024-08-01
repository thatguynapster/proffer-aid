"use client";

import { IEvent } from "@/types";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const EventCard = ({ end_date, href, slug, start_date, title }: IEvent) => {
  const router = useRouter();

  const eventStatus = () => {
    if (dayjs().valueOf() >= start_date && dayjs().valueOf() <= end_date) {
      return "ongoing";
    }
    if (dayjs().valueOf() >= end_date) {
      return "past event";
    }
    return "next event";
  };

  return (
    <div
      className="bg-secondary p-4 md:p-8 rounded-3xl flex gap-6 w-full"
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
            {eventStatus()}
          </p>
          <span className="h-0.5 w-11 bg-dark" />
        </div>
        <h3 className="text-2xl font-bold line-clamp-2">{title}</h3>
      </div>

      <div className="hidden md:flex items-center justify-center">
        <div className="bg-white rounded-full p-3 cursor-pointer">
          <ArrowRightIcon className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
};

export default EventCard;
