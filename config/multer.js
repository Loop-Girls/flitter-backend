const multer = require('multer');
const path = require('path');

// const storage = multer({dest:  path.join(__dirname, '..', '/public/images/flits'),
//  });

 var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,  path.join(__dirname, '..', '/public/images/flits'))
      },
      filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)) //Appending extension
      }
  })
  
  var upload = multer({ storage: storage })


module.exports = upload;