const prisma = require('../config/db');

const getAllLeads = async (req, res) => {
  const { status, search } = req.query;

  try {
    const where = {
      assigned_user_id: req.user.id,
    };

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { full_name: { contains: search } },
        { email: { contains: search } },
        { company_name: { contains: search } },
      ];
    }

    const leads = await prisma.lead.findMany({
      where,
      orderBy: { created_at: 'desc' },
    });

    res.json(leads);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLeadById = async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { activities: { orderBy: { created_at: 'desc' } } },
    });

    if (!lead || lead.assigned_user_id !== req.user.id) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    res.json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createLead = async (req, res) => {
  const { full_name, email, phone, company_name, job_role, source, status } = req.body;

  try {
    const lead = await prisma.lead.create({
      data: {
        full_name,
        email,
        phone,
        company_name,
        job_role,
        source,
        status: status || 'New',
        assigned_user_id: req.user.id,
      },
    });

    res.status(201).json(lead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateLead = async (req, res) => {
  const { full_name, email, phone, company_name, job_role, source, status } = req.body;

  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!lead || lead.assigned_user_id !== req.user.id) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    // If status changed, create an activity log automatically
    if (status && status !== lead.status) {
      await prisma.activity.create({
        data: {
          lead_id: lead.id,
          activity_type: 'Status Update',
          note: `Status changed from ${lead.status} to ${status}`,
        },
      });
    }

    const updatedLead = await prisma.lead.update({
      where: { id: parseInt(req.params.id) },
      data: {
        full_name,
        email,
        phone,
        company_name,
        job_role,
        source,
        status,
      },
    });

    res.json(updatedLead);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteLead = async (req, res) => {
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(req.params.id) },
    });

    if (!lead || lead.assigned_user_id !== req.user.id) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    await prisma.lead.delete({
      where: { id: parseInt(req.params.id) },
    });

    res.json({ message: 'Lead removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getActivities = async (req, res) => {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        lead_id: parseInt(req.params.id),
        lead: { assigned_user_id: req.user.id }
      },
      orderBy: { created_at: 'desc' },
    });
    res.json(activities);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const addActivity = async (req, res) => {
  const { activity_type, note } = req.body;
  try {
    const lead = await prisma.lead.findUnique({
      where: { id: parseInt(req.params.id) }
    });

    if (!lead || lead.assigned_user_id !== req.user.id) {
      return res.status(404).json({ message: 'Lead not found' });
    }

    const activity = await prisma.activity.create({
      data: {
        lead_id: lead.id,
        activity_type,
        note,
      }
    });
    res.status(201).json(activity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getActivities,
  addActivity,
};
