export default function Loading() {
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-7xl items-center justify-center px-4">
      <div className="glass-panel rounded-[2rem] px-8 py-6 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-white/15 border-t-cyan-300" />
        <p className="mt-4 text-sm uppercase tracking-[0.3em] text-slate-300">
          Loading BingeWatch
        </p>
      </div>
    </div>
  );
}
