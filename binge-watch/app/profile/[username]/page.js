import { notFound } from "next/navigation";
import { FeedSection } from "@/components/feed/feed-section";
import { getCurrentUser } from "@/lib/session";
import { getProfileByUsername } from "@/lib/data";

export const dynamic = "force-dynamic";

export default async function ProfilePage({ params }) {
  const { username } = await params;
  const viewer = await getCurrentUser();
  const profile = await getProfileByUsername(username, viewer?.id);

  if (!profile) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 px-4 pb-20 pt-8 sm:px-6 lg:px-8">
      <section className="glass-panel-strong rounded-[2rem] p-6 sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-cyan-400 to-orange-400 text-xl font-bold text-slate-950">
              {(profile.user.username || "B").slice(0, 1).toUpperCase()}
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-cyan-300">Creator profile</p>
              <h1 className="mt-2 text-3xl font-semibold text-white">@{profile.user.username}</h1>
            </div>
          </div>
          <p className="max-w-2xl text-sm leading-7 text-slate-300">{profile.user.bio || "No bio added yet."}</p>
        </div>
      </section>
      <FeedSection
        eyebrow="Creator library"
        title={`Streams curated by @${profile.user.username}`}
        description="Every submission embedded and presented inside the BingeWatch player system."
        items={profile.videos}
      />
    </div>
  );
}
