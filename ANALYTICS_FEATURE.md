# Analytics Dashboard Feature

## Overview
The Analytics Dashboard is a new feature added to the Entrepreneur Dashboard that provides visual insights into the entrepreneur's activity and collaboration requests.

## Features

### 1. Charts Section
- **Line Chart**: Shows the number of requests posted over time (monthly data)
- **Bar Chart**: Visualizes the distribution of collaboration request statuses (Pending, Accepted, Rejected)

### 2. Counters Section
- **Total Requests Posted**: Dynamic count of all requests posted by the entrepreneur
- **Collaborations Received**: Dynamic count of all collaboration requests received
- **Collaborations Accepted**: Dynamic count of accepted collaborations
- **Acceptance Rate**: Calculated percentage of accepted vs total received requests

## Technical Implementation

### Backend
- **Endpoint**: `GET /api/entrepreneur-analytics`
- **Controller**: `requestController.getEntrepreneurAnalytics`
- **Authentication**: Required (JWT token)
- **Data**: Real-time calculation from database

### Frontend
- **Component**: `AnalyticsDashboard.js`
- **Library**: Recharts for chart visualization
- **Styling**: Consistent with existing theme
- **Responsive**: Mobile-friendly design

## Data Structure

### API Response
```json
{
  "monthlyPostedData": [
    { "month": "Jan 2024", "count": 3 },
    { "month": "Feb 2024", "count": 5 }
  ],
  "statusDistribution": [
    { "status": "Pending", "count": 2 },
    { "status": "Accepted", "count": 3 },
    { "status": "Rejected", "count": 1 }
  ],
  "counters": {
    "totalPosted": 8,
    "totalReceived": 6,
    "totalAccepted": 3
  }
}
```

## Styling
- Consistent with existing dark theme
- Uses existing color scheme (#7f9cf5, #fc5356, #232946)
- Responsive design for mobile devices
- Loading states and error handling

## Location
The analytics dashboard appears above the "Collaboration Requests" section on the main requests tab of the Entrepreneur Dashboard.

## Dependencies
- Recharts (already installed)
- No additional dependencies required 