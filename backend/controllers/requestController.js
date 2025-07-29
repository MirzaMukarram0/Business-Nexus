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
      sentByMe: String(r.investorId._id) === String(userId)
    }));
    res.json(mappedRequests);
  } catch (err) {
    console.error('Error getting requests:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRequestStatus = (req, res) => {
  res.json({ message: 'updateRequestStatus placeholder' });
};