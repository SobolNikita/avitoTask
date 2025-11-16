import { useEffect, useState, useRef } from 'react';
import { get } from '../api/client';
import type { Advertisement, AdStatus, SortField, SortOrder, Pagination } from '../types/ads';
import AdCard from '../components/AdCard';

function ListPage() {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  
  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<AdStatus[]>([]);
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [sortBy, setSortBy] = useState<SortField>('createdAt');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [filtersInitialized, setFiltersInitialized] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const savedFilters = sessionStorage.getItem('listFilters');
    if (savedFilters) {
      try {
        const filters = JSON.parse(savedFilters) as {
          search: string;
          selectedStatuses: AdStatus[];
          categoryId: number | null;
          minPrice: number | null;
          maxPrice: number | null;
          sortBy: SortField;
          sortOrder: SortOrder;
          currentPage?: number;
        };

        if (filters.search !== undefined) setSearch(filters.search);
        if (filters.selectedStatuses && filters.selectedStatuses.length > 0) {
          setSelectedStatuses(filters.selectedStatuses);
        } else {
          setSelectedStatuses([]);
        }
        if (filters.categoryId !== null && filters.categoryId !== undefined) {
          setCategoryId(filters.categoryId);
        } else {
          setCategoryId(null);
        }
        if (filters.minPrice !== null && filters.minPrice !== undefined) {
          setMinPrice(filters.minPrice);
        } else {
          setMinPrice(null);
        }
        if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
          setMaxPrice(filters.maxPrice);
        } else {
          setMaxPrice(null);
        }
        if (filters.sortBy) setSortBy(filters.sortBy);
        if (filters.sortOrder) setSortOrder(filters.sortOrder);
        if (filters.currentPage) setCurrentPage(filters.currentPage);
      } catch {
        //
      }
    }
    setFiltersInitialized(true);
  }, []);

  useEffect(() => {
    if (!filtersInitialized) {
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        
        const params = new URLSearchParams({
          page: currentPage.toString(),
          limit: '10',
        });
        
        if (search.trim()) {
          params.append('search', search.trim());
        }
        
        selectedStatuses.forEach(status => {
          params.append('status', status);
        });
        
        if (categoryId !== null) {
          params.append('categoryId', categoryId.toString());
        }
        
        if (minPrice !== null) {
          params.append('minPrice', minPrice.toString());
        }
        
        if (maxPrice !== null) {
          params.append('maxPrice', maxPrice.toString());
        }
        
        params.append('sortBy', sortBy);
        params.append('sortOrder', sortOrder);
        
        const url = `/ads?${params.toString()}`;
        const data = await get(url) as { ads: Advertisement[]; pagination: Pagination };
        setAds(data.ads);
        setPagination(data.pagination);
        
        sessionStorage.setItem('listFilters', JSON.stringify({
          search,
          selectedStatuses,
          categoryId,
          minPrice,
          maxPrice,
          sortBy,
          sortOrder,
          currentPage
        }));
      } catch{
        //
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [search, selectedStatuses, categoryId, minPrice, maxPrice, sortBy, sortOrder, currentPage, filtersInitialized]);

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if ((e.key === '.' || e.key === '/') && searchInputRef.current) {
        const activeElement = document.activeElement;
        const isInputFocused = activeElement instanceof HTMLInputElement || 
                              activeElement instanceof HTMLTextAreaElement ||
                              (activeElement instanceof HTMLElement && activeElement.isContentEditable);
        
        if (!isInputFocused) {
          e.preventDefault();
          searchInputRef.current.focus();
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, []);


  const statusOptions: { value: AdStatus; label: string }[] = [
    { value: 'pending', label: 'На модерации' },
    { value: 'approved', label: 'Одобрено' },
    { value: 'rejected', label: 'Отклонено' },
    { value: 'draft', label: 'Черновик' },
  ];

  const categories: string[] = [
    'Электроника',
    'Недвижимость',
    'Транспорт',
    'Работа',
    'Услуги',
    'Животные',
    'Мода',
    'Детское',
  ];



  const handleCategoryChange = (value: string) => {
    const id = value === '' ? null : parseInt(value);
    setCategoryId(id);
    setCurrentPage(1);
  };

  const handleMinPriceChange = (value: string) => {
    const price = value === '' ? null : parseFloat(value);
    setMinPrice(price);
    setCurrentPage(1);
  };

  const handleMaxPriceChange = (value: string) => {
    const price = value === '' ? null : parseFloat(value);
    setMaxPrice(price);
    setCurrentPage(1);
  };

  const handleSortChange = (field: SortField) => {
    setSortBy(field);
    setCurrentPage(1);
  };

  const handleSortOrderToggle = () => {
    setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    setCurrentPage(1);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setCurrentPage(1);
  };

  const handleStatusToggle = (status: AdStatus) => {
    setSelectedStatuses(prev => {
      if (prev.includes(status)) {
        return prev.filter(s => s !== status);
      } else {
        return [...prev, status];
      }
    });
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedStatuses([]);
    setCategoryId(null);
    setMinPrice(null);
    setMaxPrice(null);
    setSortBy('createdAt');
    setSortOrder('desc');
    setCurrentPage(1);
    sessionStorage.removeItem('listFilters');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Список объявлений</h1>
      
      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Фильтры</h2>
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Поиск по названию
          </label>
          <input
            ref={searchInputRef}
            type="text"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Введите название для поиска..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Статус
          </label>
          <div className="flex flex-wrap gap-2">
            {statusOptions.map((option) => (
              <label key={option.value} className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedStatuses.includes(option.value)}
                  onChange={() => handleStatusToggle(option.value)}
                  className="mr-2"
                />
                <span className="text-sm">{option.label}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Категория
          </label>
          <select
            value={categoryId !== null ? categoryId.toString() : ''}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Все категории</option>
            {categories.map((category, index) => (
              <option key={index} value={index}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Диапазон цен (₽)
          </label>
          <div className="flex gap-2">
            <input
              type="number"
              value={minPrice || ''}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              placeholder="От"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={maxPrice || ''}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              placeholder="До"
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <button
          onClick={handleResetFilters}
          className="w-full px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
          Сбросить все фильтры
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Сортировка</h2>
        
        <div className="flex items-center gap-4 flex-wrap">
          <label className="text-sm font-medium text-gray-700">Сортировать по:</label>
          
          <select
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value as SortField)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="createdAt">По дате создания</option>
            <option value="price">По цене</option>
            <option value="priority">По приоритету</option>
          </select>

          <button
            onClick={handleSortOrderToggle}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center gap-2 transition-colors"
          >
            <span>{sortOrder === 'asc' ? '↑' : '↓'}</span>
            <span className="text-sm">
              {sortOrder === 'asc' ? 'По возрастанию' : 'По убыванию'}
            </span>
          </button>
        </div>
      </div>
      
      {loading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="mt-4 text-gray-600">Загрузка объявлений...</p>
        </div>
      )}
      
      {!loading && ads.length > 0 && (
        <>
          <div className="space-y-4 mb-6">
            {ads.map((ad) => (
              <AdCard key={ad.id} ad={ad} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="text-sm text-gray-600">
                  Показано {(pagination.currentPage - 1) * pagination.itemsPerPage + 1} - {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} из {pagination.totalItems}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Назад
                  </button>

                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum: number;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <button
                        key={pageNum}
                        onClick={() => handlePageChange(pageNum)}
                        className={`px-3 py-2 border rounded-md ${
                          pageNum === currentPage
                            ? 'bg-blue-500 text-white border-blue-500'
                            : 'border-gray-300 hover:bg-gray-50'
                        } transition-colors`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === pagination.totalPages}
                    className="px-3 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
                  >
                    Вперед
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {!loading && ads.length === 0 && (
        <p className="text-gray-600">Объявления не найдены</p>
      )}
    </div>
  );
}

export default ListPage;

