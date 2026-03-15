"use client";

import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

import { GitHubIcon } from "./github-icon";

const ROTATING_WORDS = ["Reusable", "Extensible", "Customizable"];
const TYPING_SPEED = 80;
const ERASING_SPEED = 45;
const PAUSE_AFTER_WORD = 1800;
const PAUSE_BEFORE_ERASE = 200;

function useTypewriter(words: string[]) {
  const [displayed, setDisplayed] = useState(words[0]);
  const [wordIndex, setWordIndex] = useState(0);
  const [isErasing, setIsErasing] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    const current = words[wordIndex];

    if (!isErasing && displayed === current) {
      timeout.current = setTimeout(() => setIsErasing(true), PAUSE_AFTER_WORD);
    } else if (isErasing && displayed === "") {
      timeout.current = setTimeout(() => {
        setWordIndex((i) => (i + 1) % words.length);
        setIsErasing(false);
      }, PAUSE_BEFORE_ERASE);
    } else if (isErasing) {
      timeout.current = setTimeout(
        () => setDisplayed((d) => d.slice(0, -1)),
        ERASING_SPEED
      );
    } else {
      timeout.current = setTimeout(
        () => setDisplayed(current.slice(0, displayed.length + 1)),
        TYPING_SPEED
      );
    }

    return () => {
      if (timeout.current) clearTimeout(timeout.current);
    };
  }, [displayed, isErasing, wordIndex, words]);

  return displayed;
}

export function HeroSection() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const typedWord = useTypewriter(ROTATING_WORDS);

  return (
    <div className="relative">
      <Image
        src="/hero_bg.png"
        alt=""
        fill
        priority
        className={`object-cover object-center transition-opacity duration-700 ${bgLoaded ? "opacity-100" : "opacity-0"}`}
        onLoad={() => setBgLoaded(true)}
      />
      <div className="absolute inset-0 bg-background/70" />

      <div className="relative mx-auto max-w-5xl px-6 py-20">
        <section>
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted px-3 py-1 text-xs text-muted-foreground mb-6">
            <span className="size-1.5 rounded-full bg-green-500" />
            Open source
          </div>

          <h1 className="mb-5 max-w-2xl leading-tight">
            <span className="text-4xl font-semibold tracking-tight text-blue-500 sm:text-5xl">
              {typedWord}
              <span className="cursor-blink">_</span>
            </span>
            <br />
            <span className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
              components for building cool dashboards.
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl leading-relaxed">
            A collection of production-ready UI components crafted with
            shadcn/ui, Tailwind CSS, and React. Copy, paste, ship.{" "}
            <a
              href="https://x.com/pablobrenner_"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground font-medium underline underline-offset-4 decoration-border hover:decoration-foreground transition-colors"
            >
              Made by @pablobrenner_
            </a>
          </p>

          <a
            href="https://github.com/brennerpablo/components-app"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-3 rounded-xl bg-blue-600 px-5 py-3.5 text-white transition-colors hover:bg-blue-500 group"
          >
            <span className="flex size-8 items-center justify-center rounded-lg bg-blue-500 group-hover:bg-blue-400 transition-colors">
              <GitHubIcon className="size-4 fill-white" />
            </span>
            <span className="flex flex-col">
              <span className="text-sm font-semibold leading-tight">
                Discover the components repo
              </span>
              <span className="text-xs text-blue-200 leading-tight">
                github.com/brennerpablo/components-app
              </span>
            </span>
            <ArrowUpRight className="ml-1 size-4 text-blue-300 group-hover:text-white transition-colors" />
          </a>
        </section>
      </div>
    </div>
  );
}
