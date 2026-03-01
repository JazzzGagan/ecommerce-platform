import crypto from "crypto";

const generateEsewaSignature = (secretKey, message) => {
  return crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");
};

const buildEsewaSignatureString = ({
  totalAmount,
  transactionUuid,
  productCode,
}) => {
  return `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;
};

const verifyEsewaPayment = async ({
  baseUrl,
  productCode,
  totalAmount,
  transactionUuid,
}) => {
  const statusUrl = `${baseUrl}/api/epay/transaction/status/?product_code=${encodeURIComponent(productCode)}&total_amount=${encodeURIComponent(totalAmount)}&transaction_uuid=${encodeURIComponent(transactionUuid)}`;

  const response = await fetch(statusUrl, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`eSewa verification failed with status ${response.status}`);
  }

  return response.json();
};

export {
  generateEsewaSignature,
  buildEsewaSignatureString,
  verifyEsewaPayment,
};
