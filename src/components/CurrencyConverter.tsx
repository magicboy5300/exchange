import { useState, useEffect } from 'react';
import { ArrowRightLeft } from 'lucide-react';
import type { ConversionRecord } from '../App';

const CURRENCY_NAMES: Record<string, string> = {
  'USD': '美元',
  'CNY': '人民币',
  'EUR': '欧元',
  'GBP': '英镑',
  'JPY': '日元',
  'HKD': '港币',
  'KRW': '韩元',
  'SGD': '新加坡元',
  'AUD': '澳元',
  'CAD': '加元',
};

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
  onConvert: (record: ConversionRecord) => void;
}

export function CurrencyConverter({ onConvert }: Props) {
  const [rates, setRates] = useState<Record<string, number>>({});
  const [fromCurrency, setFromCurrency] = useState('CNY');
  const [toCurrency, setToCurrency] = useState('USD');
  const [fromAmount, setFromAmount] = useState('100');
  const [toAmount, setToAmount] = useState('');

  useEffect(() => {
    fetch('/api/rates')
      .then(res => res.json())
      .then(data => {
        setRates(data);
        // Initial calculation if needed
      })
      .catch(err => console.error("Failed to fetch rates:", err));
  }, []);

  const calculateConversion = (amount: string, from: string, to: string): number => {
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || !rates[from] || !rates[to]) return 0;

    // 先转换为USD，再转换为目标货币
    const inUSD = numAmount / rates[from];
    const result = inUSD * rates[to];
    return result;
  };

  const handleConvert = () => {
    if (!fromAmount || parseFloat(fromAmount) <= 0 || !rates[fromCurrency] || !rates[toCurrency]) {
      return;
    }

    const result = calculateConversion(fromAmount, fromCurrency, toCurrency);
    setToAmount(result.toFixed(2));

    // 创建换算记录
    const record: ConversionRecord = {
      id: Date.now().toString(),
      fromCurrency,
      toCurrency,
      fromAmount: parseFloat(fromAmount),
      toAmount: result,
      rate: rates[toCurrency] / rates[fromCurrency],
      timestamp: Date.now(),
      isFavorite: false,
    };

    onConvert(record);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
  };

  const handleFromAmountChange = (value: string) => {
    // 只允许数字和小数点
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setFromAmount(value);
      if (value && parseFloat(value) > 0) {
        const result = calculateConversion(value, fromCurrency, toCurrency);
        setToAmount(result.toFixed(2));
      } else {
        setToAmount('');
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">货币换算</h2>

      {/* 输入货币 */}
      <div className="mb-3">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          转换金额
        </label>
        <div className="relative flex items-center border-2 border-gray-300 rounded-xl overflow-hidden focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-200 transition-all">
          <input
            type="text"
            value={fromAmount}
            onChange={(e) => handleFromAmountChange(e.target.value)}
            placeholder="请输入金额"
            className="flex-1 px-4 py-3 outline-none text-lg bg-transparent"
          />
          <div className="w-px h-8 bg-gray-300"></div>
          <select
            value={fromCurrency}
            onChange={(e) => setFromCurrency(e.target.value)}
            className="px-4 py-3 pr-10 outline-none bg-transparent cursor-pointer text-sm font-medium appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center'
            }}
          >
            {Object.entries(CURRENCY_NAMES).map(([code, name]) => (
              <option key={code} value={code}>
                {CURRENCY_FLAGS[code]} {code} - {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 交换按钮 */}
      <div className="flex justify-center my-3">
        <button
          onClick={handleSwapCurrencies}
          className="p-4 rounded-full bg-gradient-to-br from-cyan-400 via-blue-500 to-blue-600 text-white hover:from-cyan-300 hover:via-blue-400 hover:to-blue-500 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-110 active:scale-95 relative overflow-hidden group"
          aria-label="交换货币"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"></div>
          <ArrowRightLeft className="w-6 h-6 relative z-10" />
        </button>
      </div>

      {/* 输出货币 */}
      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          换算结果
        </label>
        <div className="relative flex items-center border-2 border-gray-300 rounded-xl overflow-hidden bg-gradient-to-r from-gray-50 to-blue-50">
          <input
            type="text"
            value={toAmount}
            readOnly
            placeholder="换算结果"
            className="flex-1 px-4 py-3 outline-none text-lg font-medium text-gray-800 bg-transparent"
          />
          <div className="w-px h-8 bg-gray-300"></div>
          <select
            value={toCurrency}
            onChange={(e) => setToCurrency(e.target.value)}
            className="px-4 py-3 pr-10 outline-none bg-transparent cursor-pointer text-sm font-medium appearance-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%23666' d='M6 9L1 4h10z'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 0.75rem center'
            }}
          >
            {Object.entries(CURRENCY_NAMES).map(([code, name]) => (
              <option key={code} value={code}>
                {CURRENCY_FLAGS[code]} {code} - {name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 转换按钮 */}
      <button
        onClick={handleConvert}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white rounded-xl font-medium text-lg shadow-lg hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        <span className="relative z-10 flex items-center justify-center gap-2">
          <span>立即换算</span>
          <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </span>
      </button>

      {/* 汇率信息 */}
      {fromAmount && toAmount && rates[fromCurrency] && rates[toCurrency] && (
        <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
          <p className="text-sm text-gray-600 text-center">
            当前汇率：1 {fromCurrency} = {(rates[toCurrency] / rates[fromCurrency]).toFixed(4)} {toCurrency}
          </p>
        </div>
      )}
    </div>
  );
}