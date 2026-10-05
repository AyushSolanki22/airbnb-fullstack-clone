const fs = require("fs");
const path = require("path");

const uploadDirectory = path.join(
  __dirname,
  "../uploads"
);

const deleteFile = async (filename) => {
  if (!filename) {
    return;
  }

  // Prevent path traversal
  const safeFilename = path.basename(filename);

  const filePath = path.join(
    uploadDirectory,
    safeFilename
  );

  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    // File may already be deleted
    if (error.code !== "ENOENT") {
      throw error;
    }
  }
};

module.exports = {
  deleteFile
};