const Borrow = require("../models/Borrow");
const Book = require("../models/Book");

exports.borrowBook = async (req, res) => {
  const sequelize = require("../config/database");
  const transaction = await sequelize.transaction();
  
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    
    // Check if user already borrowed this book
    const existingBorrow = await Borrow.findOne({
      where: {
        userId,
        bookId,
        returnDate: null
      },
      transaction
    });
    
    if (existingBorrow) {
      await transaction.rollback();
      return res.status(400).json({ message: "Already borrowed this book." });
    }

    // Get book details
    const book = await Book.findByPk(bookId, { transaction });
    if (!book) {
      await transaction.rollback();
      return res.status(404).json({ message: "Book not found" });
    }
    
    if (book.borrowed >= book.totalCopies) {
      await transaction.rollback();
      return res.status(400).json({ message: "No copies available." });
    }

    // Create borrow record
    await Borrow.create({
      userId,
      bookId,
      borrowDate: new Date()
    }, { transaction });

    // Update book borrowed count
    await book.update({
      borrowed: book.borrowed + 1
    }, { transaction });

    await transaction.commit();
    return res.status(200).json({ message: "Book borrowed successfully" });
  } catch (err) {
    await transaction.rollback();
    return res.status(500).json({ message: "Error borrowing book" });
  }
};

exports.returnBook = async (req, res) => {
  const sequelize = require("../config/database");
  const transaction = await sequelize.transaction();
  
  try {
    const { bookId } = req.body;
    const userId = req.user.id;
    
    console.log("bookId :",bookId,"userId :",userId);
    console.log('🔍 Looking for borrow record:', { userId, bookId });
    
    // Find the borrow record
    const borrow = await Borrow.findOne({
      where: {
        userId,
        bookId,
        returnDate: null
      },
      transaction
    });
    
    
    if (!borrow) {
      // Let's check if there are any borrows for this user and book
      const allBorrows = await Borrow.findAll({
        where: {
          userId,
          bookId
        },
        transaction
      });
      
      await transaction.rollback();
      return res.status(400).json({ message: "No active borrow record found" });
    }

    // Update borrow record
    await Borrow.update({
      returnDate: new Date()
    }, {
      where: {
        id: borrow.id
      },
      transaction
    });

    // Update book borrowed count
    const book = await Book.findByPk(bookId, { transaction });
    if (book && book.borrowed > 0) {
      await book.update({
        borrowed: book.borrowed - 1
      }, { transaction });
    }

    await transaction.commit();
    res.json({ message: "Book returned successfully" });
  } catch (err) {
    await transaction.rollback();
    res.status(500).json({ message: "Error returning book" });
  }
};

exports.getUserBorrows = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get all active borrows
    const borrows = await Borrow.findAll({
      where: {
        userId,
        returnDate: null
      },
      order: [['borrowDate', 'DESC']]
    });

    // Map borrows with book details
    const borrowsWithBooks = await Promise.all(
      borrows.map(async (borrow) => {
        let bookData = null;

        try {
          const book = await Book.findByPk(borrow.bookId);
          if (book) {
            bookData = {
              id: book.id,
              title: book.title,
              author: book.author
            };
          }
        } catch (err) {
          console.error(`Error fetching book for borrowId ${borrow.id}:`, err.message);
        }

        return {
          id: borrow.id,
          userId: borrow.userId,
          bookId: borrow.bookId,
          borrowDate: borrow.borrowDate,
          returnDate: borrow.returnDate,
          book: bookData
        };
      })
    );

    res.json(borrowsWithBooks);
  } catch (err) {
    console.error("Error fetching borrowed books:", err.message);
    res.status(500).json({ message: "Error fetching borrowed books" });
  }
};
