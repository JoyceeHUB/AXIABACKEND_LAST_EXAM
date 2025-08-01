const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const {
  uploadSingle,
  uploadArray,
  uploadMultipleFields,
} = require("../controllers/uploadController");

router.post("/upload/single", upload.single("file"), uploadSingle);
router.post("/upload/array", upload.array("files", 5), uploadArray);
router.post(
  "/upload/multiple-fields",
  upload.fields([
    { name: "images", maxCount: 5 },
    { name: "documents", maxCount: 3 },
  ]),
  uploadMultipleFields
);

module.exports = router;
