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
        result-item
        py-4
        ${onClick ? 'cursor-pointer' : ''}
      `}
    >
      <h3 className="font-bold text-lg mb-1">{name}</h3>
      <p className="text-gray-600 text-sm line-clamp-2">{description}</p>
    </div>
  );
}
