"use client";

import { ArrowLeftIcon, ArrowRightIcon } from "@heroicons/react/24/outline";
import React, { ReactNode, useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import type SwiperType from "swiper";

import { classNames } from "@/lib";

import "swiper/css";
import "swiper/css/pagination";
import useWidth from "@/hooks/useWidth";

const Slider = ({
  children,
  options = { showButtons: true, offset: 0, spaceBetween: 16 },
}: {
  children: ReactNode[];
  options?: Partial<{
    showButtons: boolean;
    offset: number;
    spaceBetween?: number;
  }>;
}) => {
  const width = useWidth();

  const base = (width as number) < 640;
  const sm = (width as number) < 768;
  const md = (width as number) < 1024;
  const lg = (width as number) < 1280;
  const xl = (width as number) < 1536;

  const svp = base ? 1 : sm ? 2 : md ? 2 : xl ? 3 : 4;

  const [swiper, setSwiper] = useState<null | SwiperType>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [slideConfig, setSlideConfig] = useState({
    isBeginning: true,
    isEnd: activeIndex === (children?.length ?? 0) - svp,
  });

  useEffect(() => {
    swiper?.on("slideChange", ({ activeIndex }) => {
      setActiveIndex(activeIndex);
      setSlideConfig({
        isBeginning: activeIndex === 0,
        isEnd: activeIndex === (children?.length ?? 0) - svp,
      });
    });
  }, [swiper, children]);

  const activeStyles =
    "active:scale-[0.97] grid opacity-100 hover:scale-105 absolute top-1/2 -translate-y-1/2 aspect-square h-8 w-8 z-50 place-items-center rounded-full text-white bg-neutral-20";

  const inactiveStyles = "hidden";

  return (
    <div className={classNames("relative")}>
      {options.showButtons && (
        <div className="absolute inset-0">
          <button
            className={classNames(
              activeStyles,
              "-right-4 transition",
              {
                [inactiveStyles]: slideConfig.isEnd || children?.length <= svp,
                "hover:bg-primary hover:text-neutral-10 text-neutral-50 opacity-100":
                  !slideConfig.isEnd,
              },
              "!p-0"
            )}
            aria-label="next category"
            onClick={(ev) => {
              ev.preventDefault();
              swiper?.slideNext();
            }}
          >
            <ArrowRightIcon className="w-4 h-4 text-inherit" />
          </button>

          <button
            className={classNames(
              activeStyles,
              "-left-4 transition",
              {
                [inactiveStyles]: slideConfig.isBeginning,
                "hover:bg-primary hover:text-neutral-10 text-neutral-50 opacity-100":
                  !slideConfig.isBeginning,
              },
              "!p-0"
            )}
            aria-label="previous category"
            onClick={(ev) => {
              ev.preventDefault();
              swiper?.slidePrev();
            }}
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </button>
        </div>
      )}

      <Swiper
        className="w-full h-full"
        spaceBetween={options.spaceBetween}
        slidesPerView={svp + (options.offset ?? 0)}
        onSwiper={(swiper) => setSwiper(swiper)}
        modules={[Pagination]}
      >
        {children?.map((slide: any, index: number) => (
          <SwiperSlide key={index} className="-z-10 relative w-full h-full">
            {slide}
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Slider;
