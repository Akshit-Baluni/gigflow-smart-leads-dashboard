const express = require('express');
const {
  getAllLeads,
  getLeadById,
  createLead,
  updateLead,
  deleteLead,
  getActivities,
  addActivity,
} = require('../controllers/leadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);

router.get('/', getAllLeads);
router.get('/:id', getLeadById);
router.post('/', createLead);
router.put('/:id', updateLead);
router.delete('/:id', deleteLead);

// Activity routes
router.get('/:id/activities', getActivities);
router.post('/:id/activities', addActivity);

module.exports = router;
