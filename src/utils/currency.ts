export type CurrencyCode =
  | 'USD'
  | 'EUR'
  | 'GBP'
  | 'INR'
  | 'JPY'
  | 'AUD'
  | 'CAD'
  | 'AED'
  | 'SGD'
  | 'CHF';

export interface CurrencyInfo {
  code: CurrencyCode;
  name: string;
  symbol: string;
  flag: string;
  rateAgainstUSD: number; // 1 USD = rateAgainstUSD in this currency
  sliderMin: number;
  sliderMax: number;
  sliderStep: number;
  dailyRanges: {
    budget: string;
    midRange: string;
    premium: string;
    luxury: string;
  };
}

export const CURRENCIES: CurrencyInfo[] = [
  {
    code: 'USD',
    name: 'US Dollar',
    symbol: '$',
    flag: '🇺🇸',
    rateAgainstUSD: 1.0,
    sliderMin: 150,
    sliderMax: 20000,
    sliderStep: 50,
    dailyRanges: {
      budget: '$35 – $75',
      midRange: '$120 – $280',
      premium: '$320 – $700',
      luxury: '$700+'
    }
  },
  {
    code: 'INR',
    name: 'Indian Rupee',
    symbol: '₹',
    flag: '🇮🇳',
    rateAgainstUSD: 83.5,
    sliderMin: 8000,
    sliderMax: 1500000,
    sliderStep: 1000,
    dailyRanges: {
      budget: '₹2,500 – ₹5,500',
      midRange: '₹9,000 – ₹22,000',
      premium: '₹25,000 – ₹55,000',
      luxury: '₹55,000+'
    }
  },
  {
    code: 'EUR',
    name: 'Euro',
    symbol: '€',
    flag: '🇪🇺',
    rateAgainstUSD: 0.92,
    sliderMin: 140,
    sliderMax: 18000,
    sliderStep: 50,
    dailyRanges: {
      budget: '€30 – €68',
      midRange: '€110 – €260',
      premium: '€290 – €640',
      luxury: '€640+'
    }
  },
  {
    code: 'GBP',
    name: 'British Pound',
    symbol: '£',
    flag: '🇬🇧',
    rateAgainstUSD: 0.79,
    sliderMin: 120,
    sliderMax: 16000,
    sliderStep: 50,
    dailyRanges: {
      budget: '£25 – £58',
      midRange: '£95 – £220',
      premium: '£250 – £550',
      luxury: '£550+'
    }
  },
  {
    code: 'JPY',
    name: 'Japanese Yen',
    symbol: '¥',
    flag: '🇯🇵',
    rateAgainstUSD: 155.0,
    sliderMin: 20000,
    sliderMax: 3000000,
    sliderStep: 5000,
    dailyRanges: {
      budget: '¥5,000 – ¥11,000',
      midRange: '¥18,000 – ¥42,000',
      premium: '¥48,000 – ¥105,000',
      luxury: '¥105,000+'
    }
  },
  {
    code: 'AUD',
    name: 'Australian Dollar',
    symbol: 'A$',
    flag: '🇦🇺',
    rateAgainstUSD: 1.52,
    sliderMin: 220,
    sliderMax: 30000,
    sliderStep: 100,
    dailyRanges: {
      budget: 'A$50 – A$110',
      midRange: 'A$180 – A$420',
      premium: 'A$480 – A$1,050',
      luxury: 'A$1,050+'
    }
  },
  {
    code: 'CAD',
    name: 'Canadian Dollar',
    symbol: 'CA$',
    flag: '🇨🇦',
    rateAgainstUSD: 1.36,
    sliderMin: 200,
    sliderMax: 27000,
    sliderStep: 100,
    dailyRanges: {
      budget: 'CA$45 – CA$100',
      midRange: 'CA$160 – CA$380',
      premium: 'CA$430 – CA$950',
      luxury: 'CA$950+'
    }
  },
  {
    code: 'AED',
    name: 'UAE Dirham',
    symbol: 'AED ',
    flag: '🇦🇪',
    rateAgainstUSD: 3.67,
    sliderMin: 550,
    sliderMax: 75000,
    sliderStep: 250,
    dailyRanges: {
      budget: 'AED 130 – AED 275',
      midRange: 'AED 440 – AED 1,000',
      premium: 'AED 1,150 – AED 2,500',
      luxury: 'AED 2,500+'
    }
  },
  {
    code: 'SGD',
    name: 'Singapore Dollar',
    symbol: 'S$',
    flag: '🇸🇬',
    rateAgainstUSD: 1.35,
    sliderMin: 200,
    sliderMax: 27000,
    sliderStep: 100,
    dailyRanges: {
      budget: 'S$45 – S$100',
      midRange: 'S$160 – CA$380',
      premium: 'S$430 – S$950',
      luxury: 'S$950+'
    }
  },
  {
    code: 'CHF',
    name: 'Swiss Franc',
    symbol: 'CHF ',
    flag: '🇨🇭',
    rateAgainstUSD: 0.90,
    sliderMin: 140,
    sliderMax: 18000,
    sliderStep: 50,
    dailyRanges: {
      budget: 'CHF 32 – CHF 68',
      midRange: 'CHF 110 – CHF 250',
      premium: 'CHF 290 – CHF 630',
      luxury: 'CHF 630+'
    }
  }
];

export function getCurrencyConfig(code?: string): CurrencyInfo {
  if (!code) return CURRENCIES[0];
  const found = CURRENCIES.find(c => c.code.toUpperCase() === code.toUpperCase());
  return found || CURRENCIES[0];
}

export function convertUSDToCurrency(amountInUSD: number, targetCurrency: string = 'USD'): number {
  const config = getCurrencyConfig(targetCurrency);
  return Math.round(amountInUSD * config.rateAgainstUSD);
}

export function convertCurrencyToUSD(amountInCurrency: number, sourceCurrency: string = 'USD'): number {
  const config = getCurrencyConfig(sourceCurrency);
  return Math.round(amountInCurrency / config.rateAgainstUSD);
}

export function formatCurrency(amountInUSD: number, currencyCode: string = 'USD'): string {
  const config = getCurrencyConfig(currencyCode);
  const converted = Math.round(amountInUSD * config.rateAgainstUSD);
  return `${config.symbol}${converted.toLocaleString()}`;
}

export function formatRawAmount(amount: number, currencyCode: string = 'USD'): string {
  const config = getCurrencyConfig(currencyCode);
  return `${config.symbol}${Math.round(amount).toLocaleString()}`;
}
