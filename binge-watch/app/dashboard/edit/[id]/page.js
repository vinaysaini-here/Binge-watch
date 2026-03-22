import { notFound } from "next/navigation";
import { VideoSubmissionForm } from "@/components/dashboard/video-submission-form";
import { getVideoById } from "@/lib/data";
import { requireUser } from "@/lib/session";

export const metadata = {
  title: "Edit Video",
  description: "Update the metadata for a submitted external video link.",
};

export const dynamic = "force-dynamic";

export default async function EditVideoPage({ params }) {
  const viewer = await requireUser();
  const { id } = await params;
  const video = await getVideoById(id, viewer.id);

  if (!video || video.author.id !== viewer.id) {
    notFound();
  }

  return (
    <div className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
      <div className="max-w-2xl">
        <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Edit submission</p>
        <h1 className="mt-3 text-3xl font-semibold text-white">Update your video metadata</h1>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          Change the link metadata, thumbnail, tags, or description while keeping the same public watch page.
        </p>
      </div>
      <div className="mt-8">
        <VideoSubmissionForm mode="edit" initialData={video} />
      </div>
    </div>
  );
}
