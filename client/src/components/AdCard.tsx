import { Link } from 'react-router-dom';
import type { Advertisement } from '../types/ads';

interface AdCardProps {
  ad: Advertisement;
}

function AdCard({ ad }: AdCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };


  const getStatusLabel = (status: string) => {
    const statusMap: Record<string, string> = {
      pending: 'На модерации',
      approved: 'Одобрено',
      rejected: 'Отклонено',
      draft: 'Черновик',
    };
    return statusMap[status] || status;
  };


  const getStatusColor = (status: string) => {
    const colorMap: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      draft: 'bg-gray-100 text-gray-800',
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <Link
      to={`/item/${ad.id}`}
      className="block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden mb-4"
    >
      <div className="flex">
        <div className="w-48 h-48 flex-shrink-0">
          <img
            src={ad.images[0]}
            alt={ad.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 p-4 flex flex-col">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 flex-1">
              {ad.title}
            </h3>
            {ad.priority === 'urgent' && (
              <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded whitespace-nowrap">
                Срочно
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 mb-2">
            <span className="text-xl font-bold text-blue-600">
              {formatPrice(ad.price)}
            </span>
            <span className="px-2 py-1 bg-gray-100 rounded text-sm">
              {ad.category}
            </span>
          </div>

          <div className="flex items-center gap-4 mt-auto">
            <span className="text-sm text-gray-500">
              Создано: {formatDate(ad.createdAt)}
            </span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(ad.status)}`}>
              {getStatusLabel(ad.status)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

export default AdCard;

