import Customer from '../models/Customer.js';

// @desc    Get all customers
// @route   GET /api/customers
// @access  Private
export const getCustomers = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin';
    // Admin sees all customers, agents see only their own
    const query = isAdmin ? {} : { user: req.user._id };
    
    const customers = await Customer.find(query)
      .populate('user', 'name email') // Populate user details
      .sort({ createdAt: -1 });
    res.json(customers);
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single customer
// @route   GET /api/customers/:id
// @access  Private
export const getCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id).populate('user', 'name email');

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if user owns the customer or is admin
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && customer.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(customer);
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new customer
// @route   POST /api/customers
// @access  Private
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, address, notes } = req.body;

    // Validation
    if (!name || !email || !phone) {
      return res.status(400).json({ message: 'Please provide name, email, and phone' });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company: company || '',
      address: address || '',
      notes: notes || '',
      user: req.user._id,
    });

    res.status(201).json(customer);
  } catch (error) {
    console.error('Create customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update customer
// @route   PUT /api/customers/:id
// @access  Private
export const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if user owns the customer or is admin
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && customer.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    const updatedCustomer = await Customer.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('user', 'name email');

    res.json(updatedCustomer);
  } catch (error) {
    console.error('Update customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete customer
// @route   DELETE /api/customers/:id
// @access  Private
export const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findById(req.params.id);

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Check if user owns the customer or is admin
    const isAdmin = req.user.role === 'admin';
    if (!isAdmin && customer.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Customer.findByIdAndDelete(req.params.id);

    res.json({ message: 'Customer deleted successfully' });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
