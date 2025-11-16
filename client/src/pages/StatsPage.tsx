import { useState, useEffect } from 'react';
import type { Period } from '../types/stats';
import { getSummaryStats, type StatsSummary } from '../api/stats';

import Chart from '../components/Chart'
import PieChart from '../components/PieChart'
import CategoriesChart from '../components/CategoriesChart'

function StatsPage() {
  const [period, setPeriod] = useState<Period>('today');
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
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
        const data = await getSummaryStats(params);
        setSummary(data);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };
    
    if (period !== 'custom' || (period === 'custom' && startDate && endDate)) {
      fetchData();
    }
  }, [period, startDate, endDate]);

  const formatDateToString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handlePeriodChange = (newPeriod: Period) => {
    setPeriod(newPeriod);
    if (newPeriod !== 'custom') {
      setStartDate('');
      setEndDate('');
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(tomorrow.getDate() - 7);
      
      setEndDate(formatDateToString(tomorrow));
      setStartDate(formatDateToString(sevenDaysAgo));
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Статистика модератора</h1>
      
      <Chart />

      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-4">Период</h2>
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <button
            className={`px-6 py-2.5 ${period === 'today' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg font-medium transition-all hover:shadow-md active:scale-95 cursor-pointer`}
            onClick={() => handlePeriodChange('today')}
          >
            Сегодня
          </button>
          <button
            className={`px-6 py-2.5 ${period === 'week' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg font-medium transition-all hover:shadow-md active:scale-95 cursor-pointer`}
            onClick={() => handlePeriodChange('week')}
          >
            7 дней
          </button>
          <button
            className={`px-6 py-2.5 ${period === 'month' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg font-medium transition-all hover:shadow-md active:scale-95 cursor-pointer`}
            onClick={() => handlePeriodChange('month')}
          >
            30 дней
          </button>
          <button
            className={`px-6 py-2.5 ${period === 'custom' ? 'bg-blue-500 text-white hover:bg-blue-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'} rounded-lg font-medium transition-all hover:shadow-md active:scale-95 cursor-pointer`}
            onClick={() => handlePeriodChange('custom')}
          >
            Свой период
          </button>
        </div>

        {period === 'custom' && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата начала
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Дата окончания
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  min={startDate}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {startDate && endDate && new Date(startDate) > new Date(endDate) && (
              <p className="mt-2 text-sm text-red-600">
                Дата начала не может быть позже даты окончания
              </p>
            )}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-sm font-medium text-blue-100 mb-2">Проверено</h3>
          {loading ? (
            <p className="text-3xl font-bold">...</p>
          ) : (
            <p className="text-3xl font-bold">{summary?.totalReviewed || 0}</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-sm font-medium text-green-100 mb-2">Одобрено</h3>
          {loading ? (
            <p className="text-3xl font-bold">...</p>
          ) : (
            <p className="text-3xl font-bold">{summary ? `${summary.approvedPercentage.toFixed(1)}%` : '0%'}</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-sm font-medium text-red-100 mb-2">Отклонено</h3>
          {loading ? (
            <p className="text-3xl font-bold">...</p>
          ) : (
            <p className="text-3xl font-bold">{summary ? `${summary.rejectedPercentage.toFixed(1)}%` : '0%'}</p>
          )}
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-md p-6 text-white">
          <h3 className="text-sm font-medium text-purple-100 mb-2">Среднее время</h3>
          {loading ? (
            <p className="text-3xl font-bold">...</p>
          ) : (
            <p className="text-3xl font-bold">
              {summary ? `${(summary.averageReviewTime / 60).toFixed(1)} мин` : '0 мин'}
            </p>
          )}
        </div>
      </div>

      <PieChart period={period} startDate={period === 'custom' ? startDate : undefined} endDate={period === 'custom' ? endDate : undefined} />

      <CategoriesChart period={period} startDate={period === 'custom' ? startDate : undefined} endDate={period === 'custom' ? endDate : undefined} />
      
    </div>
  )
}

export default StatsPage

