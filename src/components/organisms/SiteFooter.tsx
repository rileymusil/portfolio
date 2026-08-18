export function SiteFooter() {
  return (
    <footer className="bg-brand-dark px-[5%] py-6 text-center text-[0.8rem] text-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-center gap-2 sm:flex-row sm:gap-6">
        <p className="m-0">&copy; 2026 Riley Musil. All Rights Reserved.</p>
        <p className="m-0">
          Web development by{" "}
          <a
            href="https://trashbox.io/"
            className="underline decoration-white/40 underline-offset-2 transition hover:decoration-white"
          >
            Trashbox
          </a>
        </p>
      </div>
    </footer>
  );
}
