import { useState, useEffect } from 'react';
import { getActivityChart, type ActivityData } from '../api/stats';

const Chart = () => {
  const [data, setData] = useState<ActivityData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const activityData = await getActivityChart({ period: 'week' });
        setData(activityData);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getDayName = (dateString: string): string => {
    const date = new Date(dateString);
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[date.getDay()];
  };

  const getTotalCount = (day: ActivityData): number => {
    return day.approved + day.rejected + day.requestChanges;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">График активности по дням (за неделю)</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">График активности по дням (за неделю)</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Нет данных</div>
        </div>
      </div>
    );
  }

  const maxCount = Math.max(...data.map(getTotalCount));
  const sortedData = [...data].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">График активности по дням (за неделю)</h2>
      <div className="flex items-end justify-between gap-3 h-64 px-4">
        {sortedData.map((day) => {
          const totalCount = getTotalCount(day);
          const heightPercentage = maxCount > 0 ? (totalCount / maxCount) * 100 : 0;
          
          return (
            <div key={day.date} className="flex flex-col items-center flex-1 h-full">
              <div className="mb-2 text-xs font-medium text-gray-500">{totalCount}</div>
              <div className="relative w-full flex items-end justify-center h-full group">
                <div 
                  className="w-full max-w-12 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg hover:from-blue-600 hover:to-blue-500 transition-all duration-200 shadow-md" 
                  style={{ height: `${heightPercentage}%` }}
                >
                  <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                    Объявлений: {totalCount}
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs font-medium text-gray-600">{getDayName(day.date)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chart