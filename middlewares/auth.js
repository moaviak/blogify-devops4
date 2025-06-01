import { validateToken } from "../services/authentication.js";

function checkAuth(req, res, next) {
  const tokenCookie = req.cookies?.token;

  if (!tokenCookie) return res.redirect("/user/signin");

  try {
    const userPayload = validateToken(tokenCookie);
    if (!userPayload) {
      return res.redirect("/user/signin");
    }
    req.user = userPayload;
    next();
  } catch (error) {
    return res.redirect("/user/signin");
  }
}

export default checkAuth;
