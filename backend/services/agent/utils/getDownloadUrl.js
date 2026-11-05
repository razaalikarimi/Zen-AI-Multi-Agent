import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "./s3.js";

export const getDownloadUrl = async (fileName, expiresIn = 3600) => {
  const hasAws =
    process.env.AWS_BUCKET_NAME &&
    process.env.AWS_ACCESS_KEY_ID &&
    !process.env.AWS_ACCESS_KEY_ID.includes("your_");

  if (hasAws) {
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
      });
      return await getSignedUrl(s3, command, { expiresIn });
    } catch (e) {
      // Fallback
    }
  }

  const gatewayUrl = process.env.GATEWAY_URL || "http://localhost:5000";
  return `${gatewayUrl}/uploads/generated/${fileName}`;
};

export default getDownloadUrl;
