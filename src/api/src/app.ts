import express, { Express } from "express";
import cors from "cors";
import { getConfig } from "./config";
import urls from "./routes/urls";
import lists from "./routes/lists";
import items from "./routes/items";
import { configureMongoose } from "./models/mongoose";
import { observability } from "./config/observability";

// Use API_ALLOW_ORIGINS env var with comma separated urls like
// `http://localhost:300, http://otherurl:100`
// Requests coming to the api server from other urls will be rejected as per
// CORS.
const allowOrigins = process.env.API_ALLOW_ORIGINS + ", https://serg.life";

// Use NODE_ENV to change webConfiguration based on this value.
// For example, setting NODE_ENV=development disables CORS checking,
// allowing all origins.
const environment = process.env.NODE_ENV;

const originList = ():string[]|string => {
    
    if (environment && environment === "development") {
        console.log(`Allowing requests from any origins. NODE_ENV=${environment}`);
        return "*";
    }
    
    const origins = [
        "https://portal.azure.com",
        "https://ms.portal.azure.com",
    ];

    if (allowOrigins && allowOrigins !== "") {
        allowOrigins.split(",").forEach(origin => {
            origins.push(origin);
        });
    }

    return origins;
};

export const createApp = async (): Promise<Express> => {
    const config = await getConfig();
    const app = express();

    // Configuration
    observability(config.observability);
    await configureMongoose(config.database);
    // Middleware
    app.use(express.json());
    
    app.use(cors({
        origin: originList()
    }));

    // API Routes
    app.use("/shorturl", urls);
    // app.use("/lists/:listId/items", items);
    // app.use("/lists", lists);

    return app;
};
