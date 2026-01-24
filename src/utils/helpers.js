const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
import { CSV_DELIMITER } from './constants';

export const generateId = (length = 8) => {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const array = new Uint32Array(length);
    window.crypto.getRandomValues(array);
    return Array.from(array, (value) => ALPHABET[value % ALPHABET.length]).join('');
  }

  let result = '';
  for (let i = 0; i < length; i += 1) {
    result += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
  }
  return result;
};

export const parseNumberInput = (value) => {
  const parsed = parseFloat(value);
  return Number.isFinite(parsed) ? parsed : null;
};

export const calculatePercentage = (value, total) => {
  if (!total) return 0;
  return (value / total) * 100;
};
export const groupBy = (items = [], keyGetter, missingKey = 'unknown') => {
  if (!Array.isArray(items)) return {};
  return items.reduce((acc, item) => {
    const rawKey = typeof keyGetter === 'function' ? keyGetter(item) : item[keyGetter];
    const key = rawKey || missingKey;
    if (!acc[key]) acc[key] = [];
    acc[key].push(item);
    return acc;
  }, {});
};

export const groupTransactionsByStatus = (transactions) =>
  groupBy(transactions, (t) => t.status, 'unknown');

export const groupTransactionsBySector = (transactions) =>
  groupBy(transactions, (t) => t.sectorName, 'unknown');

export const groupTransactionsByState = (transactions) =>
  groupBy(transactions, (t) => t.stateName, 'unknown');

export const getRandomColor = () => {
  // Prefer crypto-backed randomness when available for more uniform distribution
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const arr = new Uint8Array(3);
    window.crypto.getRandomValues(arr);
    return `#${Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('')}`;
  }

  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateChartColors = (count) => {
  const colors = [];
  if (!count || count <= 0) return colors;
  // Use golden angle to distribute hues for perceptual distinctness
  const GOLDEN_ANGLE = 137.508; // degrees
  const saturation = 70; // percent
  const lightness = 60; // percent
  for (let i = 0; i < count; i += 1) {
    const hue = (i * GOLDEN_ANGLE) % 360;
    colors.push(`hsla(${Math.round(hue)}, ${saturation}%, ${lightness}%, 0.85)`);
  }
  return colors;
};

export const downloadCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;
  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(CSV_DELIMITER)];

  for (const row of data) {
    const values = headers.map((header) => {
      const raw = row[header];
      if (raw === null || raw === undefined) return '';
      if (raw instanceof Date) {
        return `"${raw.toISOString()}"`;
      }
      if (typeof raw === 'object') {
        const s = JSON.stringify(raw);
        return `"${s.replace(/"/g, '""')}"`;
      }
      const str = String(raw);
      // Quote only when necessary (delimiter, quote or newline present)
      if (str.includes(CSV_DELIMITER) || str.includes('"') || /[\r\n]/.test(str)) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    });
    csvRows.push(values.join(CSV_DELIMITER));
  }

  const csvString = csvRows.join('\n');
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
};
  