/**
 * GET /api/cloudinary/signature
 * Returns a signed payload the browser can use to upload directly to
 * Cloudinary (standard "signed upload" pattern) without ever exposing the
 * API secret client-side. If Cloudinary isn't configured, returns 501 with
 * a clear message — the front end should then just keep using the static
 * image URLs already in business.config.js.
 */
const express = require("express");
const crypto = require("crypto");

module.exports = function (env) {
  const router = express.Router();

  router.get("/signature", (req, res) => {
    if (!env.hasCloudinary) {
      return res.status(501).json({
        message: "Cloudinary isn't configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET to .env.local to enable uploads.",
      });
    }

    const timestamp = Math.round(Date.now() / 1000);
    const paramsToSign = { timestamp, folder: req.query.folder || "business-template" };

    const toSign = Object.keys(paramsToSign)
      .sort()
      .map((key) => `${key}=${paramsToSign[key]}`)
      .join("&");

    const signature = crypto
      .createHash("sha1")
      .update(toSign + process.env.CLOUDINARY_API_SECRET)
      .digest("hex");

    res.json({
      timestamp,
      signature,
      apiKey: process.env.CLOUDINARY_API_KEY,
      cloudName: process.env.CLOUDINARY_CLOUD_NAME,
      folder: paramsToSign.folder,
    });
  });

  return router;
};
