import type { Advertisement } from '../types/ads';

const Description = ({data} : {data: Advertisement}) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <>
            <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-4 pb-6 border-b-2 border-gray-200">
                    <span className="text-4xl">📋</span>
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Информация об объявлении</span>
                </h2>
                <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-8">
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">ID</div>
                            <div className="text-2xl font-bold text-gray-900">#{data.id}</div>
                        </div>
                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="text-xs uppercase tracking-wider text-gray-500 mb-2 font-semibold">Приоритет</div>
                            <div className="text-xl font-bold">
                                {data.priority === 'urgent' ? (
                                    <span className="text-red-600">⚡ Срочный</span>
                                ) : (
                                    <span className="text-gray-700">Обычный</span>
                                )}
                            </div>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 hover:shadow-md transition-shadow">
                            <div className="text-xs uppercase tracking-wider text-blue-600 mb-2 font-semibold">Дата создания</div>
                            <div className="text-lg font-bold text-blue-900">{formatDate(data.createdAt)}</div>
                        </div>
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-200 hover:shadow-md transition-shadow">
                            <div className="text-xs uppercase tracking-wider text-purple-600 mb-2 font-semibold">Обновлено</div>
                            <div className="text-lg font-bold text-purple-900">{formatDate(data.updatedAt)}</div>
                        </div>
                    </div>

                    {Object.keys(data.characteristics || {}).length > 0 && (
                        <div className="border-t-2 border-gray-200 pt-8 mb-8">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                                <span className="text-3xl">🔧</span>
                                <span>Характеристики</span>
                            </h3>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200 border-2 border-gray-200 rounded-lg">
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.entries(data.characteristics).map(([key, value]) => (
                                            <tr key={key} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 bg-gray-50 w-1/3 border-r border-gray-200">
                                                    {key}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {value}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {data.description && (
                        <div className="border-t-2 border-gray-200 pt-8">
                            <h3 className="text-2xl font-bold mb-6 text-gray-900 flex items-center gap-3">
                                <span className="text-3xl">📝</span>
                                <span>Описание</span>
                            </h3>
                            <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border-2 border-gray-200">
                                <p className="text-gray-800 whitespace-pre-wrap leading-relaxed text-lg">
                                    {data.description}
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-gradient-to-br from-white via-blue-50/20 to-white rounded-3xl shadow-xl p-8 mb-8 border-2 border-gray-100 hover:shadow-2xl transition-all duration-300">
                <h2 className="text-3xl font-bold mb-8 text-gray-900 flex items-center gap-4 pb-6 border-b-2 border-gray-200">
                    <span className="text-4xl bg-gradient-to-br from-blue-500 to-indigo-600 bg-clip-text text-transparent">👤</span>
                    <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">Информация о продавце</span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl p-6 border-2 border-blue-200 hover:shadow-lg transition-all hover:scale-105">
                        <div className="text-xs uppercase tracking-wider text-blue-600 mb-2 font-bold">ID продавца</div>
                        <div className="text-3xl font-black text-blue-900">#{data.seller.id}</div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border-2 border-green-200 hover:shadow-lg transition-all hover:scale-105">
                        <div className="text-xs uppercase tracking-wider text-green-600 mb-2 font-bold">Имя</div>
                        <div className="text-2xl font-bold text-green-900">{data.seller.name}</div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-amber-100 rounded-2xl p-6 border-2 border-yellow-200 hover:shadow-lg transition-all hover:scale-105">
                        <div className="text-xs uppercase tracking-wider text-yellow-600 mb-2 font-bold">⭐ Рейтинг</div>
                        <div className="text-3xl font-black text-yellow-900">{data.seller.rating}</div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-pink-100 rounded-2xl p-6 border-2 border-purple-200 hover:shadow-lg transition-all hover:scale-105">
                        <div className="text-xs uppercase tracking-wider text-purple-600 mb-2 font-bold">Объявлений</div>
                        <div className="text-3xl font-black text-purple-900">{data.seller.totalAds}</div>
                    </div>
                </div>
                <div className="mt-6 pt-6 border-t-2 border-gray-200">
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-5 border-2 border-gray-200">
                        <div className="text-xs uppercase tracking-wider text-gray-600 mb-2 font-bold">Дата регистрации</div>
                        <div className="text-lg font-bold text-gray-900">{formatDate(data.seller.registeredAt)}</div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Description;