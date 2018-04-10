module.exports = {
  aws: {
    service: process.env.SERVERLESS_SERVICE || 'digital-cart-checkout',
    region: process.env.SERVERLESS_REGION || 'us-east-1',
    stage: process.env.SERVERLESS_STAGE || 'development'
  },
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
