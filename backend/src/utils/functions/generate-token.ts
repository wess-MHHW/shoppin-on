import jwt from "jsonwebtoken";

export default function generateToken(id: string) {
  return jwt.sign({ id }, process.env.SECRET_STRING!, {
    expiresIn: process.env.JWT_EXPIRY,
  });
}
