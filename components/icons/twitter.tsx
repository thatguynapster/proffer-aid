import { IconProps, Template } from "./template";

export const TwitterIcon = ({ size, className, ...props }: IconProps) => {
  return (
    <Template {...{ size, className, props }}>
      <g clipPath="url(#clip0_318_575)">
        <path
          d="M7.55016 21.7453C16.6045 21.7453 21.5583 14.2421 21.5583 7.73722C21.5583 7.52628 21.5536 7.31066 21.5442 7.09972C22.5079 6.40282 23.3395 5.53962 24 4.55066C23.1025 4.94996 22.1496 5.21074 21.1739 5.3241C22.2013 4.70827 22.9705 3.74083 23.3391 2.60113C22.3726 3.17392 21.3156 3.57797 20.2134 3.79597C19.4708 3.00692 18.489 2.48448 17.4197 2.30941C16.3504 2.13435 15.2532 2.31641 14.2977 2.82746C13.3423 3.3385 12.5818 4.15007 12.1338 5.13667C11.6859 6.12328 11.5754 7.22998 11.8195 8.28566C9.86249 8.18745 7.94794 7.67907 6.19998 6.79346C4.45203 5.90785 2.90969 4.6648 1.67297 3.14488C1.0444 4.2286 0.852057 5.51101 1.13503 6.73145C1.418 7.9519 2.15506 9.01881 3.19641 9.71535C2.41463 9.69053 1.64998 9.48004 0.965625 9.10128V9.16222C0.964925 10.2995 1.3581 11.4019 2.07831 12.2821C2.79852 13.1623 3.80132 13.7659 4.91625 13.9903C4.19206 14.1885 3.43198 14.2174 2.69484 14.0747C3.00945 15.0528 3.62157 15.9083 4.44577 16.5217C5.26997 17.1351 6.26512 17.476 7.29234 17.4966C5.54842 18.8665 3.39417 19.6095 1.17656 19.606C0.783287 19.6054 0.390399 19.5813 0 19.5338C2.25286 20.9791 4.87353 21.7467 7.55016 21.7453Z"
          fill="currentColor"
        />
      </g>
      <defs>
        <clipPath id="clip0_318_575">
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
