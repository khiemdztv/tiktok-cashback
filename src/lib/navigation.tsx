"use client";

import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { forwardRef, type AnchorHTMLAttributes } from "react";

type Destination = { to: string; params?: Record<string, string>; search?: Record<string, string> };
function hrefFor({ to, params, search }: Destination) {
  let href = to;
  for (const [key, value] of Object.entries(params || {})) href = href.replace(`$${key}`, encodeURIComponent(value));
  if (search) href += `?${new URLSearchParams(search).toString()}`;
  return href;
}

type Props = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & Destination & {
  activeProps?: { className?: string };
  inactiveProps?: { className?: string };
  activeOptions?: { exact?: boolean };
};

/** Preserve the imported site's navigation API while using Next.js routing. */
export const Link = forwardRef<HTMLAnchorElement, Props>(function Link({ to, params, search, activeProps, inactiveProps, activeOptions, className, ...props }, ref) {
  const pathname = usePathname();
  const href = hrefFor({ to, params, search });
  const destination = href.split("?")[0];
  const active = activeOptions?.exact || destination === "/" ? pathname === destination : pathname === destination || pathname.startsWith(destination + "/");
  return <NextLink ref={ref} href={href} aria-current={active ? "page" : undefined} className={[className, active ? activeProps?.className : inactiveProps?.className].filter(Boolean).join(" ")} {...props} />;
});

export function useNavigate() {
  const router = useRouter();
  return (destination: Destination) => router.push(hrefFor(destination));
}
