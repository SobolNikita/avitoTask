import { useEffect, useState } from 'react';
import { getModerationHistory } from '../api/ads';
import type { ModerationHistory } from '../types/ads';


const HistoryModeration = ({ adId }: { adId: number }) => {
  const [history, setHistory] = useState<ModerationHistory[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const data = await getModerationHistory(adId);
        setHistory(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
        setError(`Ошибка при загрузке истории модерации: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    if (adId) {
      fetchHistory();
    }
  }, [adId]);

  const formatDateTime = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getActionLabel = (action: string): string => {
    const actionMap: Record<string, string> = {
      approved: 'Одобрено',
      rejected: 'Отклонено',
      requestChanges: 'Запрошены изменения',
    };
    return actionMap[action] || action;
  };

  const getBorderColor = (action: string): string => {
    const colorMap: Record<string, string> = {
      approved: 'border-green-500',
      rejected: 'border-red-500',
      requestChanges: 'border-yellow-500',
    };
    return colorMap[action] || 'border-gray-500';
  };

  const getBadgeColor = (action: string): string => {
    const colorMap: Record<string, string> = {
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      requestChanges: 'bg-yellow-100 text-yellow-800',
    };
    return colorMap[action] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <span>📜</span> История модерации
        </h3>
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <p className="ml-3 text-gray-600">Загрузка...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <span>📜</span> История модерации
        </h3>
        <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    );
  }

  if (!history || history.length === 0) {
    return (
      <div className="p-6">
        <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
          <span>📜</span> История модерации
        </h3>
        <div className="bg-gray-50 rounded-lg p-6 text-center">
          <p className="text-gray-500">История модерации отсутствует</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h3 className="text-xl font-bold mb-6 text-gray-900 flex items-center gap-2">
        <span>📜</span> История модерации
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto [scrollbar-width:thin] [scrollbar-color:rgba(156,163,175,0.5)_transparent]">
        {history.map((entry) => (
          <div
            key={entry.id}
            className={`border-l-4 rounded-r-lg p-4 bg-gradient-to-r from-gray-50 to-white shadow-sm hover:shadow-md transition-shadow ${getBorderColor(entry.action)}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3 flex-wrap">
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getBadgeColor(entry.action)}`}>
                    {getActionLabel(entry.action)}
                  </span>
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <span>🕐</span>
                    {formatDateTime(entry.timestamp)}
                  </span>
                </div>
                <div className="text-sm text-gray-700 mb-2">
                  <span className="font-semibold text-gray-900">Модератор:</span>{' '}
                  <span className="text-gray-700">{entry.moderatorName}</span>
                </div>
                {entry.reason && (
                  <div className="text-sm text-gray-700 mb-2">
                    <span className="font-semibold text-gray-900">Причина:</span>{' '}
                    <span className="text-gray-700">{entry.reason}</span>
                  </div>
                )}
                {entry.comment && (
                  <div className="text-sm text-gray-700 mt-3 p-3 bg-white rounded-lg border border-gray-200 shadow-sm">
                    <span className="font-semibold text-gray-900 block mb-1">Комментарий:</span>
                    <span className="text-gray-700">{entry.comment}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HistoryModeration;
