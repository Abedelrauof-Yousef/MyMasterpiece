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
    const { type, amount, description, category, isRecurring, isFixed } = req.body;

    if (!type || !amount || !description || !category) {
      return res.status(400).json({ msg: 'Please provide all required fields' });
    }

    const newTransaction = new Transaction({
      userId: req.user.id,
      type,
      amount,
      description,
      category,
      isRecurring: isRecurring || false,
      isFixed: isFixed || false,
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
