import { VideoSubmissionForm } from "@/components/dashboard/video-submission-form";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "Submit Video",
  description: "Paste an external YouTube or Vimeo link and publish it to the platform.",
};

export const dynamic = "force-dynamic";

export default async function SubmitVideoPage() {
  await requireUser();

  return (
    <div className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Video submission</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Publish an external video link</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Paste a YouTube or Vimeo URL, add metadata, and the platform will generate the embedded player configuration.
        </p>
      </div>
      <div className="mt-8">
        <VideoSubmissionForm />
      </div>
    </div>
  );
}
