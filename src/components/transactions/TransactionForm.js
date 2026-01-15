import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createTransaction } from '../../services/transactionService';
import { getStates, getDistricts, getSectors } from '../../services/analyticsService';
import { validateTransactionForm } from '../../utils/validators';
import { parseNumberInput } from '../../utils/helpers';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function TransactionForm({ onTransactionAdded }) {
  const [formData, setFormData] = useState({
    amount: '',
    description: '',
    stateId: '',
    districtId: '',
    sectorId: '',
    beneficiaryName: ''
  });
  const [states, setStates] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [sectors, setSectors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAdmin) {
      navigate('/transactions');
      return;
    }

    let isMounted = true;

    async function fetchFormData() {
      try {
        const statesData = await getStates();
        const sectorsData = await getSectors();
        if (!isMounted) return;

        setStates(statesData);
        setSectors(sectorsData);
      } catch (error) {
        console.error('Error fetching form data:', error);
        setErrors({ general: 'Failed to load form data. Please try again.' });
      }
    }

    fetchFormData();

    return () => {
      isMounted = false;
    };
  }, [isAdmin, navigate]);

  useEffect(() => {
    let isMounted = true;

    async function fetchDistricts() {
      if (formData.stateId) {
        try {
          const districtsData = await getDistricts(formData.stateId);
          if (isMounted) {
            setDistricts(districtsData);
            setErrors((prev) => ({ ...prev, districtId: '' }));
          }
        } catch (error) {
          console.error('Error fetching districts:', error);
          if (isMounted) {
            setErrors((prev) => ({
              ...prev,
              districtId: 'Failed to load districts. Please try again.'
            }));
          }
        }
      } else {
        setDistricts([]);
      }
    }

    fetchDistricts();
    return () => {
      isMounted = false;
    };
  }, [formData.stateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for amount to ensure it's a valid number
    if (name === 'amount') {
      if (value === '' || /^\d*\.?\d*$/.test(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAdmin) {
      setErrors({ general: 'You do not have permission to create transactions.' });
      return;
    }

    try {
      setLoading(true);
      setErrors({});

      // Validate form data
      const validation = validateTransactionForm(formData);
      if (!validation.isValid) {
        setErrors(validation.errors);
        return;
      }
      
      // Create transaction (use parseNumberInput for consistent parsing)
      const amount = parseNumberInput(formData.amount);
      if (amount === null) {
        setErrors({ amount: 'Please enter a valid amount' });
        return;
      }

      const payload = {
        ...formData,
        amount,
        description: formData.description.trim(),
        beneficiaryName: formData.beneficiaryName.trim(),
        createdAt: new Date()
      };

      const result = await createTransaction(payload);
      if (result) {
        onTransactionAdded();
        setFormData({
          amount: '',
          description: '',
          stateId: '',
          districtId: '',
          sectorId: '',
          beneficiaryName: ''
        });
      }
    } catch (error) {
      console.error('Error creating transaction:', error);
      if (error.message.includes('Access denied')) {
        setErrors({ general: 'Access denied. Admin privileges required.' });
      } else if (error.message.includes('not found')) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Failed to create transaction. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="transaction-form">
      <h3>Create New Transaction</h3>
      
      {errors.general && <div className="error-message">{errors.general}</div>}
      
      <form onSubmit={handleSubmit} noValidate>
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)*</label>
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            min="0"
            step="0.01"
            required
            aria-invalid={!!errors.amount}
            aria-describedby={errors.amount ? 'amount-error' : undefined}
            placeholder="Enter amount"
          />
          {errors.amount && <div id="amount-error" className="field-error">{errors.amount}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="stateId">State*</label>
          <select
            id="stateId"
            name="stateId"
            value={formData.stateId}
            onChange={handleChange}
            required
          >
            <option value="">Select State</option>
            {states.map(state => (
              <option key={state.id} value={state.id}>{state.name}</option>
            ))}
          </select>
          {errors.stateId && <div id="stateId-error" className="field-error">{errors.stateId}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="districtId">District</label>
          <select
            id="districtId"
            name="districtId"
            value={formData.districtId}
            onChange={handleChange}
            disabled={!formData.stateId}
          >
            <option value="">Select District</option>
            {districts.map(district => (
              <option key={district.id} value={district.id}>{district.name}</option>
            ))}
          </select>
          {errors.districtId && <div id="districtId-error" className="field-error">{errors.districtId}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="sectorId">Sector*</label>
          <select
            id="sectorId"
            name="sectorId"
            value={formData.sectorId}
            onChange={handleChange}
            required
          >
            <option value="">Select Sector</option>
            {sectors.map(sector => (
              <option key={sector.id} value={sector.id}>{sector.name}</option>
            ))}
          </select>
          {errors.sectorId && <div id="sectorId-error" className="field-error">{errors.sectorId}</div>}
        </div>
        
        <div className="form-group">
          <label htmlFor="beneficiaryName">Beneficiary Name</label>
          <input
            type="text"
            id="beneficiaryName"
            name="beneficiaryName"
            value={formData.beneficiaryName}
            onChange={handleChange}
            placeholder="Enter beneficiary name"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            placeholder="Enter transaction description"
          ></textarea>
        </div>
        
        <div className="form-actions">
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Transaction'}
          </button>
        </div>
      </form>
    </div>
  );
}

TransactionForm.propTypes = {
  onTransactionAdded: PropTypes.func.isRequired
};

export default TransactionForm;
