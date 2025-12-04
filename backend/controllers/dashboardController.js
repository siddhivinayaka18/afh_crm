import Lead from '../models/Lead.js';
import Customer from '../models/Customer.js';

// @desc    Get dashboard statistics
// @route   GET /api/dashboard
// @access  Private
export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;
    const isAdmin = req.user.role === 'admin';

    // Build query filter - admin sees all data, agents see only their own
    const userFilter = isAdmin ? {} : { user: userId };

    // Get total leads
    const totalLeads = await Lead.countDocuments(userFilter);

    // Get total customers
    const totalCustomers = await Customer.countDocuments(userFilter);

    // Get converted leads
    const convertedLeads = await Lead.countDocuments({
      ...userFilter,
      status: 'Converted',
    });

    // Get leads by status
    const leadsByStatus = await Lead.aggregate([
      { $match: userFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Format leads by status
    const leadsByStatusObj = {};
    leadsByStatus.forEach((item) => {
      leadsByStatusObj[item._id] = item.count;
    });

    // Get today's leads
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    const todayLeads = await Lead.countDocuments({
      ...userFilter,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Get today's customers
    const todayCustomers = await Customer.countDocuments({
      ...userFilter,
      createdAt: { $gte: startOfDay, $lte: endOfDay },
    });

    // Admin-only: Get user-wise statistics
    let userStats = null;
    if (isAdmin) {
      const leadsByUser = await Lead.aggregate([
        {
          $group: {
            _id: '$user',
            totalLeads: { $sum: 1 },
            convertedLeads: {
              $sum: { $cond: [{ $eq: ['$status', 'Converted'] }, 1, 0] },
            },
          },
        },
        {
          $lookup: {
            from: 'users',
            localField: '_id',
            foreignField: '_id',
            as: 'userDetails',
          },
        },
        {
          $unwind: '$userDetails',
        },
        {
          $project: {
            _id: 1,
            name: '$userDetails.name',
            email: '$userDetails.email',
            totalLeads: 1,
            convertedLeads: 1,
            conversionRate: {
              $cond: [
                { $eq: ['$totalLeads', 0] },
                0,
                { $multiply: [{ $divide: ['$convertedLeads', '$totalLeads'] }, 100] },
              ],
            },
          },
        },
        { $sort: { totalLeads: -1 } },
      ]);

      userStats = leadsByUser;
    }

    res.json({
      totalLeads,
      totalCustomers,
      convertedLeads,
      leadsByStatus: leadsByStatusObj,
      todayLeads,
      todayCustomers,
      userStats, // Only populated for admins
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
