import Contact from "./contactModel.js";
import connectDB from "../../utils/db.js";

export const help = async (req, res) => {
    await connectDB();
  const { username, email, message } = req.body;

  try { 

    // Create new user
    const cont = new Contact({
      username,
      email,
      message,
    });

    await cont.save();

    res.status(201).json({ message: "Contact message received" });
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
};
