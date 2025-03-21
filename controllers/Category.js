const Category = require("../models/category");

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required!"
            });
        }

        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });

        return res.status(200).json({
            success: true,
            message: "Category created successfully."
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Category creation failed."
        });
    }
};

exports.showAllCategories = async (req, res) => {
    try {
        const allCategories = await Category.find({}, { name: true, description: true });

        return res.status(200).json({
            success: true,
            data: allCategories,
            message: "Categories retrieved successfully."
        });
    } catch (e) {
        console.log(e);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve categories."
        });
    }
};
