import JWT from "jsonwebtoken";

const secret = "jfklajsdflka";

function createTokenForUser(user) {
  const payload = {
    _id: user._id,
    email: user.email,
    role: user.role,
    fullName: user.fullName,
    profileImageUrl: user.profileImageUrl,
  };

  return JWT.sign(payload, secret);
}

function validateToken(token) {
  try {
    const payload = JWT.verify(token, secret);
    return payload;
  } catch (error) {
    return null;
  }
}

export { createTokenForUser, validateToken };
