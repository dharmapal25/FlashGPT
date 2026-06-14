const express = require('express');
const passport = require('passport');
const { userProfile } = require('../controllers/auth.controller');
const { isLoggedIn } = require('../middleware/auth.middleware');

const router = express.Router();
const frontendUrl = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
const isSecureCookie = frontendUrl.startsWith('https://');

router.get('/google',
  passport.authenticate('google', {
    scope: ['profile', 'email']
  })
);

router.get(
  '/google/callback',
  passport.authenticate('google', {
    failureRedirect: `${frontendUrl}/login`
  }),
  (req, res) => {

    console.log("SESSION ID AFTER LOGIN:", req.sessionID);
console.log("PASSPORT:", req.session.passport);

    req.session.save((err) => {
      if (err) {
        console.log(err);
        return res.redirect(`${frontendUrl}/login`);
      }

      return res.redirect(frontendUrl);
    });
  }
);

router.get('/profile', isLoggedIn, userProfile);

router.get('/logout', (req, res) => {
  req.logout(() => {

    req.session.destroy(() => {

      res.clearCookie('connect.sid', {
        httpOnly: true,
        secure: isSecureCookie,
        sameSite: isSecureCookie ? 'none' : 'lax'
      });

      res.json({
        success: true
      });

    });

  });
});

module.exports = router;
