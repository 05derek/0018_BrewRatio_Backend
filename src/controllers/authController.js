const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { sequelize, User, BrewMethod } = require('../models');

const DEFAULT_BREW_METHODS = [
  {
    method_name: 'V60 Standard 1:15',
    default_ratio: '1:15',
    grind_size: 'Medium-Fine',
    instructions:
      '1. Bilas kertas filter dengan air panas dan buang air bilasan.\n2. Masukkan kopi dan lakukan blooming dengan 2x berat kopi selama 30-45 detik.\n3. Tuang air secara melingkar perlahan hingga target rasio tercapai.',
  },
  {
    method_name: 'Tetsu Kasuya 4:6 Method',
    default_ratio: '1:15',
    grind_size: 'Coarse',
    instructions:
      '1. Bagi total air menjadi 5 tuangan sama rata.\n2. Dua tuangan pertama (40%) mengatur keseimbangan sweet/acidity.\n3. Tiga tuangan berikutnya (60%) mengatur strength seduhan.',
  },
  {
    method_name: 'James Hoffmann Ultimate V60',
    default_ratio: '1:16.6',
    grind_size: 'Medium-Fine',
    instructions:
      '1. Buat lubang kecil di tengah bubuk kopi lalu lakukan blooming 3x berat kopi selama 45 detik.\n2. Tuang air hingga 60% target dalam 30 detik, lalu lanjutkan hingga 100% dalam 30 detik berikutnya.\n3. Aduk pelan searah jarum jam dan goyangkan dripper agar bed rata.',
  },
];

const generateAccessToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_ACCESS_SECRET,
    { expiresIn: '15m' }
  );
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, role: user.role },
    process.env.JWT_REFRESH_SECRET,
    { expiresIn: '7d' }
  );
};

const register = async (req, res) => {
  const transaction = await sequelize.transaction();
  try {
    const { name, email, password, bio, favorite_roast, phone_number } = req.body;

    if (!name || !email || !password) {
      await transaction.rollback();
      return res.status(400).json({
        message: 'Field name, email, dan password wajib diisi',
      });
    }

    const existingUser = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (existingUser) {
      await transaction.rollback();
      return res.status(409).json({
        message: 'Email sudah terdaftar',
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create(
      {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password_hash: passwordHash,
        role: 'ROLE_USER',
        bio: bio ?? null,
        favorite_roast: favorite_roast ?? null,
        phone_number: phone_number ?? null,
      },
      { transaction }
    );

    const seededMethods = DEFAULT_BREW_METHODS.map((method) => ({
      ...method,
      user_id: newUser.id,
    }));

    await BrewMethod.bulkCreate(seededMethods, { transaction });

    await transaction.commit();

    return res.status(201).json({
      message: 'Registrasi berhasil dan 3 metode seduh V60 bawaan telah dibuat',
      data: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        bio: newUser.bio,
        favorite_roast: newUser.favorite_roast,
        phone_number: newUser.phone_number,
      },
    });
  } catch (error) {
    await transaction.rollback();
    return res.status(500).json({
      message: 'Terjadi kesalahan saat registrasi',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email dan password wajib diisi',
      });
    }

    const user = await User.findOne({ where: { email: email.trim().toLowerCase() } });
    if (!user) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return res.status(401).json({
        message: 'Email atau password salah',
      });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    const refreshTokenHash = await bcrypt.hash(refreshToken, 10);

    await user.update({ refresh_token_hash: refreshTokenHash });

    return res.status(200).json({
      message: 'Login berhasil',
      data: {
        access_token: accessToken,
        refresh_token: refreshToken,
        expires_in: '15m',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat login',
      error: error.message,
    });
  }
};

const refresh = async (req, res) => {
  try {
    const { refresh_token } = req.body;

    if (!refresh_token) {
      return res.status(400).json({
        message: 'refresh_token wajib dikirimkan',
      });
    }

    let decoded;
    try {
      decoded = jwt.verify(refresh_token, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res.status(401).json({
        message: 'Refresh token tidak valid atau sudah kedaluwarsa',
      });
    }

    const user = await User.findByPk(decoded.id);
    if (!user || !user.refresh_token_hash) {
      return res.status(401).json({
        message: 'Sesi refresh token tidak ditemukan',
      });
    }

    const isRefreshValid = await bcrypt.compare(refresh_token, user.refresh_token_hash);
    if (!isRefreshValid) {
      return res.status(401).json({
        message: 'Refresh token tidak cocok',
      });
    }

    const newAccessToken = generateAccessToken(user);

    return res.status(200).json({
      message: 'Access token berhasil diperbarui',
      data: {
        access_token: newAccessToken,
        expires_in: '15m',
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Terjadi kesalahan saat memperbarui token',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  refresh,
};