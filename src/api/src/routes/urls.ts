import express, { Request } from "express";
import mongoose from "mongoose";
import { UrlItemModel } from "../models/urlItem";

const router = express.Router();

/**
 * Receives a url, processes it, and stores it.
 */
router.post("/", async (req, res) => {
    try {

        const { url } = req.body;
        const hashedUrl = "hashedUrl";

        let urlItem = new UrlItemModel({
            url: url,
            shortUrl: hashedUrl
        });
        urlItem = await urlItem.save();

        res.setHeader("location", `${req.protocol}://${req.get("Host")}/shorturl/${urlItem.id}`);
        res.status(201).json(urlItem);
    }
    catch (err: any) {
        switch (err.constructor) {
        case mongoose.Error.CastError:
        case mongoose.Error.ValidationError:
            return res.status(400).json(err.errors);
        default:
            throw err;
        }
    }
});


export default router;