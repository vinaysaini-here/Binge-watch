import { VideoGrid } from "@/components/video/video-grid";

export function FeedSection({ eyebrow, title, description, items, compact = false }) {
  return (
    <section className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">{title}</h2>
          <p className="mt-3 text-sm leading-7 text-slate-300 sm:text-base">{description}</p>
        </div>
      </div>
      <VideoGrid items={items} compact={compact} />
    </section>
  );
}
