const cloudinary = require("../config/cloudinary");

// helper: upload buffer to cloudinary
const uploadToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: "auto" },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    stream.end(buffer);
  });

exports.uploadSingle = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file provided" });
    const result = await uploadToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadArray = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: "No files provided" });
    const uploads = req.files.map((f) => uploadToCloudinary(f.buffer));
    const results = await Promise.all(uploads);
    res.json({ urls: results.map((r) => r.secure_url) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.uploadMultipleFields = async (req, res) => {
  try {
    if (!req.files)
      return res.status(400).json({ message: "No files provided" });
    const output = {};
    for (const field in req.files) {
      const uploads = req.files[field].map((f) => uploadToCloudinary(f.buffer));
      const results = await Promise.all(uploads);
      output[field] = results.map((r) => r.secure_url);
    }
    res.json(output);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
