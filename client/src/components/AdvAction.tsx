import { useState, useEffect } from 'react';
import { approveAd, rejectAd, requestChanges } from '../api/ads';
import type { Advertisement } from '../types/ads';

interface AdvActionProps {
    adId: number;
    ad?: Advertisement | null;
    onSuccess: () => void;
}

const REJECTION_REASONS = [
    'Запрещенный товар',
    'Неверная категория',
    'Некорректное описание',
    'Проблемы с фото',
    'Подозрение на мошенничество',
    'Другое'
];

const REQUEST_CHANGES_REASONS = [
    'Запрещенный товар',
    'Неверная категория',
    'Некорректное описание',
    'Проблемы с фото',
    'Подозрение на мошенничество',
    'Другое'
]

const AdvAction = ({adId, ad, onSuccess}: AdvActionProps) => {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
    const [showRequestChangesModal, setShowRequestChangesModal] = useState<boolean>(false);

    const [selectedReason, setSelectedReason] = useState<string>('');
    const [comment, setComment] = useState<string>('');
    const [customReason, setCustomReason] = useState<string>('');

    const hasModerationHistory = ad?.moderationHistory && ad.moderationHistory.length > 0;
    const isOtherReason = selectedReason === 'Другое';

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            const activeElement = document.activeElement;
            const isInputFocused = activeElement instanceof HTMLInputElement || 
                                    activeElement instanceof HTMLTextAreaElement ||
                                    (activeElement instanceof HTMLElement && activeElement.isContentEditable);
            
            if(e.key == 'a' || e.key == 'ф' || e.key == 'A' || e.key == 'Ф'){
                if(!isInputFocused){
                    e.preventDefault();
                    handleApprove();
                }
            }else if(e.key == 'd' || e.key == 'в' || e.key == 'D' || e.key == 'В'){
                if(!isInputFocused){
                    e.preventDefault();
                    handleRejectClick();
                }
            }
        };
        window.addEventListener('keydown', handleKeyPress);
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, []);

    const handleApprove = async () => {
        if (hasModerationHistory) return;
        
        try {
            setLoading(true);
            setError(null);
            
            await approveAd(adId);
            
            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(`Ошибка при одобрении: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };
    
    const handleRejectClick = () => {
        if (hasModerationHistory) return;
        setShowRejectModal(true);
        setError(null);
    };

    const handleRejectSubmit = async () => {
        if (!selectedReason) {
            setError('Выберите причину отклонения');
            return;
        }

        if (isOtherReason && !customReason.trim()) {
            setError('Укажите причину отклонения');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const finalReason = isOtherReason ? customReason.trim() : selectedReason;
            
            await rejectAd(adId, {
                reason: finalReason,
                comment: comment || undefined
            });
            
            setShowRejectModal(false);
            setSelectedReason('');
            setComment('');
            setCustomReason('');
            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(`Ошибка при отклонении: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleRequestChangesClick = () => {
        if (hasModerationHistory) return;
        setShowRequestChangesModal(true);
        setError(null);
    };

    const handleRequestChangesSubmit = async () => {
        if (!selectedReason) {
            setError('Выберите причину доработки');
            return;
        }

        if (isOtherReason && !customReason.trim()) {
            setError('Укажите причину доработки');
            return;
        }

        try {
            setLoading(true);
            setError(null);
            
            const finalReason = isOtherReason ? customReason.trim() : selectedReason;
            
            await requestChanges(adId, {
                reason: finalReason,
                comment: comment || undefined
            });
            
            setShowRequestChangesModal(false);
            setSelectedReason('');
            setComment('');
            setCustomReason('');
            onSuccess();
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Неизвестная ошибка';
            setError(`Ошибка при отправлении на доработку: ${errorMessage}`);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setShowRejectModal(false);
        setShowRequestChangesModal(false);
        setSelectedReason('');
        setComment('');
        setCustomReason('');
        setError(null);
    };


    return (
        <div className="flex flex-col gap-4 mt-4">
            {loading ? (
                <div className="bg-green-500 text-white font-bold py-2 px-4 rounded transition-colors">
                    Загрузка...
                </div>
            ) : (
                <>
                    {hasModerationHistory ? (
                        <div className="bg-amber-50 border-2 border-amber-200 rounded-xl p-4">
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">⚠️</span>
                                <div>
                                    <p className="font-semibold text-amber-800">Действия недоступны</p>
                                    <p className="text-sm text-amber-700">
                                        К этому объявлению уже было совершено действие модерации.
                                    </p>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="flex gap-4">
                                <button 
                                    onClick={handleApprove}
                                    disabled={hasModerationHistory}
                                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer" 
                                    type="button"
                                >
                                    Одобрить
                                </button>
                                <button 
                                    onClick={handleRejectClick}
                                    disabled={hasModerationHistory}
                                    className="bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer" 
                                    type="button"
                                >
                                    Отклонить
                                </button>
                                <button
                                    className="bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-2 px-4 rounded transition-colors cursor-pointer"
                                    onClick={handleRequestChangesClick}
                                    disabled={hasModerationHistory}
                                    type="button"
                                >
                                    Доработка
                                </button>
                            </div>
                            {error && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                                    {error}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}

            {showRejectModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Отклонить объявление</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Причина отклонения <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedReason}
                                onChange={(e) => {
                                    setSelectedReason(e.target.value);
                                    setCustomReason('');
                                }}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                            >
                                <option value="">Выберите причину</option>
                                {REJECTION_REASONS.map((reason) => (
                                    <option key={reason} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isOtherReason && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Укажите причину <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                    placeholder="Введите причину отклонения..."
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Комментарий (необязательно)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-red-500"
                                rows={3}
                                placeholder="Дополнительные комментарии..."
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCloseModal}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                type="button"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                disabled={loading || !selectedReason || (isOtherReason && !customReason.trim())}
                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-md disabled:bg-red-300 disabled:cursor-not-allowed cursor-pointer"
                                type="button"
                            >
                                {loading ? 'Отклонение...' : 'Отклонить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showRequestChangesModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}>
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-bold mb-4">Отправить объявление на доработку</h3>
                        
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Причина отправки на доработку <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={selectedReason}
                                onChange={(e) => {
                                    setSelectedReason(e.target.value);
                                    setCustomReason('');
                                }}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                            >
                                <option value="">Выберите причину</option>
                                {REQUEST_CHANGES_REASONS.map((reason) => (
                                    <option key={reason} value={reason}>
                                        {reason}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {isOtherReason && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Укажите причину <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={customReason}
                                    onChange={(e) => setCustomReason(e.target.value)}
                                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                    placeholder="Введите причину отправки на доработку..."
                                />
                            </div>
                        )}

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Комментарий (необязательно)
                            </label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                rows={3}
                                placeholder="Дополнительные комментарии..."
                            />
                        </div>

                        <div className="flex gap-3 justify-end">
                            <button
                                onClick={handleCloseModal}
                                disabled={loading}
                                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                type="button"
                            >
                                Отмена
                            </button>
                            <button
                                onClick={handleRequestChangesSubmit}
                                disabled={loading || !selectedReason || (isOtherReason && !customReason.trim())}
                                className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white rounded-md disabled:bg-yellow-300 disabled:cursor-not-allowed cursor-pointer"
                                type="button"
                            >
                                {loading ? 'Отправка...' : 'Отправить'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default AdvAction;