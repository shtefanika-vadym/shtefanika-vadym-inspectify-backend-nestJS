export default {
  jwt: {
    secretOrKey: process.env.JWT_SECRET_KEY,
    expiresIn: '24h',
  },
}
