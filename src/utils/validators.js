// Validate email format
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const isStrongPassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

// Validate amount (positive number)
export const isValidAmount = (amount) => {
  const numAmount = parseFloat(amount);
  return Number.isFinite(numAmount) && numAmount > 0;
};

export const isRequired = (value) => {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') {
    return value.trim() !== '';
  }
  return true;
};

// Validate form data for transaction
export const validateTransactionForm = (formData) => {
  const errors = {};
  
  // Validate amount
  if (!isRequired(formData.amount)) {
    errors.amount = 'Amount is required';
  } else if (!isValidAmount(formData.amount)) {
    errors.amount = 'Amount must be a positive number';
  }
  
  // Validate required fields
  if (!isRequired(formData.stateId)) {
    errors.stateId = 'State is required';
  }
  
  if (!isRequired(formData.sectorId)) {
    errors.sectorId = 'Sector is required';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
