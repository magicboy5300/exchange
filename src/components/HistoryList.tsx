import { Star, Trash2, TrendingUp } from 'lucide-react';
import type { ConversionRecord } from '../App';

interface Props {
  records: ConversionRecord[];
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
}

export function HistoryList({ records, onToggleFavorite, onDelete }: Props) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return '刚刚';
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}分钟前`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}小时前`;
    } else if (diffInSeconds < 604800) {
      return `${Math.floor(diffInSeconds / 86400)}天前`;
    } else {
      return date.toLocaleDateString('zh-CN', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  };

  if (records.length === 0) {
    return (
      <div className="text-center py-12">
        <TrendingUp className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500">暂无换算历史</p>
        <p className="text-sm text-gray-400 mt-2">进行货币换算后，记录会显示在这里</p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {records.map((record) => (
        <div
          key={record.id}
          className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors"
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
                {formatDate(record.timestamp)}
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(record.id)}
                className={`p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${
                  record.isFavorite
                    ? 'text-yellow-500 bg-gradient-to-br from-yellow-100 to-orange-100 shadow-md'
                    : 'text-gray-400 hover:text-yellow-500 hover:bg-gradient-to-br hover:from-yellow-50 hover:to-orange-50'
                }`}
                aria-label={record.isFavorite ? '取消收藏' : '收藏'}
              >
                <Star className={`w-5 h-5 ${record.isFavorite ? 'fill-current' : ''}`} />
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
  );
}