import path from "path";
import express from "express";
import multer from "multer";
const router = express.Router();

const storage = multer.diskStorage({
  //destination where we want to store the file
  // we call the callback(cb) null if there is no error and add where we want to upload /uploads
  destination(req, file, cb) {
    cb(null, "uploads/");
  },
  //filename- we can change the name of the uploaded file
  // we call the callback(cb) null if there is no error
  // we pass the file name this will store the uploaded file with the custom name
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
      // ${path.extname(file.originalname) - pulls the extension name of the passed file name
    );
  },
});
// custom helper function to check the file type in fileFilter
function checkFileType(file, cb) {
  const filetypes = /jpg|jpeg|png/;
  //   check the filename that is passed in
  //   path.extname - (method on path object)
  //extname will return true or false based on the expression
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  //   check mimetype - file.mimetype should be /jpg|jpeg|png/
  const mimetype = filetypes.test(file.mimetype);
  //if file is not image type we return a call back with a error message
  if (extname && mimetype) {
    return cb(null, true);
  } else {
    return cb("Images Only");
  }
}
// upload file using multer
// fileFilter-do a check to save only image files
const upload = multer({
  storage,
  fileFilter: function (req, file, cb) {
    // validate the type of upload
    checkFileType(file, cb);
  },
});
// endpoint-api/uploads
// upload a single image
router.post("/", upload.single("image"), (req, res) => {
  // in response we will send the path, And then on the front end we can set it to set it to this image piece of our state and it'll go in the db
  res.send(`/${req.file.path}`);
});
export default router;
