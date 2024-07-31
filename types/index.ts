import { StaticImageData } from "next/image";

export interface IEvent {
  start_date: number;
  end_date: number;
  href: string;
  title: string;
  slug: string;
}
[];

export interface IProject {
  excerpt: string;
  href: string;
  image: string | StaticImageData; // TODO: remove StaticImageData type
  name: string;
  slug: string;
}
