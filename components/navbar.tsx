"use client";

import React from "react";
import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
  Menu,
  MenuButton,
  MenuItem,
  MenuItems,
  Popover,
  PopoverButton,
  PopoverPanel,
} from "@headlessui/react";
import {
  Bars3Icon,
  BellIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { usePathname } from "next/navigation";
import { classNames } from "@/lib/helpers";
import { routes } from "@/routes";
import Image from "next/image";
import { pages } from "@/config";

const Navbar = () => {
  const pathname = usePathname();

  const _handleActive = (link: string) => {
    return pathname.split("/")[1] === link.split("/")[1];
  };

  return (
    <>
      {/* When the mobile menu is open, add `overflow-hidden` to the `body` element to prevent double scrollbars */}
      <Popover
        as="header"
        className="bg-white shadow-sm data-[open]:fixed data-[open]:inset-0 data-[open]:z-40 data-[open]:overflow-y-auto lg:static lg:overflow-y-visible data-[open]:lg:static data-[open]:lg:overflow-y-visible"
      >
        <div className="mx-auto max-w-7xl px-4 py-2 sm:px-6 lg:px-8">
          <div className="relative flex justify-between lg:gap-8">
            <div className="flex">
              <div className="flex flex-shrink-0 items-center">
                <a href={routes.home} className="relative w-[195px] h-[51px]">
                  <Image
                    src={"/img/logo-long.png"}
                    alt={"Proffer Aid International Foundation"}
                    fill
                  />
                </a>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-10 md:px-8 lg:px-0">
              {pages.map(({ href, text }, i) => (
                <a
                  key={i}
                  href={href}
                  className={"font-medium text-neutral-700"}
                >
                  {text}
                </a>
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

            <div className="hidden lg:flex lg:items-center lg:justify-end">
              <button
                type="button"
                className="w-full relative inline-flex justify-center items-center gap-x-1.5 rounded-md bg-black px-8 py-3 font-medium text-white"
              >
                Donate
              </button>
            </div>
          </div>
        </div>

        <PopoverPanel as="nav" aria-label="Global" className="lg:hidden">
          <div className="mx-auto max-w-3xl space-y-1 px-2 pb-3 pt-2 sm:px-4">
            {pages.map(({ href, text }) => (
              <a
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
              </a>
            ))}
          </div>

          <div className="px-2">
            <button
              type="button"
              className="w-full relative inline-flex justify-center items-center gap-x-1.5 rounded-md bg-black px-8 py-3 font-medium text-white"
            >
              Donate
            </button>
          </div>
        </PopoverPanel>
      </Popover>
    </>
  );
};

export default Navbar;
