import Lead from '../models/Lead.js';

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
export const getLeads = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    // Admin sees all leads, agents see only their own
    const query = isAdmin ? {} : { user: req.user._id };
    
    const leads = await Lead.find(query)
      .populate('user', 'name email') // Populate user details
      .sort({ createdAt: -1 });
    res.json(leads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single lead
// @route   GET /api/leads/:id
// @access  Private
export const getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id).populate('user', 'name email');

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check if user owns the lead or is admin
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && lead.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(lead);
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new lead
// @route   POST /api/leads
// @access  Private
export const createLead = async (req, res) => {
  try {
    const { name, email, phone, source, status, notes, leadNotes } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Please provide name, email, and phone' });
    }

    const lead = await Lead.create({
      name,
      email,
      phone,
      source: source || '',
      status: status || 'New',
      notes: notes || '',
      leadNotes: leadNotes || [],
      user: req.user._id,
    });

    res.status(201).json(lead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update lead
// @route   PUT /api/leads/:id
// @access  Private
export const updateLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check if user owns the lead or is admin
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && lead.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedLead = await Lead.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json(updatedLead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete lead
// @route   DELETE /api/leads/:id
// @access  Private
export const deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);

    if (!lead) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // Check if user owns the lead or is admin
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && lead.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Lead.findByIdAndDelete(req.params.id);

    res.json({ message: 'Lead deleted successfully' });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
