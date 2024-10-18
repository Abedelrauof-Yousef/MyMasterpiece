// Controllers/transactionController.js

const Transaction = require('../Models/transaction');

// Fetch transactions for the logged-in user
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user.id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Add a new transaction (income or expense)
exports.addTransaction = async (req, res) => {
  try {
    const { type, amount, description, category, date, isRecurring, recurrenceDate, isFixed, paymentMethod } = req.body;

    // Validate required fields
    if (!type || !amount || !description || !category) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    // Additional validation for expense transactions
    if (type === 'expense') {
      if (!paymentMethod) {
        return res.status(400).json({ msg: 'Payment method is required for expenses' });
      }
    }

    const newTransaction = new Transaction({
      userId: req.user.id,
      type,
      amount,
      description,
      category,
      date: date ? new Date(date) : Date.now(),
      isRecurring: isRecurring || false,
      recurrenceDate: isRecurring ? recurrenceDate : undefined,
      isFixed: type === 'expense' ? isFixed : undefined,
      paymentMethod: type === 'expense' ? paymentMethod : undefined,
    });

    const transaction = await newTransaction.save();
    res.json(transaction);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// Delete a transaction by ID
exports.deleteTransaction = async (req, res) => {
  try {
    const transaction = await Transaction.findByIdAndDelete(req.params.id);

    if (!transaction) {
      return res.status(404).json({ msg: 'Transaction not found' });
    }

    res.json({ msg: 'Transaction removed', deletedTransaction: transaction });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};
