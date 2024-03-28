import multer from "multer";

const fileFilter = (req, file, cb) => {

  if (
    file.mimetype == "image/jpeg" ||
    file.mimetype == "image/jpg" ||
    file.mimetype == "image/png" ||
    file.mimetype == "image/gif" ||
    file.mimetype == "image/webp" ||
    file.mimetype == "image/avif" ||
    file.mimetype == "video/mp4" ||
    file.mimetype == "video/mov" ||
    file.mimetype == "video/avi" ||
    file.mimetype == "video/webm" ||
    file.mimetype == "video/flv"
  ) {
    cb(null, true);
  } else {
    const err = new multer.MulterError();
    err.code = "LIMIT_FILE_TYPE";
    err.message =
      "Only jpeg,  jpg , png, avif ,gif , mp4, mov, avi, webm, and flv Image allow";
    return cb(err, false);
  }
};

//file upload
const uploadFile = (path) => {
    const storage = multer.diskStorage({
      destination: function (req, file, cb) {
        cb(null, path);
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
      },
    });
    return multer({ storage: storage, fileFilter }).fields([
      { name: "image", maxCount: 1 },
      { name: "video", maxCount: 1 },
    ]);
  };
  
  export default uploadFile;
  
