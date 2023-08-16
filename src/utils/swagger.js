import swaggerJSDoc from "swagger-jsdoc";
import swaggerUiExpress from "swagger-ui-express";
const swaggerOptions = {
    definition: {
        openapi: "3.0.1",
        info: {
            title: "Documentación APIs Flykite",
            version: "1.0.0",
            description: "API",
            contact: {
                name: "Gabriel Jordán",
                url: "https://github.com/gjordanp",
                email: "gjordanp@gmail.com"
            }
        }
    },
    apis: [`${process.cwd()}/src/Docs/**/*.yaml`]
}

const specs= swaggerJSDoc(swaggerOptions);
export const serveSwagger=swaggerUiExpress.serve; 
export const setupSwagger=swaggerUiExpress.setup(specs);