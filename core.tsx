import type { JSX } from "preact";

export type FluentIconProps =
  & Omit<JSX.SVGAttributes<SVGSVGElement>, "width" | "height" | "viewBox" | "fill" | "xmlns" | "class" | "className">
  & {
    size?: number;
    className?: string;
  };

export type FluentIcon = (pops: FluentIconProps) => JSX.Element;

export const createIcon = (d: string, viewBox: string): FluentIcon => ({ size, ...props }: FluentIconProps) => (
  <svg
    {...props}
    width={size}
    height={size}
    viewBox={viewBox}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d={d} fill="currentColor" />
  </svg>
);
