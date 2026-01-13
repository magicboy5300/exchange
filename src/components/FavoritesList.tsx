import { Star, Trash2, Heart } from 'lucide-react';
import type { ConversionRecord } from '../App';

const CURRENCY_FLAGS: Record<string, string> = {
  'USD': '🇺🇸',
  'CNY': '🇨🇳',
  'EUR': '🇪🇺',
  'GBP': '🇬🇧',
  'JPY': '🇯🇵',
  'HKD': '🇭🇰',
  'KRW': '🇰🇷',
  'SGD': '🇸🇬',
  'AUD': '🇦🇺',
  'CAD': '🇨🇦',
};

interface Props {
  records: ConversionRecord[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function FavoritesList({ records, onToggleFavorite, onDelete }: Props) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // 按货币对分组
  const groupedRecords = records.reduce((acc, record) => {
    const key = `${record.fromCurrency}-${record.toCurrency}`;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(record);
    return acc;
  }, {} as Record<string, ConversionRecord[]>);

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">暂无收藏记录</p>
        <p className="text-sm text-gray-400 mt-2">点击历史记录的星标按钮即可收藏</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-h-[600px] overflow-y-auto">
      {Object.entries(groupedRecords).map(([currencyPair, groupRecords]) => {
        const [fromCurrency, toCurrency] = currencyPair.split('-');
        return (
          <div key={currencyPair} className="space-y-3">
            {/* 货币对标题 */}
            <div className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-yellow-100 via-orange-100 to-pink-100 rounded-lg border border-yellow-200">
              <span className="text-lg">{CURRENCY_FLAGS[fromCurrency]}</span>
              <span className="font-semibold text-gray-800">{fromCurrency}</span>
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="text-lg">{CURRENCY_FLAGS[toCurrency]}</span>
              <span className="font-semibold text-gray-800">{toCurrency}</span>
              <span className="ml-auto text-sm text-gray-600 bg-white px-3 py-1 rounded-full">
                {groupRecords.length} 条记录
              </span>
            </div>
            
            {/* 该货币对的记录列表 */}
            <div className="space-y-2 pl-4">
              {groupRecords.map((record) => (
                <div
                  key={record.id}
                  className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200 hover:border-yellow-300 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-medium text-gray-800">
                          {record.fromAmount.toLocaleString()} {record.fromCurrency}
                        </span>
                        <span className="text-gray-400">→</span>
                        <span className="font-medium text-blue-600">
                          {record.toAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {record.toCurrency}
                        </span>
                      </div>
                      <div className="text-xs text-gray-500">
                        汇率：1 {record.fromCurrency} = {record.rate.toFixed(4)} {record.toCurrency}
                      </div>
                      <div className="text-xs text-gray-400 mt-1">
                        收藏时间：{formatDate(record.timestamp)}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onToggleFavorite(record.id)}
                        className="p-2 rounded-lg text-yellow-500 bg-gradient-to-br from-yellow-100 to-orange-100 hover:from-yellow-200 hover:to-orange-200 transition-all duration-300 shadow-md hover:shadow-lg transform hover:scale-110"
                        aria-label="取消收藏"
                      >
                        <Star className="w-5 h-5 fill-current" />
                      </button>
                      <button
                        onClick={() => onDelete(record.id)}
                        className="p-2 text-gray-400 hover:text-red-500 hover:bg-gradient-to-br hover:from-red-50 hover:to-pink-50 rounded-lg transition-all duration-300 transform hover:scale-110"
                        aria-label="删除"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}