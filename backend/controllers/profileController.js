const User = require('../models/User');

exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    
    // Check if user is updating their own profile
    if (String(id) !== String(userId)) {
      return res.status(403).json({ message: 'Not authorized to update this profile' });
    }
    
    const updateData = req.body;
    const allowedFields = ['name', 'bio', 'startup', 'startupDescription', 'fundingNeed', 'pitchDeck', 'investmentInterests', 'portfolio'];
    
    // Filter out non-allowed fields
    const filteredData = {};
    Object.keys(updateData).forEach(key => {
      if (allowedFields.includes(key)) {
        filteredData[key] = updateData[key];
      }
    });
    
    const updatedUser = await User.findByIdAndUpdate(
      id,
      filteredData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(updatedUser);
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getEntrepreneurs = async (req, res) => {
  try {
    const entrepreneurs = await User.find({ role: 'Entrepreneur' }).lean();
    res.json(entrepreneurs);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInvestors = async (req, res) => {
  try {
    const investors = await User.find({ role: 'Investor' }).lean();
    res.json(investors);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 