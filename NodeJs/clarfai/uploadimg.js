const cloudinaryMiddleware = require('../middleware/uploadCloudinary1');

// Assuming you have the file path of the image
const filePath = './fffff.png';

// Call the uploadFile method with the file path
cloudinaryMiddleware.uploadFile(filePath)
  .then(result => {
    console.log('Image uploaded to Cloudinary:', result.secure_url);
    // Do something with the uploaded image URL
  })
  .catch(error => {
    console.error('Error uploading image to Cloudinary:', error);
    // Handle the error
  });
