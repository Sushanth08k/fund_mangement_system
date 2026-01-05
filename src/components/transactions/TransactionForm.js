import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { createTransaction } from '../../services/transactionService';
import { getStates, getDistricts, getSectors } from '../../services/analyticsService';
import { validateTransactionForm } from '../../utils/validators';
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
      
      // Create transaction
      const amount = parseFloat(formData.amount);
      if (isNaN(amount)) {
        setErrors({ amount: 'Please enter a valid amount' });
        return;
      }

      const result = await createTransaction({
        ...formData,
        amount,
        createdAt: new Date()
      });
      
      if (result) {
        // Only call onTransactionAdded if the transaction was created successfully
        onTransactionAdded();
        // Reset form data after successful creation
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
        setErrors({ general: 'Transaction Success' });
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
            placeholder="Enter amount"
          />
          {errors.amount && <div className="field-error">{errors.amount}</div>}
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
          {errors.stateId && <div className="field-error">{errors.stateId}</div>}
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
          {errors.districtId && <div className="field-error">{errors.districtId}</div>}
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
          {errors.sectorId && <div className="field-error">{errors.sectorId}</div>}
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
