import Product from './productModel.js';

export const createProduct = async (req, res) => {
  try {
    console.log('req.body:', req.body);
    console.log('req.files:', req.files);

    const {
      code,
      companyName,
      brand,
      countryOfManufacture,
      machineNo,
      firstInsideCoverNo,
      secondInsideCoverNo,
      condition,
      diameterMm,
      weightGms,
      bodyMaterial,
      cost,
      remarks,
    } = req.body;

    // const images = req.files.images?.map(f => ({ url: `/uploads/${f.filename}` })) || [];
    // const videos = req.files.videos?.map(f => ({ url: `/uploads/${f.filename}` })) || [];

    const product = await Product.create({
      code,
      companyName,
      brand,
      countryOfManufacture,
      machineNo,
      firstInsideCoverNo,
      secondInsideCoverNo,
      condition,
      diameterMm,
      weightGms,
      bodyMaterial,
      cost,
      remarks,
      // images,
      // videos,
    });

    res.status(201).json({ success: true, product });
  } catch (err) {
    console.error('Backend Error:', err);
  }
};

export const productMediaUploadHandler = (req, res) => {
  try {
    const imageFiles = req.files['images'] || [];
    const videoFiles = req.files['videos'] || [];

    const imageUrls = imageFiles.map(f => `/uploads/${f.filename}`);
    const videoUrls = videoFiles.map(f => `/uploads/${f.filename}`);

    res.status(200).json({
      success: true,
      images: imageUrls,
      videos: videoUrls,
    });
  } catch (err) {
    console.error('Media Upload Error:', err);
    res.status(500).json({ success: false, message: 'Media upload failed' });
  }
};

export const productGet = async (req, res) => {
  try {
    // Pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Search & Filters
    const {
      search,
      companyName,
      condition,
      priceRange,
      sortBy,
      sortOrder,
    } = req.query;

    let query = {};

    if (search) {
      query.code = { $regex: search, $options: "i" };
    }

    if (companyName) {
      query.companyName = { $regex: companyName, $options: "i" };
    }

    if (condition) {
      query.condition = condition;
    }

    if( priceRange){
        query.cost = { $lte: Number(priceRange) };
    }

    let sortOptions = {};

    if (sortBy) {
      const order = sortOrder === "desc" ? -1 : 1;

      switch (sortBy) {
        case "price":
          sortOptions.cost = order;
          break;

        case "newest":
          sortOptions.createdAt = order;
          break;

        case "popular":
          sortOptions.views = order; // or salesCount / rating
          break;

        default:
          break;
      }
    }


    const products = await Product.find(query)
      .skip(skip)
      .limit(limit)
      .sort(sortOptions);

    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        totalProducts,
        totalPages: Math.ceil(totalProducts / limit),
        currentPage: page,
        limit,
      },
    });
  } catch (err) {
    console.error("Get Products Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve products",
    });
  }
};

export const productGetById = async (req, res) => {
  try {
    console.log("req.params:", req.params);

    const { id } = req.params;

    console.log("req parameter ",req.params);

    const product = await Product.findOne({ "_id" : id});
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.status(200).json({ success: true, product });
  } catch (err) {
    console.error("Get Product By ID Error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve product",
    });
  }
}