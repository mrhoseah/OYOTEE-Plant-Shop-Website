import multer from  'multer'

const productStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/products/');
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
    }
  });

export const productImageUpload= multer({
    storage:productStorage,
    fileFilter: (req, file, cb) => {
      if (file.mimetype == "image/png" || file.mimetype == "image/jpg" || file.mimetype == "image/jpeg" || file.mimetype == "image/svg") {
        cb(null, true);
      } else {
        cb(null, false);
        return cb(new Error('Only .png, .jpg and .jpeg .svg format allowed!'));
      }
    }
  }).single('image');

const userStorage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, './public/avatars/');
    },
    filename: (req, file, cb) => {
      const fileName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, fileName)
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