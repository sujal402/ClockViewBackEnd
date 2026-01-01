import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
dotenv.config(); // MUST be first, before importing cloudinary


console.log("Cloudinary configured:", {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY ? "***" : undefined,
});

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


(async () => {
  try {
    const result = await cloudinary.api.resources();
    console.log("Cloudinary connected, found resources:", result.resources.length);
  } catch (err) {
    console.log("cloudinary error : ",err);
  }
})();

export default cloudinary;
