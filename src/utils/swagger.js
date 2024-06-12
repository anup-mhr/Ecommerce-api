const swaggerJsDoc = require("swagger-jsdoc");
const { version } = require("../../package.json");

const options = {
  definition: {
    openapi: "3.0.3",
    info: {
      title: "Ecommerce API Docs",
      version,
      description:
        "This is the api doc for the Ecommerce application- Task given by the Amnil in node intern",
    },
    components: {
      securitySchemes: {
        AdminKeyAuth: {
          type: "http",
          name: "Authorization",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
        UserKeyAuth: {
          type: "http",
          name: "Authorization",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        AdminKeyAuth: [],
        UserKeyAuth: [],
      },
    ],
    tags: [
      {
        name: "users",
        description: "Everything about Users",
        // externalDocs: {
        //   description: "Find out more",
        //   url: "http://swagger.io",
        // },
      },
      {
        name: "products",
        description: "Everything about products",
      },
      {
        name: "carts",
        description: "Everything about carts",
      },
      {
        name: "orders",
        description: "Everything about orders",
      },
      {
        name: "store",
        description: "Everything about store",
      },
      {
        name: "auction",
        description: "Everything about auctions",
      },
    ],
  },
  apis: ["../../app.js", "./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

// function swaggerDocs(app, port) {
//   //Swagger page
//   app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

//   //Gocs in JSON format
//   app.get("docs.json", (Request, Response) => {
//     Response.setHeader("Content-Type", "application/json");
//     Response.send(swaggerSpec);

//     logger.info(`Docs available at http://localhost:${port}/docs`);
//   });
// }

module.exports = swaggerSpec;
