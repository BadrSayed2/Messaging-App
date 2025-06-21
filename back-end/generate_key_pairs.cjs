const { generateKeyPairSync } = require('crypto');
const fs = require('fs');

// Generate RSA key pair
const { publicKey, privateKey } = generateKeyPairSync('rsa', {
  modulusLength: 2048, // Key size
  publicKeyEncoding: {
    type: 'pkcs1', // "Public Key Cryptography Standards 1"
    format: 'pem', // PEM format
  },
  privateKeyEncoding: {
    type: 'pkcs1', // "Public Key Cryptography Standards 1"
    format: 'pem',
  },
});

// Save keys to files
fs.writeFileSync('private.pem', privateKey);
fs.writeFileSync('public.pem', publicKey);

console.log('Keys generated and saved to private.pem and public.pem');