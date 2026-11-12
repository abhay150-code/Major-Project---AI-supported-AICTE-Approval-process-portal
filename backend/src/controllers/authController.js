const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');

function signToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name, role: user.role },
    process.env.JWT_SECRET || 'dev-secret-key',
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );
}

async function register(req, res, next) {
  try {
    const { name, email, password, role, institutionName, address, establishmentYear } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const userRole = role && ['ADMIN', 'REVIEWER', 'INSTITUTE'].includes(role) ? role : 'INSTITUTE';
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdUser = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: { name: name.trim(), email, password: hashedPassword, role: userRole },
        select: { id: true, name: true, email: true, role: true, createdAt: true },
      });
      if (userRole === 'INSTITUTE') {
        await tx.institution.create({
          data: {
            userId: user.id,
            institutionName: (institutionName || name).trim(),
            address: (address || 'Address not provided yet').trim(),
            establishmentYear: Number(establishmentYear) || new Date().getFullYear(),
          },
        });
      }
      return user;
    });
    const token = signToken(createdUser);
    res.status(201).json({ token, user: createdUser });
  } catch (err) {
    next(err);
  }
}

module.exports = { register };
