import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../users/userModel.js';

export const Register = async (req, res) => {
  const { username, email, password } = req.body;

  try { 
    // Check if user already exists in database
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists. Please login' });
    }

    // Create new user
    user = new User({
      username,
      email,
      password,
    });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    // Save user to database
    await user.save();

    // Create and sign JWT
    const payload = {
      user: {
        id: user.id,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;
        res.status(201).json({ token });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const Login = async (req , res) => {
    const { email, password } = req.body;
    
    try {
        // Find user by email
    const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(400).json({ message: 'Invalid Credentials' });
        }
        
        // Compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            console.log("Invalid password attempt for user:", email);
            return res.status(400).json({ message: 'Invalid Credentials' });
        }

    jwt.sign(
      { user: { id: user.id } },
      process.env.JWT_SECRET,
      { expiresIn: '1h' },
      (err, token) => {
        if (err) throw err;

        // Set JWT as an HttpOnly cookie
        const cookieOptions = {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        };

        res.cookie('token', token, cookieOptions);
        // Send minimal user info in body
        res.status(200).json({ message: 'Login successful', user: { id: user.id, email: user.email } });
      }
    );

    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
}

export const Me = async (req, res) => {
  try {
    // `auth` middleware attaches `req.user` with `{ id }`
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: 'Unauthorized' });

    const user = await User.findById(userId).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.status(200).json({ user });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};

export const Logout = async (req, res) => {
  try {
    // Clear the cookie
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server error');
  }
};
