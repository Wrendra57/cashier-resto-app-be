module.exports = {
    definition: {
        openapi: "3.0.0",
        info: {
            title: "Restaurant App API",
            version: "1.0.0",
            description: "Restaurant App API"
        },
        externalDocs: {
            description: "Find out more",
            url: "https://swagger.io"
        },
        servers: [
            {
                url: `http://localhost:${process.env.PORT || 8080}`,
                description: "Local server"
            }
        ]
    },
    apis:['./**/*.yaml'],
}