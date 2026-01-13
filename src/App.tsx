import { useState, useEffect } from 'react';
import { CurrencyConverter } from './components/CurrencyConverter';
import { HistoryList } from './components/HistoryList';
import { FavoritesList } from './components/FavoritesList';
import { Logo } from './components/Logo';

export interface ConversionRecord {
  id: string;
  fromCurrency: string;
  toCurrency: string;
  fromAmount: number;
  toAmount: number;
  rate: number;
  timestamp: number;
  isFavorite: boolean;
}

export default function App() {
  const [history, setHistory] = useState<ConversionRecord[]>([]);
  const [favorites, setFavorites] = useState<ConversionRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'history' | 'favorites'>('history');

  // 从 localStorage 加载历史数据，从 API 加载收藏数据
  useEffect(() => {
    const savedHistory = localStorage.getItem('conversionHistory');

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    fetch('/api/favorites')
      .then(res => res.json())
      .then(data => setFavorites(data))
      .catch(err => console.error("Failed to load favorites:", err));
  }, []);

  // 保存历史到 localStorage
  useEffect(() => {
    if (history.length > 0) {
      localStorage.setItem('conversionHistory', JSON.stringify(history));
    }
  }, [history]);

  // 收藏不再保存到 localStorage

  const handleNewConversion = (record: ConversionRecord) => {
    setHistory(prev => [record, ...prev].slice(0, 50)); // 只保留最近50条
  };

  const handleToggleFavorite = async (id: string) => {
    const record = history.find(r => r.id === id) || favorites.find(r => r.id === id);
    if (!record) return;

    const newIsFavorite = !record.isFavorite;
    const updatedRecord = { ...record, isFavorite: newIsFavorite };

    // Update UI optimistic
    setHistory(prev => prev.map(r => r.id === id ? updatedRecord : r));

    if (newIsFavorite) {
      setFavorites(prev => [updatedRecord, ...prev]);
      try {
        await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatedRecord)
        });
      } catch (err) {
        console.error("Failed to save favorite:", err);
      }
    } else {
      setFavorites(prev => prev.filter(r => r.id !== id));
      try {
        await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error("Failed to delete favorite:", err);
      }
    }
  };

  const handleDeleteHistory = async (id: string) => {
    // Check if it's in favorites to delete from backend too if needed?
    // Usually logic: deleting from history doesn't delete from favorites if they are separate lists.
    // But here `id` is unique. If a favorite is also in history, and we delete from history?
    // The UI has two tabs. `HistoryList` calls `onDelete`. `FavoritesList` calls `onDelete`.

    // If we are deleting from favorites list:
    const isFavorite = favorites.some(r => r.id === id);

    setHistory(prev => prev.filter(r => r.id !== id));
    setFavorites(prev => prev.filter(r => r.id !== id));

    if (isFavorite) {
      try {
        await fetch(`/api/favorites/${id}`, { method: 'DELETE' });
      } catch (err) {
        console.error("Failed to delete favorite:", err);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative overflow-hidden">
      {/* 炫彩背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* 大圆形渐变 1 */}
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full opacity-20 blur-3xl animate-pulse"></div>

        {/* 大圆形渐变 2 */}
        <div className="absolute top-1/3 -left-32 w-80 h-80 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

        {/* 大圆形渐变 3 */}
        <div className="absolute bottom-20 right-1/4 w-72 h-72 bg-gradient-to-br from-indigo-400 to-purple-500 rounded-full opacity-15 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* 中等圆形渐变 */}
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gradient-to-br from-yellow-300 to-orange-400 rounded-full opacity-10 blur-2xl"></div>

        {/* 小圆形装饰 */}
        <div className="absolute top-20 left-1/4 w-40 h-40 bg-gradient-to-br from-green-300 to-teal-400 rounded-full opacity-15 blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        <div className="absolute bottom-1/3 left-1/2 w-48 h-48 bg-gradient-to-br from-rose-300 to-pink-400 rounded-full opacity-10 blur-2xl"></div>
      </div>

      <div className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        <header className="mb-8">
          <div className="flex items-center justify-center gap-4">
            <Logo className="h-14 w-auto flex-shrink-0" />
            <div className="text-left">
              <h1 className="text-4xl font-bold text-gray-800 font-sans tracking-tight">RateFlow</h1>
              <p className="text-gray-600">实时汇率换算，支持多种货币</p>
            </div>
          </div>
        </header>

        <div className="max-w-4xl mx-auto space-y-6">
          {/* 货币换算器 */}
          <CurrencyConverter onConvert={handleNewConversion} />

          {/* 历史和收藏 */}
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {/* 标签切换 */}
            <div className="flex bg-gray-50 p-2 gap-2">
              <button
                onClick={() => setActiveTab('history')}
                className={`flex-1 py-3 px-6 font-medium transition-all duration-300 rounded-lg ${activeTab === 'history'
                  ? 'bg-white text-gray-800 shadow-md'
                  : 'bg-transparent text-gray-500 hover:bg-white/50 hover:text-gray-700'
                  }`}
              >
                换算历史 ({history.length})
              </button>
              <button
                onClick={() => setActiveTab('favorites')}
                className={`flex-1 py-3 px-6 font-medium transition-all duration-300 rounded-lg ${activeTab === 'favorites'
                  ? 'bg-white text-gray-800 shadow-md'
                  : 'bg-transparent text-gray-500 hover:bg-white/50 hover:text-gray-700'
                  }`}
              >
                收藏记录 ({favorites.length})
              </button>
            </div>

            {/* 内容区域 */}
            <div className="p-6">
              {activeTab === 'history' ? (
                <HistoryList
                  records={history}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteHistory}
                />
              ) : (
                <FavoritesList
                  records={favorites}
                  onToggleFavorite={handleToggleFavorite}
                  onDelete={handleDeleteHistory}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}