const cron = require('node-cron');
const Transaction = require('../Models/transaction');
const mongoose = require('mongoose');

// Function to create a new transaction based on a recurring one
const createRecurringTransaction = async (transaction) => {
  try {
    const newTransaction = new Transaction({
      userId: transaction.userId,
      type: transaction.type,
      amount: transaction.amount,
      description: transaction.description,
      category: transaction.category,
      isRecurring: transaction.isRecurring,
      isFixed: transaction.isFixed,
      date: new Date(), // Current date
      recurrenceDate: transaction.recurrenceDate,
    });

    await newTransaction.save();
    console.log(`Recurring ${transaction.type} added for user ${transaction.userId}`);
  } catch (err) {
    console.error('Error creating recurring transaction:', err.message);
  }
};

// Schedule the job to run daily at 00:05 AM
cron.schedule('5 0 * * *', async () => {
  console.log('Running scheduled job for recurring transactions...');

  const today = new Date();
  const currentDay = today.getDate();
  const currentMonth = today.getMonth() + 1; // Months are zero-indexed
  const currentYear = today.getFullYear();

  try {
    // Find all recurring transactions where recurrenceDate is today
    const recurringTransactions = await Transaction.find({
      isRecurring: true,
      recurrenceDate: currentDay,
    });

    for (const transaction of recurringTransactions) {
      // Optional: Check if a transaction for today has already been created to avoid duplicates
      const existingTransaction = await Transaction.findOne({
        userId: transaction.userId,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        category: transaction.category,
        date: {
          $gte: new Date(currentYear, currentMonth - 1, currentDay),
          $lt: new Date(currentYear, currentMonth - 1, currentDay + 1),
        },
      });

      if (!existingTransaction) {
        await createRecurringTransaction(transaction);
      } else {
        console.log(`Transaction already exists for user ${transaction.userId} on ${today.toDateString()}`);
      }
    }

    console.log('Recurring transactions processed successfully.');
  } catch (err) {
    console.error('Error processing recurring transactions:', err.message);
  }
});
