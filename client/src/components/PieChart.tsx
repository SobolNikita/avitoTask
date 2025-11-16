import { useState, useEffect } from 'react';
import type { Period } from '../types/stats';
import { getDecisionsChart, getSummaryStats, type DecisionsData, type StatsSummary } from '../api/stats';

interface PieChartProps {
  period: Period;
  startDate?: string;
  endDate?: string;
}

const PieChart = ({ period, startDate, endDate }: PieChartProps) => {
  const [data, setData] = useState<DecisionsData | null>(null);
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
        const [decisionsData, summaryData] = await Promise.all([
          getDecisionsChart(params),
          getSummaryStats(params)
        ]);
        setData(decisionsData);
        setSummary(summaryData);
      } catch {
        //
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [period, startDate, endDate]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Распределение решений</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (!data || !summary) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">Распределение решений</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Нет данных</div>
        </div>
      </div>
    );
  }

  const approved = data.approved || 0;
  const rejected = data.rejected || 0;
  const requestChanges = data.requestChanges || 0;

  const total = summary.totalReviewed || 0;
  const approvedCount = Math.round((total * approved) / 100);
  const rejectedCount = Math.round((total * rejected) / 100);
  const requestChangesCount = Math.round((total * requestChanges) / 100);

  const approvedDegrees = (approved / 100) * 360;
  const rejectedDegrees = (rejected / 100) * 360;
  const requestChangesDegrees = (requestChanges / 100) * 360;

  const approvedEnd = approvedDegrees;
  const rejectedStart = approvedEnd;
  const rejectedEnd = rejectedStart + rejectedDegrees;
  const requestChangesStart = rejectedEnd;
  const requestChangesEnd = requestChangesStart + requestChangesDegrees;

  return (
    <div className="bg-white rounded-xl shadow-md p-6 mb-6">
      <h2 className="text-lg font-semibold text-gray-700 mb-6">Распределение решений</h2>
      
      <div className="flex flex-col md:flex-row items-center justify-center gap-8">
        <div className="relative w-64 h-64">
          <div
            className="w-full h-full rounded-full shadow-lg transition-transform hover:scale-105"
            style={{
              background: `conic-gradient(
                #10b981 0deg ${approvedEnd}deg,
                #ef4444 ${rejectedStart}deg ${rejectedEnd}deg,
                #eab308 ${requestChangesStart}deg ${requestChangesEnd}deg
              )`,
              mask: 'radial-gradient(circle at center, transparent 35%, black 35%)',
              WebkitMask: 'radial-gradient(circle at center, transparent 35%, black 35%)'
            }}
          >
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-white rounded-full w-32 h-32 shadow-inner flex items-center justify-center">
              <div className="text-center">
                <p className="text-2xl font-bold text-gray-800">{total}</p>
                <p className="text-xs text-gray-500">всего</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-green-500 to-green-600 shadow-md"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Одобрено</span>
                <span className="text-sm font-bold text-gray-800">{approved.toFixed(1)}%</span>
              </div>
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500"
                  style={{ width: `${approved}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{approvedCount} объявлений</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-red-500 to-red-600 shadow-md"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">Отклонено</span>
                <span className="text-sm font-bold text-gray-800">{rejected.toFixed(1)}%</span>
              </div>
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-red-600 rounded-full transition-all duration-500"
                  style={{ width: `${rejected}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{rejectedCount} объявлений</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-gradient-to-br from-yellow-500 to-yellow-600 shadow-md"></div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700">На доработку</span>
                <span className="text-sm font-bold text-gray-800">{requestChanges.toFixed(1)}%</span>
              </div>
              <div className="w-48 h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full transition-all duration-500"
                  style={{ width: `${requestChanges}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-1">{requestChangesCount} объявлений</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PieChart;

