import { COMPONENT_SECTIONS } from "@/lib/components-registry";

import { ComponentSection } from "./_components/component-section";
import { HeroSection } from "./_components/hero-section";
import { SiteFooter } from "./_components/site-footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <HeroSection />

      <main className="mx-auto max-w-5xl px-6 py-20">
        <div className="space-y-10">
          {COMPONENT_SECTIONS.map((section) => (
            <ComponentSection key={section.title} section={section} />
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
