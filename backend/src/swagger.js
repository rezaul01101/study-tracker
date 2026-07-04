const swaggerJSDoc = require("swagger-jsdoc");

const swaggerSpec = swaggerJSDoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Study Tracker API",
      version: "1.0.0",
      description: "API for the 6-month DSA / System Design / Project learning tracker.",
    },
    servers: [{ url: "http://localhost:4000" }],
  },
  apis: ["./src/routes/*.js"],
});

module.exports = swaggerSpec;
