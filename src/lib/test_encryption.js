const { encrypt, decrypt } = require('./encryption');

function testEncryption() {
    process.env.ENCRYPTION_KEY = 'test-key-32-chars-long-for-verif!';
    const originalText = 'secret-password-123';
    console.log('Original Text:', originalText);

    const encryptedText = encrypt(originalText);
    console.log('Encrypted Text:', encryptedText);

    if (!encryptedText.includes(':')) {
        throw new Error('Encryption format invalid: Missing separator');
    }

    const decryptedText = decrypt(encryptedText);
    console.log('Decrypted Text:', decryptedText);

    if (originalText === decryptedText) {
        console.log('✅ Encryption round-trip successful!');
    } else {
        console.error('❌ Encryption round-trip failed!');
        process.exit(1);
    }
}

try {
    testEncryption();
} catch (error) {
    console.error('Error during test:', error);
    process.exit(1);
}
