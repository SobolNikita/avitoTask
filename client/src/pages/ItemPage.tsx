import { useParams, useNavigate } from 'react-router-dom'
import { useState, useEffect, useCallback } from 'react';
import { get } from '../api/client';
import Carousel from '../components/Carousel';
import type { Advertisement, SortField, SortOrder, AdStatus } from '../types/ads';
import HistoryModeration from '../components/HistoryModeration';
import Description from '../components/Description';
import AdvAction from '../components/AdvAction';

function ItemPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<Advertisement | null>(null);
  const [prevAdId, setPrevAdId] = useState<number | null>(null);
  const [nextAdId, setNextAdId] = useState<number | null>(null);
  
  const fetchData = useCallback(async () => {
    if (!id) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      const url = `/ads/${id}`;
      const data = await get<Advertisement>(url);
      setData(data);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    const loadNavigation = async () => {
      try {
        const currentAdId = parseInt(id || '0');
        if (!currentAdId) return;

        const savedFilters = sessionStorage.getItem('listFilters');
        
        if (!savedFilters) {
          return;
        }

        const filters = JSON.parse(savedFilters) as {
          search: string;
          selectedStatuses: AdStatus[];
          categoryId: number | null;
          minPrice: number | null;
          maxPrice: number | null;
          sortBy: SortField;
          sortOrder: SortOrder;
        };
        
        const params = new URLSearchParams({
          limit: '10',
        });
        
        if (filters.search?.trim()) {
          params.append('search', filters.search.trim());
        }
        
        filters.selectedStatuses?.forEach(status => {
          params.append('status', status);
        });
        
        if (filters.categoryId !== null && filters.categoryId !== undefined) {
          params.append('categoryId', filters.categoryId.toString());
        }
        
        if (filters.minPrice !== null && filters.minPrice !== undefined) {
          params.append('minPrice', filters.minPrice.toString());
        }
        
        if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
          params.append('maxPrice', filters.maxPrice.toString());
        }
        
        params.append('sortBy', filters.sortBy || 'createdAt');
        params.append('sortOrder', filters.sortOrder || 'desc');
        
        const firstPageParams = new URLSearchParams(params);
        firstPageParams.set('page', '1');
        const firstResponse = await get(`/ads?${firstPageParams.toString()}`) as { 
          ads: Advertisement[]; 
          pagination: { totalPages: number } 
        };
        
        let allAds: Advertisement[] = [...firstResponse.ads];
        const totalPages = firstResponse.pagination.totalPages;
        
        for (let page = 2; page <= totalPages; page++) {
          const pageParams = new URLSearchParams(params);
          pageParams.set('page', page.toString());
          
          const url = `/ads?${pageParams.toString()}`;
          const response = await get(url) as { 
            ads: Advertisement[]; 
            pagination: unknown 
          };
          
          allAds = [...allAds, ...response.ads];
        }
        
        const currentIndex = allAds.findIndex(ad => ad.id === currentAdId);
        
        if (currentIndex !== -1) {
          const prevIndex = currentIndex > 0 ? currentIndex - 1 : null;
          const nextIndex = currentIndex < allAds.length - 1 ? currentIndex + 1 : null;
          
          setPrevAdId(prevIndex !== null ? allAds[prevIndex].id : null);
          setNextAdId(nextIndex !== null ? allAds[nextIndex].id : null);
        }
      }catch {
        // 
      }
    };

    if (id) {
      loadNavigation();
    }
  }, [id]);

  if (!id) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Детали объявления</h1>
        <p className="text-gray-600">Объявление не найдено</p>
      </div>
    );
  }
  
  const getStatusBadge = (status: string) => {
    const statusMap: Record<string, { label: string; color: string }> = {
      pending: { label: 'На модерации', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
      approved: { label: 'Одобрено', color: 'bg-green-100 text-green-800 border-green-300' },
      rejected: { label: 'Отклонено', color: 'bg-red-100 text-red-800 border-red-300' },
      draft: { label: 'Черновик', color: 'bg-gray-100 text-gray-800 border-gray-300' },
    };
    const statusInfo = statusMap[status] || { label: status, color: 'bg-gray-100 text-gray-800 border-gray-300' };
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.color}`}>
        {statusInfo.label}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {(prevAdId !== null || nextAdId !== null) && (
          <div className="mb-6 flex justify-end">
            <div className="flex gap-2 bg-white rounded-xl shadow-md p-2">
              <button
                onClick={() => prevAdId && navigate(`/item/${prevAdId}`)}
                disabled={prevAdId === null}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 disabled:from-gray-50 disabled:to-gray-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-all shadow-sm hover:shadow-md font-medium disabled:opacity-50 cursor-pointer"
                type="button"
              >
                ← Предыдущее
              </button>
              <button
                onClick={() => navigate('/list')}
                className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-sm hover:shadow-md font-medium cursor-pointer"
                type="button"
              >
                📋 К списку
              </button>
              <button
                onClick={() => nextAdId && navigate(`/item/${nextAdId}`)}
                disabled={nextAdId === null}
                className="px-4 py-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:from-gray-200 hover:to-gray-100 disabled:from-gray-50 disabled:to-gray-50 disabled:cursor-not-allowed text-gray-700 rounded-lg transition-all shadow-sm hover:shadow-md font-medium disabled:opacity-50 cursor-pointer"
                type="button"
              >
                Следующее →
              </button>
            </div>
          </div>
        )}
      
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-500"></div>
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-r-blue-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }}></div>
            </div>
            <p className="mt-6 text-gray-600 text-lg font-medium">Загрузка объявления...</p>
          </div>
        ) : data ? (
          <>
            <div className="bg-gradient-to-br from-white via-blue-50/20 to-white rounded-3xl shadow-2xl p-10 mb-8 border border-gray-200/50 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-transparent rounded-full blur-3xl -z-0"></div>
              <div className="relative z-10">
                <div className="flex items-start justify-between gap-6 mb-6">
                  <div className="flex-1">
                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
                      {data.title}
                    </h1>
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="text-5xl font-black bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 bg-clip-text text-transparent drop-shadow-sm">
                        {formatPrice(data.price)}
                      </div>
                      <div className="px-5 py-2.5 bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-700 rounded-2xl text-sm font-bold border-2 border-blue-200 shadow-sm hover:shadow-md transition-shadow">
                        📂 {data.category}
                      </div>
                      {data.priority === 'urgent' && (
                        <span className="px-5 py-2.5 bg-gradient-to-r from-red-50 to-orange-50 text-red-700 rounded-2xl text-sm font-bold border-2 border-red-300 shadow-sm animate-pulse">
                          ⚡ Срочно
                        </span>
                      )}
                    </div>
                  </div>
                  {data.status && (
                    <div className="flex-shrink-0">
                      {getStatusBadge(data.status)}
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {data.images && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 hover:border-blue-200">
                  <div className="p-2">
                    <Carousel images={data.images} />
                  </div>
                </div>
              )}
              {data.id && (
                <div className="bg-white rounded-3xl shadow-xl overflow-hidden border-2 border-gray-100 hover:shadow-2xl transition-all duration-300 hover:border-blue-200">
                  <HistoryModeration adId={data.id} />
                </div>
              )}
            </div>

            {data && <Description data={data} />}
            
            {data.id && (
              <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-3xl shadow-xl p-8 border-2 border-gray-100 mt-8 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-4 pb-6 border-b-2 border-gray-200">
                  <span className="text-4xl bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-transparent">⚙️</span>
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Действия модератора</span>
                </h2>
                <AdvAction adId={data.id} ad={data} onSuccess={fetchData} />
              </div>
            )}
          </>
        ) : (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <div className="text-6xl mb-4">😕</div>
            <p className="text-gray-600 text-xl font-medium">Объявление не найдено</p>
            <button
              onClick={() => navigate('/list')}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-lg transition-all shadow-md hover:shadow-lg font-medium"
              type="button"
            >
              Вернуться к списку
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ItemPage

