const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema(
    {
        baseRate: {
            type: Number,
            required: true,
            min: 0,
            comment: "Định mức tiền cho một tiết chuẩn (VNĐ)",
        },
        classCoefficients: {
            normal: {
                type: Number,
                required: true,
                min: 0,
                default: 1.0,
                comment: "Hệ số lớp thường",
            },
            special: {
                type: Number,
                required: true,
                min: 0,
                default: 1.5,
                comment: "Hệ số lớp chất lượng cao",
            },
            international: {
                type: Number,
                required: true,
                min: 0,
                default: 2.0,
                comment: "Hệ số lớp quốc tế",
            },
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Settings", settingsSchema);
