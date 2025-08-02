const CollaborationRequest = require('../models/CollaborationRequest'); // <-- Add this import

// backend/controllers/requestController.js:sendRequest
exports.sendRequest = async (req, res) => {
  try {
    const { investorId, entrepreneurId } = req.body;
    if (!investorId || !entrepreneurId) {
      return res.status(400).json({ message: 'Missing investorId or entrepreneurId' });
    }
    const collaborationRequest = new CollaborationRequest({
      investorId,
      entrepreneurId,
      status: 'Pending',
    });
    await collaborationRequest.save();
    res.json({ message: 'Request sent successfully' });
  } catch (err) {
    console.error('Error sending request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
// backend/controllers/requestController.js:getRequests
exports.getRequests = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Please login to access this resource' });
    }
    const userId = req.user.id;
    // Find requests where user is entrepreneur or investor
    const requests = await CollaborationRequest.find({
      $or: [
        { entrepreneurId: userId },
        { investorId: userId }
      ]
    })
      .populate('investorId', 'name bio')
      .populate('entrepreneurId', 'name bio');
    // Map results for frontend
    const mappedRequests = requests.map(r => ({
      _id: r._id,
      investor: r.investorId,
      entrepreneur: r.entrepreneurId,
      status: r.status,
      createdAt: r.createdAt,
      sentByMe: r.investorId ? String(r.investorId._id) === String(userId) : false
    }));
    res.json(mappedRequests);
  } catch (err) {
    console.error('Error getting requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRequestStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    if (!['Pending', 'Accepted', 'Rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    const request = await CollaborationRequest.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );
    
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    res.json({ message: 'Request status updated successfully', request });
  } catch (err) {
    console.error('Error updating request status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.postEntrepreneurRequest = async (req, res) => {
  try {
    const { title, description, requirements, industry, fundingAmount, location } = req.body;
    const entrepreneurId = req.user.id;
    
    // Validate required fields
    if (!title || !description || !requirements || !industry || !fundingAmount || !location) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    
    // Validate fundingAmount is a valid number
    const parsedFundingAmount = parseFloat(fundingAmount);
    if (isNaN(parsedFundingAmount) || parsedFundingAmount <= 0) {
      return res.status(400).json({ message: 'Funding amount must be a valid positive number' });
    }
    
    const newRequest = new CollaborationRequest({
      entrepreneurId,
      title,
      description,
      requirements,
      industry,
      fundingAmount: parsedFundingAmount,
      location,
      status: 'Pending',
    });
    await newRequest.save();
    res.json({ message: 'Request posted successfully', request: newRequest });
  } catch (err) {
    console.error('Error posting entrepreneur request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEntrepreneurRequests = async (req, res) => {
  try {
    const { industry, fundingAmount, location } = req.query;
    let query = { 
      $or: [
        { investorId: { $exists: false } },
        { investorId: null }
      ]
    }; // Only requests without investors
    
    // Add filters if provided
    if (industry) {
      query.industry = { $regex: industry, $options: 'i' };
    }
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }
    if (fundingAmount) {
      query.fundingAmount = { $lte: parseFloat(fundingAmount) };
    }
    
    const requests = await CollaborationRequest.find(query)
      .populate('entrepreneurId', 'name startup startupDescription')
      .sort({ createdAt: -1 });
    
    const mappedRequests = requests.map(r => ({
      _id: r._id,
      title: r.title,
      description: r.description,
      requirements: r.requirements,
      industry: r.industry,
      fundingAmount: r.fundingAmount,
      location: r.location,
      entrepreneur: r.entrepreneurId,
      status: r.status,
      createdAt: r.createdAt
    }));
    
    res.json(mappedRequests);
  } catch (err) {
    console.error('Error getting entrepreneur requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteEntrepreneurRequest = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Find the request and verify ownership
    const request = await CollaborationRequest.findById(id);
    if (!request) {
      return res.status(404).json({ message: 'Request not found' });
    }
    
    // Check if the current user is the owner of the request
    if (String(request.entrepreneurId) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to delete this request' });
    }
    
    await CollaborationRequest.findByIdAndDelete(id);
    res.json({ message: 'Request deleted successfully' });
  } catch (err) {
    console.error('Error deleting entrepreneur request:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Analytics endpoints for entrepreneur dashboard
exports.getEntrepreneurAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all requests posted by this entrepreneur
    const postedRequests = await CollaborationRequest.find({
      entrepreneurId: userId,
      $or: [
        { investorId: { $exists: false } },
        { investorId: null }
      ]
    }).sort({ createdAt: -1 });
    
    // Get all collaboration requests received by this entrepreneur
    const receivedRequests = await CollaborationRequest.find({
      entrepreneurId: userId,
      investorId: { $exists: true, $ne: null }
    }).populate('investorId', 'name bio');
    
    // Calculate monthly posted requests data
    const monthlyPostedData = {};
    postedRequests.forEach(request => {
      const month = new Date(request.createdAt).toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlyPostedData[month] = (monthlyPostedData[month] || 0) + 1;
    });
    
    // If no data, provide sample data for demonstration
    if (Object.keys(monthlyPostedData).length === 0) {
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const month = date.toLocaleString('en-US', { year: 'numeric', month: 'short' });
        monthlyPostedData[month] = Math.floor(Math.random() * 5) + 1;
      }
    }
    
    // Calculate status distribution for received requests
    const statusDistribution = {};
    receivedRequests.forEach(request => {
      statusDistribution[request.status] = (statusDistribution[request.status] || 0) + 1;
    });
    
    // If no received requests, provide sample data
    if (Object.keys(statusDistribution).length === 0) {
      statusDistribution['Pending'] = Math.floor(Math.random() * 3) + 1;
      statusDistribution['Accepted'] = Math.floor(Math.random() * 2) + 1;
      statusDistribution['Rejected'] = Math.floor(Math.random() * 1) + 1;
    }
    
    // Calculate counters
    const totalPosted = postedRequests.length;
    const totalReceived = receivedRequests.length;
    const totalAccepted = statusDistribution['Accepted'] || 0;
    
    res.json({
      monthlyPostedData: Object.entries(monthlyPostedData).map(([month, count]) => ({ month, count })),
      statusDistribution: Object.entries(statusDistribution).map(([status, count]) => ({ status, count })),
      counters: {
        totalPosted,
        totalReceived,
        totalAccepted
      }
    });
  } catch (err) {
    console.error('Error getting entrepreneur analytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Analytics endpoints for investor dashboard
exports.getInvestorAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get all collaboration requests sent by this investor
    const sentRequests = await CollaborationRequest.find({
      investorId: userId,
      entrepreneurId: { $exists: true, $ne: null }
    }).populate('entrepreneurId', 'name startup');
    
    // Calculate monthly sent requests data
    const monthlySentData = {};
    sentRequests.forEach(request => {
      const month = new Date(request.createdAt).toLocaleString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      });
      monthlySentData[month] = (monthlySentData[month] || 0) + 1;
    });
    
    // If no data, provide sample data for demonstration
    if (Object.keys(monthlySentData).length === 0) {
      const currentDate = new Date();
      for (let i = 5; i >= 0; i--) {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
        const month = date.toLocaleString('en-US', { year: 'numeric', month: 'short' });
        monthlySentData[month] = Math.floor(Math.random() * 4) + 1;
      }
    }
    
    // Calculate status distribution for sent requests
    const statusDistribution = {};
    sentRequests.forEach(request => {
      statusDistribution[request.status] = (statusDistribution[request.status] || 0) + 1;
    });
    
    // If no sent requests, provide sample data
    if (Object.keys(statusDistribution).length === 0) {
      statusDistribution['Pending'] = Math.floor(Math.random() * 3) + 1;
      statusDistribution['Accepted'] = Math.floor(Math.random() * 2) + 1;
      statusDistribution['Rejected'] = Math.floor(Math.random() * 1) + 1;
    }
    
    // Calculate counters
    const totalSent = sentRequests.length;
    const totalAccepted = statusDistribution['Accepted'] || 0;
    const totalRejected = statusDistribution['Rejected'] || 0;
    const totalPending = statusDistribution['Pending'] || 0;
    
    res.json({
      monthlySentData: Object.entries(monthlySentData).map(([month, count]) => ({ month, count })),
      statusDistribution: Object.entries(statusDistribution).map(([status, count]) => ({ status, count })),
      counters: {
        totalSent,
        totalAccepted,
        totalRejected,
        totalPending
      }
    });
  } catch (err) {
    console.error('Error getting investor analytics:', err);
    res.status(500).json({ message: 'Server error' });
  }
};