import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col items-center justify-center px-6 text-center">
      <div className="glass-panel-strong w-full rounded-[2rem] px-8 py-14">
        <p className="text-sm uppercase tracking-[0.35em] text-cyan-300">404</p>
        <h1 className="mt-4 text-4xl font-semibold text-white">This stream does not exist.</h1>
        <p className="mt-4 text-base text-slate-300">
          The video may have been removed, or the link was never published.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-cyan-100"
        >
          Return to homepage
        </Link>
      </div>
    </div>
  );
}
