import mongoose from "mongoose";

const ensureOrderIndexes = async () => {
  try {
    const orders = mongoose.connection.collection("orders");
    const indexes = await orders.indexes();
    const khaltiIndex = indexes.find((idx) => idx.name === "khaltiPidx_1");

    if (khaltiIndex) {
      const hasPartialFilter = Boolean(khaltiIndex.partialFilterExpression);
      if (!hasPartialFilter) {
        await orders.dropIndex("khaltiPidx_1");
      }
    }

    await orders.createIndex(
      { khaltiPidx: 1 },
      {
        name: "khaltiPidx_1",
        unique: true,
        partialFilterExpression: {
          khaltiPidx: { $type: "string" },
        },
      },
    );
  } catch (error) {
    // Do not block app startup if index migration fails; log for visibility.
    console.error("Order index sync warning:", error?.message || error);
  }
};

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {});
    await ensureOrderIndexes();
    console.log("Database Connected");
  } catch (error) {
    console.log(error);
  }
};

export default connectDB;
