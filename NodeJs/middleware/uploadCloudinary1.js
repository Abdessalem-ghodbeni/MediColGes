const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: "duijyk2qg",
  api_key: "663346463281337",
  api_secret: "0pQ8SbDV20Ku9qfM0-c2A6F6gBs",
  secure: true,
});

module.exports = {
    uploadFile: async (filePath) => {
        try {
            const result = await cloudinary.uploader.upload(filePath);
            return result;
        } catch (error) {
            console.error(error.message);
            throw error;
        }
    }
};