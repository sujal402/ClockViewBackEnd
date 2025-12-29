import mongoose from 'mongoose';

// Counter schema (for auto-increment)
const counterSchema = new mongoose.Schema({
  name: { type: String, unique: true },
  seq: { type: Number, default: 0 },
});

const Counter = mongoose.models.Counter || mongoose.model('Counter', counterSchema);

// Product schema (14 items)
const productSchema = new mongoose.Schema(
  {
    // 1️⃣ Auto-increment serial number
    serialNo: {
      type: Number,
      unique: true,
    },

    // 2️⃣ Product code
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    // 3️⃣ Company name
    companyName: {
      type: String,
      required: true,
      trim: true,
    },

    // 4️⃣ Brand
    brand: {
      type: String,
      required: true,
      trim: true,
    },

    // 5️⃣ Country of manufacture
    countryOfManufacture: {
      type: String,
      required: true,
      trim: true,
    },

    // 6️⃣ Machine number
    machineNo: {
      type: String,
      required: true,
      trim: true,
    },

    // 7️⃣ First inside cover number
    firstInsideCoverNo: {
      type: String,
      required: true,
      trim: true,
    },

    // 8️⃣ Second inside cover number
    secondInsideCoverNo: {
      type: String,
      required: true,
      trim: true,
    },

    // 9️⃣ Condition
    condition: {
      type: String,
      enum: ['Excellent', 'Needs Service', 'Needs Repair'],
      required: true,
    },

    // 🔟 Diameter (mm)
    diameterMm: {
      type: Number,
    },

    // 1️⃣1️⃣ Weight (grams)
    weightGms: {
      type: Number,
    },

    // 1️⃣2️⃣ Body material
    bodyMaterial: {
      type: String,
      enum: ['Gold', 'Silver', 'Alloy', 'Nickel', 'Iron', 'Other'],
    },

    // 1️⃣3️⃣ Cost
    cost: {
      type: Number,
      required: true,
    },

    // 1️⃣4️⃣ Remarks
    remarks: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

// Auto-increment serialNo
productSchema.pre('save', async function (next) {
  if (this.serialNo) return next();

  const counter = await Counter.findOneAndUpdate(
    { name: 'productSerial' },
    { $inc: { seq: 1 }},
    { new: true , upsert: true }
  );

  this.serialNo = counter.seq;
});

const Product =
  mongoose.models.Product || mongoose.model('Product', productSchema);

export default Product;
