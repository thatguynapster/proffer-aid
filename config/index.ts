import { routes } from "@/routes";

interface PageType {
  text: string;
  href: string;
}

export const pages: PageType[] = [
  {
    text: "Home",
    href: routes.home,
  },
  {
    text: "About Us",
    href: routes.about_us,
  },
  {
    text: "What We Do",
    href: routes.what_we_do,
  },
  {
    text: "Contact",
    href: routes.contact,
  },
];

export const morePages: PageType[] = [
  {
    text: "Projects",
    href: routes.project.index,
  },
  {
    text: "Events",
    href: routes.event.index,
  },
  {
    text: "Donate",
    href: routes.donation,
  },
];

export const socials: PageType[] = [
  {
    text: "Instagram",
    href: "",
  },
  {
    text: "Facebook",
    href: "",
  },
  {
    text: "Twitter",
    href: "",
  },
];
