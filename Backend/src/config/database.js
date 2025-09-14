const { Sequelize } = require('sequelize');
require('dotenv').config();

// Production/Deployment configuration
const sequelize = new Sequelize({
  dialect: 'mysql',
  host: process.env.MYSQLHOST || process.env.MYSQL_HOST || 'ballast.proxy.rlwy.net',
  port: process.env.MYSQLPORT || process.env.MYSQL_PORT || 39706,
  username: process.env.MYSQLUSER || process.env.MYSQL_USER || 'root',
  password: process.env.MYSQLPASSWORD || process.env.MYSQL_PASSWORD || 'WtNxjPXcCGiBmooLInmzzgAXTrKPdlZQ',
  database: process.env.MYSQLDATABASE || process.env.MYSQL_DATABASE || 'railway',
  logging: false, // Set to console.log to see SQL queries
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Database connected successfully with Sequelize!');
    console.log('📊 Database Config:', {
      host: sequelize.config.host,
      port: sequelize.config.port,
      database: sequelize.config.database,
      username: sequelize.config.username
    });
  } catch (error) {
    console.error('❌ Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;
