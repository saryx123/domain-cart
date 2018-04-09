module.exports = {
  hippo: {
    base: 'http://localhost:8080',
    context: 'site',
    binaries: 'binaries'
  },
  crewbot: {
    base: 'http://nyc-cbmweb-d10:3001'
  },
  jcrew: {
    base: 'https://www.jcrew.com'
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'jcrew secret'
  }
}
