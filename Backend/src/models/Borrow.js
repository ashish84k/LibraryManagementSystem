const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Borrow = sequelize.define('Borrow', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  bookId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'books',
      key: 'id'
    }
  },
  borrowDate: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW
  },
  returnDate: {
    type: DataTypes.DATE,
    allowNull: true
  },
  isReturned: {
    type: DataTypes.VIRTUAL,
    get() {
      return this.returnDate !== null;
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'borrows',
  timestamps: true,
  indexes: [
    {
      unique: true,
      fields: ['userId', 'bookId'],
      where: {
        returnDate: null
      }
    }
  ]
});


module.exports = Borrow;
