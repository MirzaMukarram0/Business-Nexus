import React, { useState } from 'react';
import DashboardLayout from '../layouts/DashboardLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const PostRequest = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [industry, setIndustry] = useState('');
  const [fundingAmount, setFundingAmount] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Validate funding amount
    const parsedFundingAmount = parseFloat(fundingAmount);
    if (isNaN(parsedFundingAmount) || parsedFundingAmount <= 0) {
      setError('Please enter a valid funding amount');
      setLoading(false);
      return;
    }
    
    try {
      await api.post('/entrepreneur-requests', {
        title,
        description,
        requirements,
        industry,
        fundingAmount: parsedFundingAmount,
        location,
      });
      navigate('/dashboard/entrepreneur');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post request.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <div style={{ maxWidth: 500, margin: '0 auto' }}>
        <h2>Post a New Request</h2>
        <form onSubmit={handleSubmit}>
          <InputField
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title"
            required
          />
          <InputField
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Description"
            required
          />
          <InputField
            value={requirements}
            onChange={e => setRequirements(e.target.value)}
            placeholder="Requirements"
            required
          />
          <InputField
            value={industry}
            onChange={e => setIndustry(e.target.value)}
            placeholder="Industry (e.g., Technology, Healthcare, Finance)"
            required
          />
          <InputField
            value={fundingAmount}
            onChange={e => setFundingAmount(e.target.value)}
            placeholder="Funding Amount (USD)"
            type="number"
            required
          />
          <InputField
            value={location}
            onChange={e => setLocation(e.target.value)}
            placeholder="Location (e.g., New York, London, Singapore)"
            required
          />
          {error && <div style={{ color: 'red', marginBottom: 8 }}>{error}</div>}
          <Button className="bnx-btn-gradient bnx-btn-md" type="submit" disabled={loading}>
            {loading ? 'Posting...' : 'Post Request'}
          </Button>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default PostRequest;