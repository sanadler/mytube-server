'use strict';
module.exports = {
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
    PORT: process.env.PORT || 8080,
    DATABASE_URL: process.env.DATABASE_URL || 'mongodb://localhost/mytube-app',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'mongodb://localhost/test-mytube-app',
    JWT_SECRET: process.env.JWT_SECRET || 'JSON_DERULO',
    JWT_EXPIRY: process.env.JWT_EXPIRY || '7d'
};