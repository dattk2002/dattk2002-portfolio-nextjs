import type { SVGProps } from "react";

export function BrandMark({ title, ...props }: SVGProps<SVGSVGElement> & { title?: string }) {
  return (
    <svg
      viewBox="0 0 150 150"
      fill="none"
      role={title ? "img" : undefined}
      aria-hidden={title ? undefined : true}
      {...props}
    >
      {title ? <title>{title}</title> : null}
      <path d="M0 0h38.17481v135.73264H0z" fill="currentColor" transform="translate(6.5553 7.9049)" />
      <path
        d="M12.14652 0H0v34.31877h10.79691c17.93059-.3856 34.12596 12.91774 34.31877 32.19794.3856 7.71208-1.92802 15.42416-6.94088 21.59382-5.01285 6.16966-11.95373 12.91775-26.41388 13.30335H0v35.6684h12.53213c36.43958 0 70.95114-26.02829 70.95115-68.83034C83.48328 33.16196 54.37017 0 12.14652 0Z"
        fill="currentColor"
        transform="translate(59.383 6.9409)"
      />
    </svg>
  );
}
