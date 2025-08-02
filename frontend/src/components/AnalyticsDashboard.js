import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { getEntrepreneurAnalytics } from '../services/api';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await getEntrepreneurAnalytics();
      setAnalyticsData(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-loading">
        <div className="loading-spinner"></div>
        <p>Loading analytics...</p>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="analytics-error">
        <p>Failed to load analytics data</p>
      </div>
    );
  }

  return (
    <div className="analytics-dashboard">
      {/* Charts Container */}
      <div className="analytics-charts-container">
        <div className="analytics-chart-section">
          <div className="analytics-chart-left">
            <h3 className="analytics-chart-title">Requests Posted Over Time</h3>
            <div className="analytics-chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={analyticsData.monthlyPostedData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2f4c" />
                  <XAxis 
                    dataKey="month" 
                    stroke="#7f9cf5"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#7f9cf5"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#232946',
                      border: '1px solid #7f9cf5',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="count" 
                    stroke="#fc5356" 
                    strokeWidth={3}
                    dot={{ fill: '#fc5356', strokeWidth: 2, r: 4 }}
                    activeDot={{ r: 6, stroke: '#fc5356', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="analytics-chart-right">
            <h3 className="analytics-chart-title">Collaboration Request Status</h3>
            <div className="analytics-chart-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={analyticsData.statusDistribution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#2a2f4c" />
                  <XAxis 
                    dataKey="status" 
                    stroke="#7f9cf5"
                    fontSize={12}
                  />
                  <YAxis 
                    stroke="#7f9cf5"
                    fontSize={12}
                  />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: '#232946',
                      border: '1px solid #7f9cf5',
                      borderRadius: '8px',
                      color: '#fff'
                    }}
                  />
                  <Bar 
                    dataKey="count" 
                    fill="#7f9cf5"
                    radius={[4, 4, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Counters Container */}
      <div className="analytics-counters-container">
        <div className="counter">
          <div className="row">
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
                <h6 className="count h2" data-to={analyticsData.counters.totalPosted} data-speed="500">
                  {analyticsData.counters.totalPosted}
                </h6>
                <p className="m-0px font-w-600">Total Requests Posted</p>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
                <h6 className="count h2" data-to={analyticsData.counters.totalReceived} data-speed="150">
                  {analyticsData.counters.totalReceived}
                </h6>
                <p className="m-0px font-w-600">Collaborations Received</p>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
                <h6 className="count h2" data-to={analyticsData.counters.totalAccepted} data-speed="850">
                  {analyticsData.counters.totalAccepted}
                </h6>
                <p className="m-0px font-w-600">Collaborations Accepted</p>
              </div>
            </div>
            <div className="col-6 col-lg-3">
              <div className="count-data text-center">
                <h6 className="count h2" data-to={analyticsData.counters.totalReceived > 0 ? Math.round((analyticsData.counters.totalAccepted / analyticsData.counters.totalReceived) * 100) : 0} data-speed="190">
                  {analyticsData.counters.totalReceived > 0 ? Math.round((analyticsData.counters.totalAccepted / analyticsData.counters.totalReceived) * 100) : 0}%
                </h6>
                <p className="m-0px font-w-600">Acceptance Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard; 