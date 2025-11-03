interface ResultCardProps {
  name: string;
  description: string;
  onClick?: () => void;
}

export function ResultCard({ name, description, onClick }: ResultCardProps) {
  return (
    <div
      onClick={onClick}
      className={`
        w-full max-w-[800px] min-h-[150px]
        rounded-xl p-6
        bg-white/5 border border-white/10
        hover:border-[#4A90E2]/50 hover:bg-white/[0.08]
        transition-all duration-150
        animate-fadeInUp
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1">
          <h3 className="mb-4">{name}</h3>
          <p className="text-white/70">{description}</p>
        </div>
        {onClick && (
          <div className="text-white/30 text-sm whitespace-nowrap pt-1">
            点击查看详情 →
          </div>
        )}
      </div>
    </div>
  );
}
