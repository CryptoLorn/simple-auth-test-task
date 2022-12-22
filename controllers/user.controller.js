const {userService} = require('../services/user.service');
const {tokenService} = require('../services/token.service');

const userController = {
    registration: async (req, res, next) => {
        try {
            const {id, password} = req.body;

            const user = await userService.registration(id, password);
            const token = tokenService.generateJwt({id});
            await tokenService.saveToken({...token, userId: user.id});

            return res.json({...token});
        } catch (e) {
            next(e);
        }
    },

    login: async (req, res, next) => {
        try {
            const {password} = req.body;
            const user = req.user;

            await tokenService.comparePassword(password, user.password);

            return res.json(user);
        } catch (e) {
            next(e);
        }
    },

    getInfo: async (req, res, next) => {
        try {
            const users = await userService.findAll();

            return res.json(users);
        } catch (e) {
            next(e);
        }
    },

    logout: async (req, res, next) => {
        try {
            const {all} = req.query;
            const token = req.token;

            await tokenService.removeToken(token, all);

            return res.json('ok');
        } catch (e) {
            next(e);
        }
    }
};

module.exports = {userController};