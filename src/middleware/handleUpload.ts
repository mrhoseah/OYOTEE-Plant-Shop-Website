import multer from  'multer'
import path from 'path';

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images');
    },
    filename: function (req, file, callback) {
      callback(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);}
  });

  export const productImageUpload= multer({
    storage:productStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg" || file.mimetype == "image/webp") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg .svg format allowed!'));
      }
    }
  }).single("image");


const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/avatars');
    },
    filename: function (req, file, callback) {
      callback(null, `${new Date().getTime().toString()}-${file.fieldname}${path.extname(file.originalname)}`);
    } 
});

export const userAvatarUpload= multer({
    storage:userStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg .svg format allowed!'));
      }
    }
  }).single('avatar');