import { IconProps, Template } from "./template";

export const FacebookIcon = ({ size, className, ...props }: IconProps) => {
  return (
    <Template {...{ size, className, props }}>
      <g clipPath="url(#clip0_318_573)">
        <path
          d="M24 11.9951C24 5.3677 18.6274 -0.00488281 12 -0.00488281C5.37258 -0.00488281 0 5.3677 0 11.9951C0 17.9846 4.3882 22.9491 10.125 23.8493V15.4639H7.07812V11.9951H10.125V9.35137C10.125 6.34387 11.9166 4.68262 14.6576 4.68262C15.9701 4.68262 17.3438 4.91699 17.3438 4.91699V7.87012H15.8306C14.34 7.87012 13.875 8.7952 13.875 9.74512V11.9951H17.2031L16.6711 15.4639H13.875V23.8493C19.6118 22.9491 24 17.9846 24 11.9951Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_318_573">
          <rect
            width="24"
            height="24"
            fill="white"
            transform="translate(0 -0.00488281)"
          />
        </clipPath>
      </defs>
    </Template>
  );
};
