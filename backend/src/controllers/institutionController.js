const prisma = require('../config/prisma');

// GET /api/institutions/me
async function getMyInstitution(req, res, next) {
  try {
    const institution = await prisma.institution.findUnique({
      where: { userId: req.user.id },
    });

    if (!institution) {
      return res.status(404).json({ message: 'Institution profile not found' });
    }

    res.json(institution);
  } catch (err) {
    next(err);
  }
}

// PUT /api/institutions/me
async function updateMyInstitution(req, res, next) {
  try {
    const { institutionName, address, establishmentYear } = req.body;

    if (!institutionName || !address || !establishmentYear) {
      return res.status(400).json({
        message: 'institutionName, address, and establishmentYear are required',
      });
    }

    const year = Number(establishmentYear);
    if (Number.isNaN(year) || year < 1800 || year > new Date().getFullYear()) {
      return res.status(400).json({ message: 'Enter a valid establishmentYear' });
    }

    const updated = await prisma.institution.upsert({
      where: { userId: req.user.id },
      update: {
        institutionName: institutionName.trim(),
        address: address.trim(),
        establishmentYear: year,
      },
      create: {
        userId: req.user.id,
        institutionName: institutionName.trim(),
        address: address.trim(),
        establishmentYear: year,
      },
    });

    res.json(updated);
  } catch (err) {
    next(err);
  }
}

module.exports = { getMyInstitution, updateMyInstitution };
