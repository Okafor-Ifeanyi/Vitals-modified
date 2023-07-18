const cloudinary = require('cloudinary').v2
require('dotenv').config()

// Get the Cloudinary credentials
exports.storeImage = async (img_path) => {
    cloudinary.config ({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });
        //Get file from request
        const sourceFile = img_path
        
        // Get the secure URL of the uploaded file
        // Upload the file to Cloudinary
        const response = await cloudinary.uploader.upload(sourceFile, { resource_type : 'auto'});
    
        const secureUrl = response.secure_url;
    
        return secureUrl
}
