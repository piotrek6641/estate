import { Schema } from "mongoose";
import { IListing } from "@estates/types";

export const listingSchema = new Schema<IListing>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
});
