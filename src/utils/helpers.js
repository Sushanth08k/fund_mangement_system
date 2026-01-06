const ALPHABET = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

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

export const groupTransactionsByStatus = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const status = transaction.status || 'unknown';
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(transaction);
    return acc;
  }, {});
};

export const groupTransactionsBySector = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const sector = transaction.sectorName || 'unknown';
    if (!acc[sector]) {
      acc[sector] = [];
    }
    acc[sector].push(transaction);
    return acc;
  }, {});
};

export const groupTransactionsByState = (transactions) => {
  return transactions.reduce((acc, transaction) => {
    const state = transaction.stateName || 'unknown';
    if (!acc[state]) {
      acc[state] = [];
    }
    acc[state].push(transaction);
    return acc;
  }, {});
};

export const getRandomColor = () => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i += 1) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

export const generateChartColors = (count) => {
  const colors = [];
  for (let i = 0; i < count; i += 1) {
    const hue = (i * 137.5) % 360;
    colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
  }
  return colors;
};

export const downloadCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return;

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  for (const row of data) {
    const values = headers.map((header) => {
      const value = row[header];
      if (value instanceof Date) {
        return `"${value.toISOString()}"`;
      }
      if (typeof value === 'object' && value !== null) {
        return `"${JSON.stringify(value).replace(/"/g, '""')}"`;
      }
      return `"${value}"`;
    });
    csvRows.push(values.join(','));
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
  