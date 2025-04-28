// Generate random ID
export const generateId = (length = 8) => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };
  
  // Calculate percentage
  export const calculatePercentage = (value, total) => {
    if (!total) return 0;
    return (value / total) * 100;
  };
  
  // Group transactions by status
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
  
  // Group transactions by sector
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
  
  // Group transactions by state
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
  
  // Get random color for charts
  export const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  
  // Generate colors for chart datasets
  export const generateChartColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const hue = (i * 137) % 360; // Golden angle approximation for good distribution
      colors.push(`hsla(${hue}, 70%, 60%, 0.8)`);
    }
    return colors;
  };
  
  // Download data as CSV
  export const downloadCSV = (data, filename = 'export.csv') => {
    if (!data || !data.length) return;
    
    // Get headers from first item
    const headers = Object.keys(data[0]);
    
    // Convert data to CSV format
    const csvRows = [];
    csvRows.push(headers.join(','));
    
    for (const row of data) {
      const values = headers.map(header => {
        const value = row[header];
        // Handle special cases (dates, objects, etc.)
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
    
    // Create and download the file
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
  