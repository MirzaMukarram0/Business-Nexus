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

exports.updateProfile = (req, res) => {
  res.json({ message: 'updateProfile placeholder' });
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