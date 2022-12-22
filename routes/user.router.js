const Router = require('express');
const router = new Router();

const {userController} = require('../controllers/user.controller');
const {userMiddleware} = require('../middlewares/user.middleware');

router.post('/signin',
    userMiddleware.checkIsAuth,
    userMiddleware.checkIsTokenBelongToUser,
    userController.login
);
router.post('/signup',
    userMiddleware.checkIsBodyValid,
    userMiddleware.checkIsIdUnique,
    userController.registration
);

router.get('/info',
    userMiddleware.checkIsAuth,
    userMiddleware.refreshToken,
    userController.getInfo
);
router.get('/logout',
    userMiddleware.checkIsAuth,
    userController.logout
);

module.exports = router;