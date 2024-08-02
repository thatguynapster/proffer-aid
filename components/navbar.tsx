"use client";

import { Popover, PopoverButton, PopoverPanel } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import React from "react";

import { useModal } from "@/providers/modal-provider";
import { classNames } from "@/lib/helpers";
import { Button } from "./button";
import { routes } from "@/routes";
import { pages } from "@/config";
import Image from "next/image";
import Link from "next/link";
import CustomModal from "./custom-modal";
import VolunteerForm from "./volunteer-form";

const Navbar = () => {
  const pathname = usePathname();
  const { setOpen } = useModal();

  const _handleActive = (link: string) => {
    return pathname.split("/")[1] === link.split("/")[1];
  };

  return (
    <>
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Popover
        as="header"
        className={classNames(
          "data-[open]:bg-white bg-dark/60 shadow-sm lg:overflow-y-visible sticky top-0",
          "data-[open]:fixed data-[open]:inset-0 z-50 data-[open]:overflow-y-auto data-[open]:lg:overflow-y-visible data-[open]:lg:sticky glass"
        )}
      >
        <div className="mx-auto px-4 py-2 sm:px-12 lg:px-16">
          <div className="relative flex justify-between lg:gap-8">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <Link
                  href={routes.home}
                  className="relative w-[195px] h-[51px]"
                >
                  <Image
                    src={"/img/logo-long.png"}
                    alt={"Proffer Aid International Foundation"}
                    fill
                    sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
                  />
                </Link>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-10 md:px-8 lg:px-0">
              {pages.map(({ href, text }) => (
                <Link
                  key={text}
                  href={href}
                  className={"font-medium text-white"}
                >
                  {text}
                </Link>
              ))}
            </div>

            <div className="flex items-center lg:hidden">
              {/* Mobile menu button */}
              <PopoverButton className="group relative -mx-2 inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
                <span className="absolute -inset-0.5" />
                <span className="sr-only">Open menu</span>
                <Bars3Icon
                  aria-hidden="true"
                  className="block h-6 w-6 group-data-[open]:hidden"
                />
                <XMarkIcon
                  aria-hidden="true"
                  className="hidden h-6 w-6 group-data-[open]:block"
                />
              </PopoverButton>
            </div>

            <div className="hidden lg:flex lg:items-center lg:justify-end gap-8">
              <Link
                href={routes.donation}
                className="w-full relative inline-flex justify-center items-center gap-x-1.5 rounded-md bg-dark px-8 py-3 font-medium text-white"
              >
                Donate
              </Link>

              <Button
                className="w-full relative inline-flex justify-center items-center gap-x-1.5 rounded-md bg-secondary !px-8 !py-3 font-medium text-dark"
                onClick={() => {
                  setOpen(
                    <CustomModal
                      title="Become a member"
                      subHeading="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspen varius enim in eros elementum tristique."
                      size="sm"
                    >
                      <VolunteerForm />
                    </CustomModal>
                  );
                }}
              >
                Become a member
              </Button>
            </div>
          </div>
        </div>

        <PopoverPanel as="nav" aria-label="Global" className="lg:hidden">
          <div className="mx-auto max-w-3xl space-y-1 px-2 pb-3 pt-2 sm:px-4">
            {pages.map(({ href, text }) => (
              <Link
                key={text}
                href={href}
                aria-current={_handleActive(href) ? "page" : undefined}
                className={classNames(
                  _handleActive(href)
                    ? "bg-gray-100 text-gray-900"
                    : "hover:bg-gray-50",
                  "block rounded-md px-3 py-2 text-base font-medium"
                )}
              >
                {text}
              </Link>
            ))}
          </div>

          <div className="px-2">
            <Link
              href={routes.donation}
              className="w-full relative inline-flex justify-center items-center gap-x-1.5 rounded-md bg-dark px-8 py-3 font-medium text-white"
            >
              Donate
            </Link>
          </div>
        </PopoverPanel>
      </Popover>
    </>
  );
};

export default Navbar;
