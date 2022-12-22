const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const ApiError = require('../error/apiError');
const {Token} = require('../models/token.model');
const {SECRET_KEY} = require('../configs/config');

const tokenService = {
    generateJwt: (payload = {}) => {
        const token = jwt.sign(payload, SECRET_KEY, {expiresIn: '10m'});

        return {token};
    },

    comparePassword: async (password, hashPassword) => {
        const isPasswordSame = await bcrypt.compare(password, hashPassword);

        if (!isPasswordSame) {
            throw ApiError.badRequest('Invalid id or password');
        }
    },

    checkIsTokenValid: (token) => {
        try {
            return jwt.verify(token, SECRET_KEY);
        } catch (e) {
            throw ApiError.badRequest('Token not valid');
        }
    },

    saveToken: async (tokenInfo) => {
        const tokenData = await Token.findOne({where: {userId: tokenInfo.userId}});

        if (tokenData) {
            tokenData.token = tokenInfo.token;
            return tokenData.save();
        }

        return Token.create(tokenInfo);
    },

    removeToken: async (token, query) => {
        if (!query || query !== 'true' && query !== 'false') {
            throw ApiError.badRequest('Not valid query');
        }

        if (query === 'true') {
            await Token.destroy({where: {}});
        } else {
            await Token.destroy({where: {token}});
        }
    }
};

module.exports = {tokenService};