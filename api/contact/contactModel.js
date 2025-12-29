import mongoose from 'mongoose';

// Define the Contact schema
const contactSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      trim: true,
      minlength: [5, 'Username must be at least 5 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email'],
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      minlength: [10, 'Message must be at least 10 characters'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
{ 
  timestamps: true,
  collection: "contact" // <-- force collection name to 'contact'
});


// Create and export the Contact model
const Contact = mongoose.model('Contact', contactSchema);

export default Contact;