import type { JSX } from "preact";

export type FluentIconProps =
  & Omit<JSX.SVGAttributes<SVGSVGElement>, "width" | "height" | "viewBox" | "fill" | "xmlns" | "class" | "className">
  & {
    size?: number;
    className?: string;
    /**
     * Only available in bundledIcon. When true, the filledClassName will be set to the regular icon.
     */
    filled?: boolean;
  };

export type FluentIcon = (pops: FluentIconProps) => JSX.Element;

function mergeClasses(...classes: unknown[]) {
  return classes.filter(Boolean).join(" ");
}

export const createIcon =
  (d: string, viewBox: string): FluentIcon => ({ size, className, ...props }: FluentIconProps) => (
    <svg
      {...props}
      width={size}
      height={size}
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={mergeClasses(bundleIconConfiguration.base, className)}
    >
      <path d={d} fill="currentColor" />
    </svg>
  );

const bundleIconConfiguration = {
  filled: "filled",
  regular: "regular",
  base: "icon",
};

export function initIconConfiguration(baseClassName: string, filledClassName: string, regularClassName: string): void {
  bundleIconConfiguration.filled = filledClassName;
  bundleIconConfiguration.regular = regularClassName;
  bundleIconConfiguration.base = baseClassName;
}

export function bundleIcon(FilledIcon: FluentIcon, RegularIcon: FluentIcon): FluentIcon {
  return ({ className, filled, ...props }: FluentIconProps) => {
    return (
      <>
        <FilledIcon
          {...props}
          className={mergeClasses(filled ? bundleIconConfiguration.regular : bundleIconConfiguration.filled, className)}
        />
        <RegularIcon
          {...props}
          className={mergeClasses(filled ? bundleIconConfiguration.filled : bundleIconConfiguration.regular, className)}
        />
      </>
    );
  };
}
