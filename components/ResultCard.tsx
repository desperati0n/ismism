interface ResultCardProps {
  name: string;
  description: string;
}

export function ResultCard({ name, description }: ResultCardProps) {
  return (
    <div
      className="
        w-full max-w-[800px] min-h-[150px]
        rounded-xl p-6
        bg-white/5 border border-white/10
        hover:border-[#4A90E2]/50 hover:bg-white/[0.08]
        transition-all duration-150
        animate-fadeInUp
      "
    >
      <h3 className="text-2xl font-semibold mb-4 text-white">{name}</h3>
      <p className="text-white/70 leading-relaxed">{description}</p>
    </div>
  );
}

