"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { usePathname } from "next/navigation";

import { Footer } from "./Footer";
import { Header } from "./Header";
import { MobileTabBar } from "./MobileTabBar";
import { SocialFloating } from "./SocialLinks";
import { Toaster } from "@/src/components/ui/sonner";

export function SiteLayout({ children }: { children: ReactNode }) {
  const main = useRef<HTMLElement>(null);
  const pathname = usePathname();
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const elements = Array.from(main.current?.querySelectorAll("section.container-page, main > .container-page") || []);
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add("section-visible"); observer.unobserve(entry.target); }
    }), { threshold: .08 });
    elements.forEach(element => {
      if (element.getBoundingClientRect().top > window.innerHeight) { element.classList.add("section-reveal"); observer.observe(element); }
    });
    return () => { observer.disconnect(); elements.forEach(element => element.classList.remove("section-reveal", "section-visible")); };
  }, [pathname]);
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <a href="#main-content" className="skip-link">Đi tới nội dung</a>
      <Header />
      <main ref={main} id="main-content" className="min-w-0 flex-1">{children}</main>
      <Footer />
      <SocialFloating />
      <MobileTabBar />
      <Toaster position="top-center" richColors />
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="border-b border-border bg-surface/50">
      <div className="container-page py-10 md:py-14">
        <h1 className="text-3xl font-extrabold md:text-4xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-muted-foreground">{subtitle}</p>}
        {children}
      </div>
    </div>
  );
}
