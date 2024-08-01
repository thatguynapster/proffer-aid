import ProjectSlider from "@/components/projects-slider";
import { projects } from "@/config";
import Image from "next/image";
import React from "react";

type Props = {
  params: { slug: string };
};

const ProjectDetailsPage = ({ params }: Props) => {
  console.log(params.slug);

  return (
    <>
      {/* project details */}
      <div className="flex flex-col gap-8 max-w-[832px] mx-auto py-24">
        {/* project title */}
        <h1 className="text-6xl font-bold leading-tight">
          Mission Smile 1k: Outdoor charity outreach
        </h1>
        <p>
          Et morbi vitae lobortis nam odio. Faucibus vitae vel neque nullam in
          in lorem platea mattis. Euismod aenean rhoncus scelerisque amet
          tincidunt scelerisque aliquam. Luctus porttitor elit vel sapien,
          accumsan et id ut est. Posuere molestie in turpis quam. Scelerisque in
          viverra mi ut quisque. In sollicitudin sapien, vel nulla quisque
          vitae. Scelerisque eget accumsan, non in. Posuere magna erat bibendum
          amet, nisi eu id.
          <br /> <br />
          Viverra at diam nunc non ornare. Sed ultricies pulvinar nunc, lacus
          sem. Tellus aliquam ut euismod cursus dui lectus. Ut amet, cras
          volutpat dui. A bibendum viverra eu cras. Mauris morbi sed dignissim a
          in nec aliquam fringilla et. Mattis elit dignissim nibh sit. Donec
          arcu sed elit scelerisque tempor ornare tristique. Integer faucibus
          duis praesent tempor feugiat ornare in. Erat libero egestas porttitor
          nunc pellentesque mauris et pulvinar eget.
          <br /> <br />
          Consectetur feugiat quis hac enim nullam in enim. Tellus nisi dapibus
          libero rutrum vitae nisl, cursus in sed. Egestas mi ultricies et
          consectetur vel non. Augue enim enim, eget ut sit purus, justo nisl
          pharetra. Tincidunt leo aenean dui, varius metus, vel. Maecenas eu
          rhoncus, est nunc nisi volutpat, amet venenatis faucibus. Enim, vel
          nunc purus feugiat purus tincidunt neque. Massa ultricies faucibus
          pellentesque risus duis est.
        </p>

        <div className="relative w-full h-80">
          <Image
            src={"/img/unsplash_3k3l2brxmwQ.jpg"}
            alt={"Proffer Aid International Foundation"}
            fill
            className="object-cover rounded-3xl aspect-square lg:aspect-auto"
            sizes="(max-width: 1200px) 100vw, (max-width: 768px) 50vw, 33vw"
          />
        </div>

        <h2 className="text-5xl font-bold leading-tight">Some cool heading</h2>

        <p>
          Posuere sed pulvinar enim faucibus justo, cursus. In diam facilisi at
          sit convallis blandit blandit in. Maecenas odio orci lectus urna ante
          consequat erat non morbi. Rhoncus ullamcorper dictum sit non semper
          sit tellus adipiscing. Est sapien rhoncus sit vestibulum sollicitudin.
          Tellus urna malesuada eu id tempus lorem. Est aliquam sem bibendum
          felis interdum pharetra. Diam fermentum in lectus morbi at eget sit et
          quisque. Semper commodo viverra donec magna egestas nibh. Condimentum
          pellentesque auctor ornare at at tellus nunc cras eu. Velit dignissim
          penatibus faucibus tempus. Arcu pharetra morbi bibendum et dolor
          volutpat amet. Sed mauris amet mi sed purus vitae odio. Mi eu lectus
          suscipit sagittis, ultrices ut dui.
        </p>

        <p>
          <li className="font-bold">
            Posuere sed pulvinar enim faucibus justo, cursus.{" "}
          </li>
          <li className="font-bold">
            In diam facilisi at sit convallis blandit blandit in.
          </li>
          <li className="font-bold">
            Maecenas odio orci lectus urna ante consequat erat non morbi.
          </li>
        </p>

        <p>
          Posuere sed pulvinar enim faucibus justo, cursus. In diam facilisi at
          sit convallis blandit blandit in. Maecenas odio orci lectus urna ante
          consequat erat non morbi.
        </p>
      </div>

      {/* projects */}
      <div className="flex flex-col lg:flex-row gap-12 lg:gap-24 bg-white py-8 lg:py-16 px-8 md:px-16 lg:px-28 items-center">
        <div className="flex flex-1 flex-col gap-4 md:gap-12 w-full">
          <div className="flex flex-col gap-8 lg:pl-24 max-w-[46rem]">
            <p className="uppercase font-bold flex items-center gap-6">
              <span className="hidden lg:flex h-0.5 -ml-24 w-20 bg-dark" />
              more projects
            </p>
          </div>

          <ProjectSlider {...{ projects }} />
        </div>
      </div>
    </>
  );
};

export default ProjectDetailsPage;
