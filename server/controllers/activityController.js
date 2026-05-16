const prisma = require('../config/db');

const getActivitiesByLeadId = async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!lead || lead.assigned_user_id !== req.user.id) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const activities = await prisma.activity.findMany({
      where: { lead_id: parseInt(req.params.id) },
      orderBy: { created_at: 'desc' },
    });

    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createActivity = async (req, res) => {
  const { activity_type, note } = req.body;

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!lead || lead.assigned_user_id !== req.user.id) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const activity = await prisma.activity.create({
      data: {
        lead_id: parseInt(req.params.id),
        activity_type,
        note,
      },
    });

    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getActivitiesByLeadId,
  createActivity,
};
