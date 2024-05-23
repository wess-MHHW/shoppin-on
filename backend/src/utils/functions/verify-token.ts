import jwt from "jsonwebtoken";

export default function generateToken(token: string) {
  return jwt.verify(token, process.env.SECRET_STRING!);
}
