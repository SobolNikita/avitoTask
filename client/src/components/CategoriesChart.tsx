import { useState, useEffect } from 'react';
import type { Period } from '../types/stats';
import { getCategoriesChart, getSummaryStats, type CategoriesData, type StatsSummary } from '../api/stats';

interface CategoriesChartProps {
  period: Period;
  startDate?: string;
  endDate?: string;
}

const CategoriesChart = ({ period, startDate, endDate }: CategoriesChartProps) => {
  const [data, setData] = useState<CategoriesData | null>(null);
  const [summary, setSummary] = useState<StatsSummary | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const params: { period: Period; startDate?: string; endDate?: string } = { period };
        if (period === 'custom' && startDate && endDate) {
          params.startDate = startDate;
          params.endDate = endDate;
        }
        const [categoriesData, summaryData] = await Promise.all([
          getCategoriesChart(params),
          getSummaryStats(params)
        ]);
        setData(categoriesData);
        setSummary(summaryData);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, startDate, endDate]);

  const colors = [
    'from-indigo-500 to-indigo-600',
    'from-purple-500 to-purple-600',
    'from-pink-500 to-pink-600',
    'from-blue-500 to-blue-600',
    'from-cyan-500 to-cyan-600',
    'from-teal-500 to-teal-600',
    'from-emerald-500 to-emerald-600',
    'from-lime-500 to-lime-600',
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Распределение по категориям</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!data || !summary || Object.keys(data).length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Распределение по категориям</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Нет данных</div>
        </div>
      </div>
    );
  }

  const total = summary.totalReviewed || 0;
  const categories = Object.entries(data)
    .map(([name, count]) => ({
      name,
      count,
      percentage: total > 0 ? (count / total) * 100 : 0
    }))
    .sort((a, b) => b.count - a.count);

  const maxCount = categories.length > 0 ? Math.max(...categories.map(cat => cat.count)) : 0;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">Распределение по категориям</h2>
      
      <div className="space-y-4">
        {categories.map((category, index) => {
          const widthPercentage = maxCount > 0 ? (category.count / maxCount) * 100 : 0;
          
          return (
            <div key={category.name} className="group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 min-w-[140px]">{category.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-bold text-gray-800 min-w-[50px] text-right">{category.count}</span>
                  <span className="text-xs text-gray-500 min-w-[50px] text-right">{category.percentage.toFixed(1)}%</span>
                </div>
              </div>
              
              <div className="relative w-full h-10 bg-gray-100 rounded-lg overflow-hidden shadow-inner">
                <div
                  className={`h-full bg-gradient-to-r ${colors[index % colors.length]} rounded-lg transition-all duration-500 shadow-md hover:shadow-lg group-hover:opacity-90`}
                  style={{ width: `${widthPercentage}%` }}
                >
                  <div className="absolute inset-0 flex items-center justify-end pr-3">
                    <span className="text-xs font-semibold text-black opacity-0 group-hover:opacity-100 transition-opacity">
                        объявлений: {category.count}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Всего проверено объявлений:</span>
          <span className="font-bold text-gray-800 text-lg">{total}</span>
        </div>
      </div>
    </div>
  );
};

export default CategoriesChart;

