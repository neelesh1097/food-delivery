import type { Response } from "express";
import Restaurant from "../models/Restaurant.js";
import MenuItem from "../models/MenuItem.js";
import type { AuthRequest } from "../middleware/auth.js";

export const getAllRestaurants = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { search, cuisine } = req.query;
    let query: any = {};

    if (search) {
      query.$or = [
        { name: { $regex: String(search), $options: "i" } },
        { description: { $regex: String(search), $options: "i" } },
      ];
    }

    if (cuisine) {
      query.cuisine = { $in: [new RegExp(String(cuisine), "i")] };
    }

    const restaurants = await Restaurant.find(query).sort({ rating: -1 });
    res.status(200).json({ success: true, count: restaurants.length, data: restaurants });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRestaurantById = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      res.status(404).json({ success: false, message: "Restaurant not found" });
      return;
    }

    const menu = await MenuItem.find({ restaurantId: restaurant._id });
    res.status(200).json({ success: true, data: { ...restaurant.toObject(), menu } });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRestaurant = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, address, cuisine, imageUrl, deliveryTimeMins, minOrderAmount } = req.body;

    if (!name || !description || !address || !cuisine) {
      res.status(400).json({
        success: false,
        message: "name, description, address, and cuisine are required",
      });
      return;
    }

    const restaurant = new Restaurant({
      name,
      description,
      address,
      cuisine: Array.isArray(cuisine) ? cuisine : [cuisine],
      imageUrl,
      deliveryTimeMins,
      minOrderAmount,
      ownerId: req.user?.id,
    });

    await restaurant.save();
    res.status(201).json({ success: true, data: restaurant });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getMenuItems = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const menuItems = await MenuItem.find({ restaurantId: req.params.id });
    res.status(200).json({ success: true, count: menuItems.length, data: menuItems });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const addMenuItem = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    const { name, description, price, category, imageUrl, isVeg } = req.body;
    const restaurant = await Restaurant.findById(req.params.id);

    if (!restaurant) {
      res.status(404).json({ success: false, message: "Restaurant not found" });
      return;
    }

    const menuItem = new MenuItem({
      restaurantId: restaurant._id,
      name,
      description,
      price,
      category,
      imageUrl,
      isVeg,
    });

    await menuItem.save();
    res.status(201).json({ success: true, data: menuItem });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Seed demo data route
export const seedDemoData = async (
  _req: AuthRequest,
  res: Response
): Promise<void> => {
  try {
    await Restaurant.deleteMany({});
    await MenuItem.deleteMany({});

    const sampleRestaurants = [
      {
        name: "Spice Garden",
        description: "Authentic North Indian curries, tandoori breads, and fragrant biryanis.",
        address: { street: "123 MG Road", city: "Bengaluru", state: "KA", zip: "560001" },
        cuisine: ["North Indian", "Biryani", "Mughlai"],
        rating: 4.8,
        numRatings: 340,
        imageUrl: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
        isOpen: true,
        deliveryTimeMins: 25,
        minOrderAmount: 150,
      },
      {
        name: "Bella Italia Trattoria",
        description: "Wood-fired artisanal pizzas, homemade fresh pasta, and classic tiramisu.",
        address: { street: "45 Church Street", city: "Bengaluru", state: "KA", zip: "560025" },
        cuisine: ["Italian", "Pizza", "Pasta"],
        rating: 4.6,
        numRatings: 210,
        imageUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80",
        isOpen: true,
        deliveryTimeMins: 35,
        minOrderAmount: 200,
      },
      {
        name: "Tokyo Ramen & Sushi Bar",
        description: "Rich tonkotsu broth ramen, fresh nigiri sushi rolls, and crispy gyoza.",
        address: { street: "78 Indiranagar 100ft Rd", city: "Bengaluru", state: "KA", zip: "560038" },
        cuisine: ["Japanese", "Sushi", "Asian"],
        rating: 4.9,
        numRatings: 490,
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80",
        isOpen: true,
        deliveryTimeMins: 30,
        minOrderAmount: 250,
      },
      {
        name: "Burger Craft",
        description: "Gourmet smashed beef & crispy chicken burgers with seasoned curly fries.",
        address: { street: "12 Koramangala 5th Block", city: "Bengaluru", state: "KA", zip: "560095" },
        cuisine: ["Burgers", "American", "Fast Food"],
        rating: 4.5,
        numRatings: 180,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
        isOpen: true,
        deliveryTimeMins: 20,
        minOrderAmount: 100,
      },
    ];

    const createdRestaurants = await Restaurant.insertMany(sampleRestaurants);

    // Menu items for Spice Garden
    const spiceGardenMenu = [
      {
        restaurantId: createdRestaurants[0]?._id,
        name: "Butter Chicken",
        description: "Tender chicken cooked in a rich, buttery tomato sauce with aromatic fenugreek.",
        price: 340,
        category: "Main Course",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&w=600&q=80",
      },
      {
        restaurantId: createdRestaurants[0]?._id,
        name: "Paneer Tikka Masala",
        description: "Grilled cottage cheese cubes simmered in spiced onion-tomato gravy.",
        price: 290,
        category: "Main Course",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1567184109191-3783b879c8d1?auto=format&fit=crop&w=600&q=80",
      },
      {
        restaurantId: createdRestaurants[0]?._id,
        name: "Garlic Butter Naan",
        description: "Traditional clay-oven flatbread topped with minced garlic and melted butter.",
        price: 65,
        category: "Breads",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=600&q=80",
      },
    ];

    // Menu items for Bella Italia
    const bellaMenu = [
      {
        restaurantId: createdRestaurants[1]?._id,
        name: "Margherita Pizza",
        description: "San Marzano tomato sauce, fresh buffalo mozzarella, and fragrant basil leaves.",
        price: 380,
        category: "Pizza",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&w=600&q=80",
      },
      {
        restaurantId: createdRestaurants[1]?._id,
        name: "Creamy Truffle Fettuccine",
        description: "Handmade fettuccine ribbons tossed in wild mushroom truffle cream sauce.",
        price: 450,
        category: "Pasta",
        isVeg: true,
        imageUrl: "https://images.unsplash.com/photo-1621996346565-e3d5d6281298?auto=format&fit=crop&w=600&q=80",
      },
    ];

    // Menu items for Tokyo Ramen
    const tokyoMenu = [
      {
        restaurantId: createdRestaurants[2]?._id,
        name: "Tonkotsu Chashu Ramen",
        description: "12-hour simmered pork broth, springy noodles, chashu pork belly, seasoned soft-boiled egg.",
        price: 480,
        category: "Ramen",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=600&q=80",
      },
      {
        restaurantId: createdRestaurants[2]?._id,
        name: "Salmon Avocado Roll",
        description: "Fresh Atlantic salmon, ripe avocado, sushi rice rolled in crispy nori.",
        price: 420,
        category: "Sushi",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=600&q=80",
      },
    ];

    // Menu items for Burger Craft
    const burgerMenu = [
      {
        restaurantId: createdRestaurants[3]?._id,
        name: "Classic Smash Double Cheeseburger",
        description: "Two crispy-edged smashed beef patties, American cheddar, secret sauce, pickles on a brioche bun.",
        price: 320,
        category: "Burgers",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
      },
      {
        restaurantId: createdRestaurants[3]?._id,
        name: "Crispy Peri-Peri Chicken Burger",
        description: "Buttermilk fried chicken breast, spicy peri-peri mayo, crunchy cabbage slaw.",
        price: 290,
        category: "Burgers",
        isVeg: false,
        imageUrl: "https://images.unsplash.com/photo-1625813506062-0aeb1d7a094b?auto=format&fit=crop&w=600&q=80",
      },
    ];

    await MenuItem.insertMany([
      ...spiceGardenMenu,
      ...bellaMenu,
      ...tokyoMenu,
      ...burgerMenu,
    ]);

    res.status(200).json({
      success: true,
      message: "Seeded 4 restaurants with full menus successfully!",
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};
