import { POWER_DIVISIBILITY } from '../constants/config';
import type { ChartPeriod, Transaction } from '../reducers/types';

export const generateChartData = (
  transactions: Transaction[],
  currentBalance: number,
  period: ChartPeriod
) => {
  const trs = transactions
    .filter(t => t.status !== 'rejected')
    .sort((a, b) => a.timestamp > b.timestamp)
    .reverse();
  let data = [];
  let balance = currentBalance;
  let date = new Date();

  const firstTimePoint = getFirstTimePoint(new Date(), period);
  let tIndex = 0;
  while (date >= firstTimePoint) {
    while (new Date(tIndex < trs.length && trs[tIndex].timestamp) > date) {
      const t = trs[tIndex];

      balance +=
        t.amount * (t.type === 'Receive' ? -1 : 1) +
        (t.type === 'Send' ? t.fee || 0 : 0);

      tIndex += 1;
    }

    data.push({
      STG: balance,
      name: getDayName(date, period),
      tooltip: balance / POWER_DIVISIBILITY
    });

    date = getPreviousTimePoint(date, period);
  }

  data = data.reverse();
  return data;
};

const getDayName = (date: Date, period: ChartPeriod) => {
  switch (period) {
    case 'year':
      return date.toLocaleDateString('en-us', { month: 'short' }); // todo i18n?
    case 'month':
      return date.getDate();
    case 'week':
    default:
      return date.toLocaleDateString('en-us', { weekday: 'short' }); // todo i18n?
  }
};

const getPreviousTimePoint = (date: Date, period: ChartPeriod) => {
  switch (period) {
    case 'year':
      return new Date(date.setMonth(date.getMonth() - 1));
    case 'month':
      return new Date(date.setDate(date.getDate() - 4));
    case 'week':
    default:
      return new Date(date.setDate(date.getDate() - 1));
  }
};

const getFirstTimePoint = (date: Date, period: ChartPeriod) => {
  switch (period) {
    case 'year':
      return yearAgo(date);
    case 'month':
      return monthAgo(date);
    case 'week':
    default:
      return weekAgo(date);
  }
};

export const weekAgo = (date: Date) => date.setDate(date.getDate() - 7);
export const monthAgo = (date: Date) => date.setMonth(date.getMonth() - 1);
export const yearAgo = (date: Date) => date.setFullYear(date.getFullYear() - 1);
