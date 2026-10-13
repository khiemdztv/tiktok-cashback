"use client";
import { faqs } from "@/src/data/catalog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/src/components/ui/accordion";
export function FAQ() {
  return (
    <Accordion
      type="single"
      collapsible
      className="rounded-2xl border border-border bg-card px-5 md:px-7"
    >
      {faqs.map((item, index) => (
        <AccordionItem
          key={item.q}
          value={String(index)}
          className="last:border-0"
        >
          <AccordionTrigger className="gap-5 py-5 text-sm font-semibold hover:no-underline">
            {item.q}
          </AccordionTrigger>
          <AccordionContent className="max-w-3xl text-sm leading-7 text-muted-foreground">
            {item.a}
          </AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
