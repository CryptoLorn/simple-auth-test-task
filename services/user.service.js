const bcrypt = require('bcrypt');

const {User} = require('../models/user.model');
const {EMAIL_REGEX} = require('../constants/regex.enum');
const {EMAIL, PHONE} = require('../constants/typeId.enum');

const userService = {
    registration: async (id, password) => {
        let isEmail = EMAIL_REGEX.test(id);

        const hashPassword = await bcrypt.hash(password, 7);

        if (isEmail) {
            return await User.create({id, password: hashPassword, id_type: EMAIL});
        } else {
            return await User.create({id, password: hashPassword, id_type: PHONE});
        }
    },

    findById: async (id) => {
        return await User.findOne({where: {id}});
    },

    findAll: async () => {
        return await User.findAll();
    }
};

module.exports = {userService};