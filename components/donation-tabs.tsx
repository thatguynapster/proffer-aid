"use client";

import { Tabs } from "@/components";
import React, { useState } from "react";

type Props = {};

const DonationTabs = (props: Props) => {
  const [activeKey, setActiveKey] = useState<string>("overview");

  const links = [
    {
      name: "Overview",
      slug: "overview",
      component: () => (
        <p className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.{" "}
        </p>
      ),
    },
    {
      name: "Impact",
      slug: "impact",
      component: () => (
        <p className="text-muted">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
          varius enim in eros elementum tristique. Duis cursus, mi quis viverra
          ornare, eros dolor interdum nulla, ut commodo diam libero vitae erat.
          Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc
          ut sem vitae risus tristique posuere.
        </p>
      ),
    },
    {
      name: "What you get",
      slug: "what_you_get",
      component: () => (
        <p className="text-muted">
          Aenean faucibus nibh et justo cursus id rutrum lorem imperdiet. Nunc
          ut sem vitae risus tristique posuere.
        </p>
      ),
    },
  ];

  return (
    <Tabs
      tabs={links}
      activeKey={activeKey}
      onSelect={(tags) => setActiveKey(tags!)}
      childProps={{ setActiveKey }}
    />
  );
};

export default DonationTabs;
