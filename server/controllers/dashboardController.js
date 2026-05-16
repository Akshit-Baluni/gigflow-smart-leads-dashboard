const prisma = require('../config/db');

const getDashboardStats = async (req, res) => {
  try {
    const totalLeads = await prisma.lead.count({
      where: { assigned_user_id: req.user.id }
    });

    const counts = await prisma.lead.groupBy({
      by: ['status'],
      where: { assigned_user_id: req.user.id },
      _count: { id: true }
    });

    const stats = {
      total: totalLeads,
      new: counts.find(c => c.status === 'New')?._count.id || 0,
      contacted: counts.find(c => c.status === 'Contacted')?._count.id || 0,
      qualified: counts.find(c => c.status === 'Qualified')?._count.id || 0,
      interview: counts.find(c => c.status === 'Interview')?._count.id || 0,
      hired: counts.find(c => c.status === 'Hired')?._count.id || 0,
      rejected: counts.find(c => c.status === 'Rejected')?._count.id || 0,
    };

    // Get activity volume over time for the chart
    const recentLeadsByDay = await prisma.lead.groupBy({
      by: ['created_at'],
      where: { 
        assigned_user_id: req.user.id,
        created_at: {
          gte: new Date(new Date().setDate(new Date().getDate() - 30))
        }
      },
      _count: { id: true },
      orderBy: { created_at: 'asc' }
    });

    res.json({
      stats,
      recentLeads: recentLeadsByDay
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getDashboardStats };
