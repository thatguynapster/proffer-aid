import ContactForm from "@/components/contact-form";
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TwitterIcon,
} from "@/components/icons";
import { socials } from "@/config";
import Link from "next/link";
import React, { ReactNode } from "react";

export default function Contact() {
  return (
    <>
      {/* contact details */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-[#FDF0B9] py-8 lg:py-16 px-8 md:px-16 lg:px-28">
        <div className="flex flex-1 flex-col gap-4 md:gap-12 w-full">
          <div className="flex flex-col gap-8 lg:pl-24">
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden lg:flex h-0.5 -ml-24 w-20 bg-dark" />
              Contact us
            </p>
            <h2 className="text-4xl md:text-6xl font-bold">
              We'd love to hear from you
            </h2>
            <p className="text-neutral-600">
              Have any question in mind or want to enquire? Please feel free to
              contact us through the form or the following details.
            </p>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-8">
          <div>
            <h3 className="text-2xl font-bold mb-2.5">Let's talk!</h3>
            <p className="flex gap-6">
              <span>+234 09012346514</span>
              <span>hello@largerthani.com</span>
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-2.5">Head Office</h3>
            <p>Somewhere, Accra,</p>
            <p>Ghana</p>
          </div>

          <div>
            <h3 className="text-2xl font-bold mb-2.5">Branch Office</h3>
            <p>Somewhere, Accra</p>
            <p>Ghana</p>
          </div>

          <div className="flex gap-5">
            {socials.map(({ href, text }, i) => {
              let icon: ReactNode;

              switch (text.toLowerCase()) {
                case "facebook":
                  icon = <FacebookIcon className="w-5 h-5 text-dark-muted" />;
                  break;
                case "twitter":
                  icon = <TwitterIcon className="w-5 h-5 text-dark-muted" />;
                  break;
                case "instagram":
                  icon = <InstagramIcon className="w-5 h-5 text-dark-muted" />;
                  break;
                case "linkedin":
                  icon = <LinkedInIcon className="w-5 h-5 text-dark-muted" />;
                  break;
              }
              return (
                <Link
                  key={i}
                  href={href}
                  aria-label={`follow Proffer Aid on ${text.toLowerCase()}`}
                  className="whitespace-nowrap"
                >
                  {icon}
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* contact form */}
      <div className="bg-white py-8 md:py-16 lg:py-24 px-8 md:px-16 lg:px-28 w-full max-w-3xl mx-auto flex flex-col gap-8">
        <ContactForm />
      </div>
    </>
  );
}
