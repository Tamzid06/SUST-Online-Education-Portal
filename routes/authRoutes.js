const { Router } = require("express");
const authController = require("../controllers/authController");
const { requireAuth,checkUser } = require("../middleware/authMiddleware");

const router = Router();

router.get("/signup", authController.signup_get);
router.post("/signup", authController.signup_post);
router.get("/index", authController.login_get);
router.post("/index", authController.login_post);
router.get("/logout", authController.logout_get);
router.get('/profileUpdate',requireAuth, authController.profile_get);
router.post('/profileUpdate', authController.profile_post);

router.get('/comments/create',authController.comment_create);
router.get('/comments',authController.comments_get);
router.post('/comments',authController.comments_post);

router.get('/comments/:id', authController.comments_delete);
router.delete('/comments/:id', authController.comments_delete_2);

router.get('/playlist',requireAuth,checkUser, authController.videos_get);

module.exports = router;
