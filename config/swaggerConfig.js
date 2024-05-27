const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Your API Documentation',
      version: '1.0.0',
      description: 'API documentation for your application',
    },
    servers: [
      {
        url: 'http://localhost:3000', 
      },
    ],
  },
  apis: ['./routes/*.js', './model/*.js'],
};

const swaggerSpec = swaggerJSDoc(options);

module.exports = swaggerSpec;
