const { Op } = require('sequelize');
const { CoffeeBean } = require('../models');

const getAllBeans = async (req, res) => {
  try {
    const { q } = req.query;
    const whereClause = { user_id: req.user.id };

    if (q && String(q).trim() !== '') {
      const keyword = `%${String(q).trim()}%`;
      whereClause[Op.or] = [
        { bean_name: { [Op.iLike]: keyword } },
        { origin: { [Op.iLike]: keyword } },
      ];
    }

    const beans = await CoffeeBean.findAll({
      where: whereClause,
      order: [['created_at', 'DESC']],
    });

    return res.status(200).json({
      message: 'Data katalog biji kopi berhasil diambil',
      data: beans,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil data biji kopi',
      error: error.message,
    });
  }
};

const createBean = async (req, res) => {
  try {
    const { bean_name, origin, roast_level, process_type } = req.body;

    if (!bean_name || !origin || !roast_level || !process_type) {
      return res.status(400).json({
        message: 'Field bean_name, origin, roast_level, dan process_type wajib diisi',
      });
    }

    const bean = await CoffeeBean.create({
      user_id: req.user.id,
      bean_name: String(bean_name).trim(),
      origin: String(origin).trim(),
      roast_level: String(roast_level).trim(),
      process_type: String(process_type).trim(),
    });

    return res.status(201).json({
      message: 'Biji kopi berhasil ditambahkan',
      data: bean,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menambahkan biji kopi',
      error: error.message,
    });
  }
};

const updateBean = async (req, res) => {
  try {
    const { id } = req.params;
    const bean = await CoffeeBean.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!bean) {
      return res.status(404).json({ message: 'Data biji kopi tidak ditemukan' });
    }

    const { bean_name, origin, roast_level, process_type } = req.body;

    if (bean_name !== undefined) bean.bean_name = String(bean_name).trim();
    if (origin !== undefined) bean.origin = String(origin).trim();
    if (roast_level !== undefined) bean.roast_level = String(roast_level).trim();
    if (process_type !== undefined) bean.process_type = String(process_type).trim();

    await bean.save();

    return res.status(200).json({
      message: 'Data biji kopi berhasil diperbarui',
      data: bean,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal memperbarui data biji kopi',
      error: error.message,
    });
  }
};

const deleteBean = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await CoffeeBean.destroy({
      where: { id, user_id: req.user.id },
    });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Data biji kopi tidak ditemukan' });
    }

    return res.status(200).json({
      message: 'Data biji kopi berhasil dihapus',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menghapus data biji kopi',
      error: error.message,
    });
  }
};

module.exports = {
  getAllBeans,
  createBean,
  updateBean,
  deleteBean,
};