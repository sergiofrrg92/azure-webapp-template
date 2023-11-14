import mongoose, { Schema } from "mongoose";

export type UrlItem = {
    id: mongoose.Types.ObjectId
    url: string
    shortUrl: string
    createdDate?: Date
    updatedDate?: Date
}

const schema = new Schema({
    url: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    }
}, {
    timestamps: {
        createdAt: "createdDate",
        updatedAt: "updatedDate"
    }
});

export const UrlItemModel = mongoose.model<UrlItem>("UrlItem", schema, "UrlItem");