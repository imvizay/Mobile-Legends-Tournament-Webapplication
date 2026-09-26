export default function Skeleton({ className = "" }) {
  return (
    <div
      className={`
        relative
        overflow-hidden
        rounded-xl
        bg-zinc-300
        ${className}
      `}
    >
      <span className="absolute inset-y-0 left-0 w-24 animate-flash bg-gradient-to-r from-transparent via-white/50 to-transparent" />

    </div>
  );
}