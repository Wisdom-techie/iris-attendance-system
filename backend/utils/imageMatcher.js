const sharp = require('sharp');

// Computes a 64-bit perceptual hash (dHash) from an image buffer
const computeHash = async (buffer) => {
  const { data } = await sharp(buffer)
    .resize(9, 8, { fit: 'fill' })
    .grayscale()
    .raw()
    .toBuffer({ resolveWithObject: true });

  let hash = '';
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const left = data[row * 9 + col];
      const right = data[row * 9 + col + 1];
      hash += left > right ? '1' : '0';
    }
  }
  return hash;
};

// Hamming distance between two equal-length binary strings
const hammingDistance = (hashA, hashB) => {
  let distance = 0;
  for (let i = 0; i < hashA.length; i++) {
    if (hashA[i] !== hashB[i]) distance++;
  }
  return distance;
};

// Returns similarity percentage (0-100) between two image buffers
const compareImages = async (bufferA, bufferB) => {
  const hashA = await computeHash(bufferA);
  const hashB = await computeHash(bufferB);
  const distance = hammingDistance(hashA, hashB);
  const similarity = ((64 - distance) / 64) * 100;
  return +similarity.toFixed(1);
};

module.exports = { computeHash, compareImages };