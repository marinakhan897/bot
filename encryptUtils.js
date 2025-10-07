const CryptoJS = require('crypto-js');
const fs = require('fs-extra');
const path = require('path');
const readline = require('readline');

class SecureConfig {
    constructor(masterPassword) {
        this.masterPassword = masterPassword;
        this.encryptedFile = path.join(__dirname, 'config.enc');
    }

    encryptData(data) {
        try {
            const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), this.masterPassword).toString();
            return encrypted;
        } catch (error) {
            throw new Error(`Encryption failed: ${error.message}`);
        }
    }

    decryptData(encryptedData) {
        try {
            const bytes = CryptoJS.AES.decrypt(encryptedData, this.masterPassword);
            const decrypted = bytes.toString(CryptoJS.enc.Utf8);
            if (!decrypted) {
                throw new Error('Invalid master password or corrupted data');
            }
            return JSON.parse(decrypted);
        } catch (error) {
            throw new Error(`Decryption failed: ${error.message}`);
        }
    }

    saveEncryptedConfig(service, account, apiKey) {
        try {
            const configData = {
                service: service,
                account: account,
                apiKey: apiKey,
                timestamp: new Date().toISOString(),
                encryptedBy: 'SecureConfig System'
            };

            const encrypted = this.encryptData(configData);
            
            const securePackage = {
                version: '1.0',
                encryptedData: encrypted,
                hash: CryptoJS.SHA256(encrypted + this.masterPassword).toString(),
                createdAt: new Date().toISOString()
            };

            fs.writeFileSync(this.encryptedFile, JSON.stringify(securePackage, null, 2));
            console.log('✅ Config encrypted and saved successfully!');
            console.log('📁 File: config.enc');
            
            return true;
        } catch (error) {
            console.error('❌ Error saving encrypted config:', error.message);
            return false;
        }
    }

    loadEncryptedConfig() {
        try {
            if (!fs.existsSync(this.encryptedFile)) {
                throw new Error('Encrypted config file not found');
            }

            const fileContent = fs.readFileSync(this.encryptedFile, 'utf8');
            const securePackage = JSON.parse(fileContent);
            
            // Verify integrity
            const expectedHash = CryptoJS.SHA256(securePackage.encryptedData + this.masterPassword).toString();
            if (expectedHash !== securePackage.hash) {
                throw new Error('Data integrity check failed - file may be corrupted');
            }

            const decryptedData = this.decryptData(securePackage.encryptedData);
            console.log('✅ Config decrypted successfully!');
            return decryptedData;
        } catch (error) {
            console.error('❌ Error loading encrypted config:', error.message);
            return null;
        }
    }
}

// SECURE INPUT METHOD - No API key in code
function getInputFromUser() {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        console.log('\n🔐 Secure Configuration Setup\n');
        
        rl.question('Enter your API Key: ', (apiKey) => {
            rl.question('Enter Service Name [CHABOT AL]: ', (service) => {
                rl.question('Enter Account Name [MARINA KHAN]: ', (account) => {
                    rl.close();
                    resolve({
                        apiKey: apiKey.trim(),
                        service: service.trim() || 'CHABOT AL',
                        account: account.trim() || 'MARINA KHAN'
                    });
                });
            });
        });
    });
}

async function createEncryptedFile() {
    try {
        const MASTER_PASSWORD = 'marina417268';
        
        // User se secure input le rahe hain
        const { apiKey, service, account } = await getInputFromUser();
        
        const secureConfig = new SecureConfig(MASTER_PASSWORD);
        
        console.log('\n🔐 Creating encrypted configuration file...');
        console.log(`👤 Account: ${account}`);
        console.log(`🔑 Service: ${service}`);
        
        const success = secureConfig.saveEncryptedConfig(service, account, apiKey);
        
        if (success) {
            console.log('\n📋 Verification:');
            const loadedConfig = secureConfig.loadEncryptedConfig();
            if (loadedConfig) {
                console.log('✅ Service:', loadedConfig.service);
                console.log('✅ Account:', loadedConfig.account);
                console.log('✅ API Key:', '••••••' + loadedConfig.apiKey.slice(-8));
                console.log('✅ Timestamp:', loadedConfig.timestamp);
                console.log('\n🚨 IMPORTANT: Your API key is now securely encrypted!');
            }
        }
    } catch (error) {
        console.error('❌ Error:', error.message);
    }
}

// Run the encryption
createEncryptedFile();

module.exports = SecureConfig;
