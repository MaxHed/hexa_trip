const multer = require('multer');
const { StatusCodes } = require('http-status-codes');

const singleFileUploaderMiddleware = (req, res, next) => {
    const uploader = req.app.locals.uploader;
    
    const singleFileUploader = uploader.single("image");

    singleFileUploader(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                error: err.message
            });
        } else if (err) {
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
                error: err.message
            });
        }
        next();
    });
}

module.exports = singleFileUploaderMiddleware;