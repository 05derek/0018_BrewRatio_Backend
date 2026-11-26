const { User } = require('../models');

const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: {
        exclude: ['password_hash', 'refresh_token_hash'],
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    return res.status(200).json({
      message: 'Detail profil berhasil diambil',
      data: user,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil profil pengguna',
      error: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'Pengguna tidak ditemukan' });
    }

    const { name, bio, favorite_roast, phone_number } = req.body;

    if (name !== undefined) {
      if (!String(name).trim()) {
        return res.status(400).json({ message: 'Nama tidak boleh kosong' });
      }
      user.name = String(name).trim();
    }

    // Izinkan null atau string kosong menjadi null agar kolom opsional bisa dikosongkan
    if (bio !== undefined) {
      user.bio = bio === '' || bio === null ? null : String(bio);
    }

    if (favorite_roast !== undefined) {
      user.favorite_roast =
        favorite_roast === '' || favorite_roast === null
          ? null
          : String(favorite_roast).trim();
    }

    if (phone_number !== undefined) {
      user.phone_number =
        phone_number === '' || phone_number === null
          ? null
          : String(phone_number).trim();
    }

    await user.save();

    return res.status(200).json({
      message: 'Profil berhasil diperbarui',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        favorite_roast: user.favorite_roast,
        phone_number: user.phone_number,
        created_at: user.created_at,
        updated_at: user.updated_at,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal memperbarui profil pengguna',
      error: error.message,
    });
  }
};

const deleteAccount = async (req, res) => {
  try {
    const deletedCount = await User.destroy({
      where: { id: req.user.id },
    });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Akun tidak ditemukan' });
    }

    return res.status(200).json({
      message: 'Akun beserta seluruh data relasinya berhasil dihapus secara permanen',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menghapus akun',
      error: error.message,
    });
  }
};

module.exports = {
  getProfile,
  updateProfile,
  deleteAccount,
};