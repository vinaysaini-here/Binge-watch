import { CircleHelp, ClipboardPaste, CloudUpload, Link2, ShieldCheck } from "lucide-react";

const steps = [
  {
    icon: CloudUpload,
    title: "1. Upload on YouTube or another platform",
    body: "Publish your original video on YouTube or Vimeo first. BingeWatch does not accept direct file uploads.",
  },
  {
    icon: Link2,
    title: "2. Copy the public video URL",
    body: "Open the published video, copy the full share link, and make sure the video is publicly viewable.",
  },
  {
    icon: ClipboardPaste,
    title: "3. Paste the link into the dashboard form",
    body: "Go to Submit Video, paste the URL, and BingeWatch will validate the platform and extract the video ID.",
  },
  {
    icon: CircleHelp,
    title: "4. Add title, description, and tags",
    body: "Use descriptive metadata so the search system can surface your video correctly in feeds and dashboards.",
  },
  {
    icon: ShieldCheck,
    title: "5. Submit and review the embedded player",
    body: "After submission, open the video page and verify the player, thumbnail, tags, and description all look correct.",
  },
];

export function UploadInstructions() {
  return (
    <div className="space-y-6">
      <section className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">How to upload video</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Beginner-friendly publishing guide</h1>
        <p className="mt-4 max-w-3xl text-sm leading-8 text-slate-300">
          BingeWatch streams external embeds only. Your video must already live on YouTube, Vimeo, or a supported platform before you submit it here.
        </p>
      </section>

      <section className="grid gap-4 md:grid-cols-2">
        {steps.map((step) => {
          const Icon = step.icon;
          return (
            <article key={step.title} className="glass-panel rounded-[1.75rem] p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-br from-cyan-300 to-orange-300 text-slate-950">
                <Icon className="h-5 w-5" />
              </div>
              <h2 className="mt-4 text-xl font-semibold text-white">{step.title}</h2>
              <p className="mt-3 text-sm leading-7 text-slate-300">{step.body}</p>
            </article>
          );
        })}
      </section>

      <section className="glass-panel rounded-[2rem] p-6">
        <h2 className="text-xl font-semibold text-white">Correct link formats</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
            <p>YouTube:</p>
            <code>https://www.youtube.com/watch?v=VIDEO_ID</code>
            <br />
            <code>https://youtu.be/VIDEO_ID</code>
          </div>
          <div className="rounded-[1.5rem] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-slate-300">
            <p>Vimeo:</p>
            <code>https://vimeo.com/123456789</code>
            <br />
            <code>https://player.vimeo.com/video/123456789</code>
          </div>
        </div>
      </section>
    </div>
  );
}
