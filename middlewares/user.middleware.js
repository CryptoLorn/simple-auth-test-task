const ApiError = require('../error/apiError');
const {userService} = require('../services/user.service');
const {EMAIL_REGEX, PHONE_REGEX} = require('../constants/regex.enum');
const {tokenService} = require('../services/token.service');

const userMiddleware = {
    checkIsBodyValid: async (req, res, next) => {
        try {
            const {id, password} = req.body;

            if (!id || !password) {
                return next(ApiError.badRequest('Invalid id or password'));
            }

            let isEmail = EMAIL_REGEX.test(id);
            let isPhoneNumber = PHONE_REGEX.test(id);

            if (!isEmail && !isPhoneNumber) {
                return next(ApiError.badRequest('Id must be email or phone number'));
            }

            next();
        } catch (e) {
            return next(ApiError.badRequest('Invalid id or password'));
        }
    },

    checkIsIdUnique: async (req, res, next) => {
        try {
            const {id} = req.body;

            const user = await userService.findById(id);

            if (user) {
                return next(ApiError.badRequest(`user with id ${id} is already exist`));
            }

            next();
        } catch (e) {
            return next(ApiError.badRequest('user with id is already exist'));
        }
    },

    checkIsAuth: async (req, res, next) => {
        try {
            const token = req.headers.authorization.split(' ')[1];

            if (!token) {
                return next(ApiError.badRequest('Unauthorized'));
            }

            const tokenData = tokenService.checkIsTokenValid(token);

            if (!tokenData) {
                return next(ApiError.badRequest('Unauthorized'));
            }

            req.token = token;
            req.tokenData = tokenData;
            next();
        } catch (e) {
            return next(ApiError.badRequest('Unauthorized'));
        }
    },

    checkIsTokenBelongToUser: async (req, res, next) => {
        try {
            const {id} = req.body;
            const tokenData = req.tokenData;

            const user = await userService.findById(id);

            if (!user) {
                return next(ApiError.badRequest('Not found user with this id'));
            }

            if (tokenData.id !== user.id) {
                return next(ApiError.badRequest('Token not valid for this user'));
            }

            req.user = user;
            next();
        } catch (e) {
            return next(ApiError.badRequest('Token not valid for this user'));
        }
    },

    refreshToken: async (req, res, next) => {
        try {
            const tokenData = req.tokenData;

            const token = tokenService.generateJwt({id: tokenData.id});
            await tokenService.saveToken({...token, userId: tokenData.id});

            next();
        } catch (e) {
            next(e);
        }
    }
};

module.exports = {userMiddleware};