const { Op } = require('sequelize');
const { BrewMethod } = require('../models');

const getAllMethods = async (req, res) => {
  try {
    const { q } = req.query;
    const whereClause = { user_id: req.user.id };

    if (q && String(q).trim() !== '') {
      whereClause.method_name = { [Op.iLike]: `%${String(q).trim()}%` };
    }

    const methods = await BrewMethod.findAll({
      where: whereClause,
      order: [['id', 'ASC']],
    });

    return res.status(200).json({
      message: 'Daftar metode seduh berhasil diambil',
      data: methods,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil daftar metode seduh',
      error: error.message,
    });
  }
};

const createMethod = async (req, res) => {
  try {
    const { method_name, default_ratio, grind_size, instructions } = req.body;

    if (!method_name || !default_ratio || !grind_size || !instructions) {
      return res.status(400).json({
        message:
          'Field method_name, default_ratio, grind_size, dan instructions wajib diisi',
      });
    }

    const method = await BrewMethod.create({
      user_id: req.user.id,
      method_name: String(method_name).trim(),
      default_ratio: String(default_ratio).trim(),
      grind_size: String(grind_size).trim(),
      instructions: String(instructions),
    });

    return res.status(201).json({
      message: 'Metode seduh berhasil ditambahkan',
      data: method,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menambahkan metode seduh',
      error: error.message,
    });
  }
};

const updateMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const method = await BrewMethod.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!method) {
      return res.status(404).json({ message: 'Metode seduh tidak ditemukan' });
    }

    const { method_name, default_ratio, grind_size, instructions } = req.body;

    if (method_name !== undefined) method.method_name = String(method_name).trim();
    if (default_ratio !== undefined)
      method.default_ratio = String(default_ratio).trim();
    if (grind_size !== undefined) method.grind_size = String(grind_size).trim();
    if (instructions !== undefined) method.instructions = String(instructions);

    await method.save();

    return res.status(200).json({
      message: 'Metode seduh berhasil diperbarui',
      data: method,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal memperbarui metode seduh',
      error: error.message,
    });
  }
};

const deleteMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await BrewMethod.destroy({
      where: { id, user_id: req.user.id },
    });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Metode seduh tidak ditemukan' });
    }

    return res.status(200).json({
      message: 'Metode seduh berhasil dihapus',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menghapus metode seduh',
      error: error.message,
    });
  }
};

module.exports = {
  getAllMethods,
  createMethod,
  updateMethod,
  deleteMethod,
};