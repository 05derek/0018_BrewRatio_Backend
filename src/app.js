const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { sequelize } = require('./models');

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const beanRoutes = require('./routes/beanRoutes');
const methodRoutes = require('./routes/methodRoutes');
const brewLogRoutes = require('./routes/brewLogRoutes');

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check sederhana
app.get('/', (req, res) => {
  res.status(200).json({
    service: 'BrewRatio REST API',
    status: 'running',
    database: 'PostgreSQL + Sequelize',
  });
});

// Daftarkan seluruh endpoint sesuai SRS
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/beans', beanRoutes);
app.use('/api/methods', methodRoutes);
app.use('/api/brew-logs', brewLogRoutes);

// Handler jika endpoint tidak ditemukan
app.use((req, res) => {
  res.status(404).json({ message: 'Endpoint tidak ditemukan' });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Koneksi ke PostgreSQL berhasil.');

    await sequelize.sync({ alter: true });
    console.log('Skema tabel PostgreSQL tersinkronisasi.');

    app.listen(PORT, () => {
      console.log(`Server BrewRatio berjalan di http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Gagal menjalankan server:', error.message);
    process.exit(1);
  }
};

startServer();