const express = require('express');
const passport = require('passport');
const router = express.Router()
const userController = require('../controllers/users_controller');
const resetPass = require('../controllers/resetPass_controller');
router.get('/profile/:id',passport.checkAuthentication,userController.profile);
router.get('/signin',userController.signIn);
router.get('/signup',userController.signUp);
router.post('/create',userController.create);
//use passport as a middleware to auth
router.post('/create_session',passport.authenticate(
    'local',
    {failureRedirect : '/users/signin'}
),userController.createSession);
router.get('/signout',userController.signout);
router.post('/editinfo/:id',passport.checkAuthentication,userController.editInfo);
router.get('/reset',resetPass.reset);
router.get('/reset-password/:key',resetPass.resetPassword);
router.post('/reset-form',resetPass.resetForm);
router.post('/reset-password-form/:key',resetPass.resetPasswordForm);
router.get('/follow',passport.checkAuthentication,userController.follow);
// router.post('/reset_password')

router.get('/auth/google',passport.authenticate('google', { scope: ['profile','email'] }));
router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/signin' }),userController.createSession);
router.post('/auth/google',passport.authenticate('google', { scope: ['profile','email'] }));
router.post('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/users/signin' }),userController.createSession);

module.exports = router