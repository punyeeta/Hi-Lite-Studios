interface CardProps {
  image: string;
  description?: string;
  onClick?: () => void;
  className?: string;
}

const Card = ({ image, description = "Description", onClick, className = "" }: CardProps) => {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // Fallback to a placeholder if image fails to load
    e.currentTarget.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="400"%3E%3Crect width="400" height="400" fill="%23e5e7eb"/%3E%3Ctext x="50%25" y="50%25" dominant-baseline="middle" text-anchor="middle" fill="%239ca3af" font-size="18"%3ENo Image%3C/text%3E%3C/svg%3E';
  };

  return (
    <div
      className={`bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transition-transform hover:scale-105 hover:shadow-lg ${className}`}
      onClick={onClick}
    >
      <div className="aspect-square w-full overflow-hidden bg-gray-100">
        <img
          src={image}
          alt={description}
          className="w-full h-full object-cover"
          onError={handleImageError}
        />
      </div>
      <div className="p-4 text-center">
        <p className="text-gray-600 text-sm font-medium">{description}</p>
      </div>
    </div>
  );
};

export default Card;

