require("dotenv").config();
const sequelize = require("./config/database");
const User = require("./models/User");
const Book = require("./models/Book");
const Borrow = require("./models/Borrow");
const express = require("express");
const cors = require("cors");

const app = express();

// JSON parsing
app.use(express.json());

// CORS options
const cors = require("cors");
const corsOptions = {
  origin: "https://library-management-system-eight-beta.vercel.app",
  credentials: true,
};

app.use(cors(corsOptions));

// Routes
const authRoutes = require("./routes/authRoutes");
const bookRoutes = require("./routes/bookRoutes");
const borrowBook = require("./routes/borrowRoutes");
app.use("/auth", authRoutes);
app.use("/book", bookRoutes);
app.use("/borrow", borrowBook);

const startServer = async () => {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected successfully!');
    
    // Check existing tables first
    const [tables] = await sequelize.query("SHOW TABLES");
    const tableNames = tables.map(row => Object.values(row)[0]);
    console.log('📋 Existing tables:', tableNames);
    
    // Create tables individually to avoid foreign key conflicts
    if (!tableNames.includes('users')) {
      await User.sync();
      console.log('✅ Users table created!');
    } else {
      console.log('✅ Users table already exists!');
    }
    
    if (!tableNames.includes('books')) {
      await Book.sync();
      console.log('✅ Books table created!');
    } else {
      console.log('✅ Books table already exists!');
    }
    
    if (!tableNames.includes('borrows')) {
      await sequelize.query(`
        CREATE TABLE IF NOT EXISTS \`borrows\` (
          \`id\` INTEGER auto_increment,
          \`userId\` INTEGER NOT NULL,
          \`bookId\` INTEGER NOT NULL,
          \`borrowDate\` DATETIME NOT NULL,
          \`returnDate\` DATETIME,
          \`createdAt\` DATETIME,
          \`updatedAt\` DATETIME,
          PRIMARY KEY (\`id\`)
        ) ENGINE=InnoDB;
      `);
      console.log('✅ Borrows table created!');
    } else {
      console.log('✅ Borrows table already exists!');
    }
    
    console.log('🎉 All tables ready!');

    app.get('/', (req, res) => {
      res.send("Server is running...");
    });

    const port = process.env.PORT || 5000;
    app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Server is running on port ${port}`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
  }
};

startServer();
