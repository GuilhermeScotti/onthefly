import passport from "passport";
import express from "express";

const router = express.Router();

router.get("/login/success", (req, res) => {
  if (req.user) {
    res.status(200).json({ success: true, user: req.user });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({ success: true, message: "failure" });
});

router.get("/logout", (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(error);
    }

    req.session.destroy((err) => {
      res.clearCookie("connect.sid");
      res.json({ status: "logout", user: {} });
    });
  });
});

router.get(
  "/github",
  passport.authenticate("github", {
    scope: ["read:user"],
  }),
);

router.get(
  "/github/callback",
  passport.authenticate("github", {
    successRedirect: "https://onthefly-client-production.up.railway.app/",
    failureRedirect: "https://onthefly-client-production.up.railway.app/",
  }),
);

export default router;
