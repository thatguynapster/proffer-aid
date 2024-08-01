import { routes } from "@/routes";
import { HealthIcon, WavesIcon, PetIcon } from "@/components/icons";
import { BuildingOffice2Icon } from "@heroicons/react/24/outline";
import hero_bg from "../public/img/hero-bg.jpg";
import { IEvent, IProject } from "@/types";
import { AmenitiesIcon } from "@/components/icons/amenities";
import { OutreachIcon } from "@/components/icons/outreach";
import { FamilyIcon } from "@/components/icons/family";

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
    text: "About Proffer Aid",
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

export const what_we_do = [
  {
    icon: <FamilyIcon className="text-white" />,
    title: "Family support",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  },
  {
    icon: <HealthIcon className="text-white" />,
    title: "Health benefits",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  },
  {
    icon: <WavesIcon className="text-white" />,
    title: "Education",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  },
  {
    icon: <PetIcon className="text-white" />,
    title: "Therapy",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  },
  {
    icon: <AmenitiesIcon className="text-white" />,
    title: "Basic amenities",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  },
  {
    icon: <OutreachIcon className="text-white" />,
    title: "Public outreach",
    description:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique.",
  },
];

export const projects: IProject[] = [
  {
    name: "Mission smile 1k: Outdoor charity",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    image: hero_bg,
    href: routes.project.details,
    slug: "mission-smile-1k-outdoor-charity",
  },
  {
    name: "Weekly excursions",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    image: hero_bg,
    href: routes.project.details,
    slug: "weekly-excursions",
  },
  {
    name: "Monthly public awareness",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros.",
    image: hero_bg,
    href: routes.project.details,
    slug: "monthly-public-awareness",
  },
  {
    name: "We are working cross country",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.",
    image: hero_bg,
    href: routes.project.details,
    slug: "we-are-working-cross-country",
  },
  {
    name: "Our goal is to provide inclusive care",
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse varius enim in eros elementum tristique. Duis cursus, mi quis viverra ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat. Aenean faucibus nibh et justo cursus id rutrumLorem imperdiet. Nunc ut sem vitae risus tristique posuere.",
    image: hero_bg,
    href: routes.project.details,
    slug: "our-goal-is-to-provide-inclusive-care",
  },
];

export const events: IEvent[] = [
  {
    start_date: 1718441100000,
    end_date: 1718478000000,
    href: routes.event.details,
    title: "Mission smile 1k: Outdoor charity",
    slug: "mission-smile-1k-outdoor-charity",
  },
  {
    start_date: 1722329100000,
    end_date: 1722452400000,
    href: routes.event.details,
    title: "A day with our wonderful children",
    slug: "a-day-with-our-wonderful-children",
  },
  {
    start_date: 1726358400000,
    end_date: 1727740800000,
    href: routes.event.details,
    title: "Seminar: Caring for children with autism",
    slug: "seminar-caring-for-children-with-autism",
  },
  {
    start_date: 1726358400000,
    end_date: 1727740800000,
    href: routes.event.details,
    title: "Seminar: Caring for children with autism",
    slug: "seminar-caring-for-children-with-autism-2",
  },
  {
    start_date: 1726358400000,
    end_date: 1727740800000,
    href: routes.event.details,
    title: "Seminar: Caring for children with autism",
    slug: "seminar-caring-for-children-with-autism-3",
  },
];

export const team = [
  {
    name: "Leonard John Davies",
    image: "/img/team-1.jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
      linkedin: "#",
    },
    role: "Cofounder, CEO",
  },
  {
    name: "Francis Weber",
    image: "/img/team-2.jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
      linkedin: "#",
    },
    role: "Vice Chairman",
  },
  {
    name: "Kyla Obrien",
    image: "/img/team-3.jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
      linkedin: "#",
    },
    role: "Head of Authority",
  },
  {
    name: "Adrian Dixon",
    image: "/img/team-4.jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
      linkedin: "#",
    },
    role: "Support Executive",
  },
  {
    name: "Freddy Busby",
    image: "/img/team-5.jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
      linkedin: "#",
    },
    role: "Project Manager",
  },
  {
    name: "Dale Banks",
    image: "/img/team-6.jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
      linkedin: "#",
    },
    role: "Accountatnt, Finance",
  },
  {
    name: "Miriam Middleton",
    image: "/img/team-7.jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
      linkedin: "#",
    },
    role: "Cofounder, CEO",
  },
  {
    name: "Ellen Walton",
    image: "/img/team-8.jpg",
    socials: {
      facebook: "#",
      instagram: "#",
      twitter: "#",
      linkedin: "#",
    },
    role: "Vice Chairman",
  },
];
