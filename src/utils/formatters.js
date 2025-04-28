// Format date to readable string
export const formatDate = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  // Format time to readable string
  export const formatTime = (date) => {
    if (!date) return '';
    
    return new Date(date).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Format date and time
  export const formatDateTime = (date) => {
    if (!date) return '';
    
    return `${formatDate(date)} at ${formatTime(date)}`;
  };
  
  // Format currency to Indian Rupees
  export const formatCurrency = (amount) => {
    if (amount === undefined || amount === null) return '₹0';
    
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(amount);
  };
  
  // Format percentage
  export const formatPercentage = (value) => {
    if (value === undefined || value === null) return '0%';
    
    return `${value.toFixed(2)}%`;
  };
  
  // Format transaction status with proper capitalization
  export const formatStatus = (status) => {
    if (!status) return '';
    
    return status.charAt(0).toUpperCase() + status.slice(1);
  };
  
  // Truncate text with ellipsis
  export const truncateText = (text, maxLength = 50) => {
    if (!text) return '';
    
    if (text.length <= maxLength) return text;
    
    return text.slice(0, maxLength) + '...';
  };
  