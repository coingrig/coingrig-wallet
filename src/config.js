const CONFIG = {};

process.env.TESTNET = true;

CONFIG.APP_VERSION = '1.0 (21)';
CONFIG.TESTNET = process.env.TESTNET;
CONFIG.DEFAULT_DERIVATION_KEY = 0;
CONFIG.PIN_ANDROID_TIMEOUT = 180; // seconds

export default CONFIG;
