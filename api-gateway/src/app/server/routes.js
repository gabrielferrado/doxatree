const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const userController = require('../controllers/userController')
const preAuthMiddleware = require('../middlewares/preauth')
const authMiddleware = require('../middlewares/auth')

router.use(preAuthMiddleware)

/* AUTH ROUTES */
router.post('/oauth', authController.oauth)
router.post('/register', authController.register)
router.post('/authenticate', authController.login)
router.post('/forgotPassword', authController.forgotPassword)
router.post('/resetPassword', authController.resetPassword)

/* USER ROUTES */
router.patch('/validate', authMiddleware, userController.validate)
router.get('/sendValidation', authMiddleware, userController.sendValidation)
router.get('/user', authMiddleware, userController.getUser)
router.put('/user', authMiddleware, userController.updateUser)
/* USER PORTFOLIO ROUTES */
router.post('/user/portfolio', authMiddleware, userController.createPortfolio)
router.get('/user/portfolio', authMiddleware, userController.getPortfolio)
router.put('/user/portfolio', authMiddleware, userController.updatePortfolio)

// LOCKETS
router.post('/user/lockets', authMiddleware, userController.createLocket)

// ASSETS
router.get('/user/assets/:assetId', authMiddleware, userController.getAsset)
router.post('/user/assets', authMiddleware, userController.createAsset)
router.put('/user/assets', authMiddleware, userController.updateAsset)
router.delete('/user/assets', authMiddleware, userController.deleteAsset)

module.exports = (app) => app.use('/v1', router)
