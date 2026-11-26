const { Op } = require('sequelize');
const { BrewLog, CoffeeBean, BrewMethod } = require('../models');

const getAllBrewLogs = async (req, res) => {
  try {
    const { q } = req.query;
    const whereClause = { user_id: req.user.id };

    const logs = await BrewLog.findAll({
      where: whereClause,
      include: [
        {
          model: CoffeeBean,
          attributes: ['id', 'bean_name', 'origin', 'roast_level', 'process_type'],
          required: false,
        },
        {
          model: BrewMethod,
          attributes: ['id', 'method_name', 'default_ratio', 'grind_size'],
          required: false,
        },
      ],
      order: [['brewed_at', 'DESC']],
    });

    const filteredLogs =
      q && String(q).trim() !== ''
        ? logs.filter((log) => {
            const kw = String(q).trim().toLowerCase();
            const beanMatch = log.CoffeeBean?.bean_name?.toLowerCase().includes(kw);
            const dateMatch = log.brewed_at
              ? new Date(log.brewed_at).toISOString().toLowerCase().includes(kw)
              : false;
            return Boolean(beanMatch || dateMatch);
          })
        : logs;

    return res.status(200).json({
      message: 'Riwayat logbook seduh berhasil diambil',
      data: filteredLogs,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal mengambil riwayat logbook seduh',
      error: error.message,
    });
  }
};

const createBrewLog = async (req, res) => {
  try {
    const {
      coffee_bean_id,
      brew_method_id,
      coffee_weight_grams,
      water_volume_ml,
      water_temp_celsius,
      rating,
      flavor_notes,
      brewed_at,
    } = req.body;

    const weight = Number(coffee_weight_grams);
    const volume = Number(water_volume_ml);
    const temp = Number(water_temp_celsius);
    const score = Number(rating);

    if (!weight || weight <= 0 || !volume || volume <= 0) {
      return res.status(400).json({
        message: 'coffee_weight_grams dan water_volume_ml harus lebih dari 0',
      });
    }

    if (Number.isNaN(temp) || temp < 50 || temp > 105) {
      return res.status(400).json({
        message: 'water_temp_celsius harus berada pada rentang wajar (50 - 105 °C)',
      });
    }

    if (!Number.isInteger(score) || score < 1 || score > 5) {
      return res.status(400).json({
        message: 'rating harus berupa bilangan bulat antara 1 sampai 5',
      });
    }

    if (coffee_bean_id) {
      const bean = await CoffeeBean.findOne({
        where: { id: coffee_bean_id, user_id: req.user.id },
      });
      if (!bean) {
        return res.status(400).json({
          message: 'coffee_bean_id tidak valid atau bukan milik pengguna',
        });
      }
    }

    if (brew_method_id) {
      const method = await BrewMethod.findOne({
        where: { id: brew_method_id, user_id: req.user.id },
      });
      if (!method) {
        return res.status(400).json({
          message: 'brew_method_id tidak valid atau bukan milik pengguna',
        });
      }
    }

    const log = await BrewLog.create({
      user_id: req.user.id,
      coffee_bean_id: coffee_bean_id ?? null,
      brew_method_id: brew_method_id ?? null,
      coffee_weight_grams: weight,
      water_volume_ml: volume,
      water_temp_celsius: temp,
      rating: score,
      flavor_notes: flavor_notes ?? null,
      brewed_at: brewed_at ? new Date(brewed_at) : new Date(),
    });

    return res.status(201).json({
      message: 'Catatan logbook seduh berhasil disimpan',
      data: log,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menyimpan catatan logbook seduh',
      error: error.message,
    });
  }
};

const updateBrewLog = async (req, res) => {
  try {
    const { id } = req.params;
    const log = await BrewLog.findOne({
      where: { id, user_id: req.user.id },
    });

    if (!log) {
      return res.status(404).json({ message: 'Catatan logbook tidak ditemukan' });
    }

    const { rating, flavor_notes } = req.body;

    if (rating !== undefined) {
      const score = Number(rating);
      if (!Number.isInteger(score) || score < 1 || score > 5) {
        return res.status(400).json({
          message: 'rating harus berupa bilangan bulat antara 1 sampai 5',
        });
      }
      log.rating = score;
    }

    if (flavor_notes !== undefined) {
      log.flavor_notes = flavor_notes === '' ? null : String(flavor_notes);
    }

    await log.save();

    return res.status(200).json({
      message: 'Catatan logbook berhasil diperbarui',
      data: log,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal memperbarui catatan logbook',
      error: error.message,
    });
  }
};

const deleteBrewLog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCount = await BrewLog.destroy({
      where: { id, user_id: req.user.id },
    });

    if (!deletedCount) {
      return res.status(404).json({ message: 'Catatan logbook tidak ditemukan' });
    }

    return res.status(200).json({
      message: 'Catatan logbook berhasil dihapus',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Gagal menghapus catatan logbook',
      error: error.message,
    });
  }
};

module.exports = {
  getAllBrewLogs,
  createBrewLog,
  updateBrewLog,
  deleteBrewLog,
};