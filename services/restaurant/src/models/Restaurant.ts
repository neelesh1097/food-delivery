import mongoose, { Schema, Document } from "mongoose";

export interface IRestaurant extends Document {
  name: string;
  description: string;
  address: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  cuisine: string[];
  rating: number;
  numRatings: number;
  imageUrl: string;
  isOpen: boolean;
  deliveryTimeMins: number;
  minOrderAmount: number;
  ownerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const restaurantSchema: Schema<IRestaurant> = new Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String, required: true },
    },
    cuisine: [{ type: String, required: true }],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    numRatings: { type: Number, default: 0 },
    imageUrl: {
      type: String,
      default:
        "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
    },
    isOpen: { type: Boolean, default: true },
    deliveryTimeMins: { type: Number, default: 30 },
    minOrderAmount: { type: Number, default: 0 },
    ownerId: { type: String },
  },
  { timestamps: true }
);

const Restaurant = mongoose.model<IRestaurant>("Restaurant", restaurantSchema);
export default Restaurant;
