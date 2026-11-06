import { PutObjectCommand } from "@aws-sdk/client-s3";
import { s3 } from "./s3.js";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { createLogger } from "../../../shared/logger/logger.js";

const logger = createLogger("storage-upload");

export const uploadToS3 = async (buffer, fileName, contentType) => {
  const hasAws =
    process.env.AWS_BUCKET_NAME &&
    process.env.AWS_ACCESS_KEY_ID &&
    !process.env.AWS_ACCESS_KEY_ID.includes("your_");

  if (hasAws) {
    try {
      await s3.send(
        new PutObjectCommand({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: fileName,
          Body: buffer,
          ContentType: contentType,
        })
      );
      logger.info(`Uploaded file to AWS S3: ${fileName}`);
      return fileName;
    } catch (err) {
      logger.warn("S3 upload failed, falling back to local storage", { error: err.message });
    }
  }

  // Resilient Local Storage Fallback
  try {
    let uploadDir = path.resolve(process.cwd(), "../../gateway/uploads/generated");
    try {
      await fs.mkdir(uploadDir, { recursive: true });
    } catch (mkdirErr) {
      uploadDir = path.join(os.tmpdir(), "zen-generated");
      await fs.mkdir(uploadDir, { recursive: true });
    }
    const targetPath = path.join(uploadDir, fileName);
    await fs.writeFile(targetPath, buffer);
    logger.info(`Saved generated file to storage: ${targetPath}`);
    return fileName;
  } catch (err) {
    logger.error("Failed to save generated file locally", { error: err.message });
    return fileName;
  }
};

export default uploadToS3;
