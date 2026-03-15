export function SiteFooter() {
  return (
    <footer className="border-t border-border mt-20">
      <div className="mx-auto max-w-5xl px-6 py-6 flex items-center justify-between text-xs text-muted-foreground">
        <span>components-app</span>
        <a
          href="https://x.com/pablobrenner_"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-foreground transition-colors"
        >
          @pablobrenner_
        </a>
      </div>
    </footer>
  );
}
