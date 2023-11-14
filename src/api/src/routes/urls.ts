import express, { Request } from "express";
import mongoose from "mongoose";
import { UrlItemModel } from "../models/urlItem";
import { nanoid } from "nanoid";

const router = express.Router();

/**
 * Receives a url, processes it, and stores it.
 */
router.post("/", async (req, res) => {
    try {

        const { url } = req.body;
        const hashedUrl = nanoid(10);

        let urlItem = new UrlItemModel({
            url: url,
            shortUrl: hashedUrl
        });
        urlItem = await urlItem.save();

        res.setHeader("location", `${req.protocol}://${req.get("Host")}/shorturl/${urlItem.id}`);
        res.status(200).json(urlItem);
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

/**
 * Receives a short url, retrieves it, and returns the regular one it.
 */
router.get("/:shorturl", async (req, res) => {
    try {

        const url = await UrlItemModel
            .findOne({shortUrl: req.params.shorturl})
            .orFail()
            .exec();

        res.status(200).json(url);
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