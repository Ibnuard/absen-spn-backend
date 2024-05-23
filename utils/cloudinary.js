const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "dx4b4m2n2",
  api_key: "383775295897749",
  api_secret: "31Y31nfL9xKoOVwV67rdadP3lLk",
});

async function uploadImagesCloudinary(base64) {
  try {
    const uploadResponse = await cloudinary.uploader.upload(
      `data:image/jpeg;base64,${base64}`,
      {
        folder: "absenspn",
        transformation: [{ quality: "auto:best" }, { fetch_format: "auto" }],
      }
    );
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  uploadImagesCloudinary,
};
