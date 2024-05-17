import swaggerJsDoc from "swagger-jsdoc";

const swaggerDefinition = {
    openapi: "3.0.0",
    info: {
        title: "Early Warning System API",
        version: "1.0.0",
        description:
            "This is the API documentation for the Early Warning System project",
    },
};

const options = {
    definition: swaggerDefinition,
    apis: ["./src/**/routes.ts"],     
};

const swaggerSpecs = swaggerJsDoc(options);
export default swaggerSpecs;
