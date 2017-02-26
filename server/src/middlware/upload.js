const multer = require('multer');
const uuid = require('uuid');
const path = require('path');
const appConfig = require('../../configs/app.conf');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, appConfig.static.uploadDist);
    },

    filename(req, file, cb) {
        const extension = path.extname(file.originalname);

        cb(null, `${file.fieldname}_${uuid()}${extension}`);
    },
});

const upload = multer({
    storage,
});

module.exports = upload;
