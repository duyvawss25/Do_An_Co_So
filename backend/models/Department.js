const mongoose = require("mongoose");

// Helper function to check for duplicates
const duplicateCheck = async function (model, field, value, idToExclude) {
    const query = { [field]: { $regex: new RegExp(`^${value}$`, "i") } };
    if (idToExclude) {
        query._id = { $ne: idToExclude };
    }
    const existing = await model.findOne(query);
    return existing;
};

const departmentSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên khoa là bắt buộc."],
        },
        shortName: {
            type: String,
            required: [true, "Tên viết tắt là bắt buộc."],
        },
        description: { type: String },
    },
    { timestamps: true }
);

// Middleware to check for duplicates before saving
departmentSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const existing = await duplicateCheck(
            this.constructor,
            "name",
            this.name,
            this._id
        );
        if (existing) {
            return next(new Error(`Tên khoa "${this.name}" đã tồn tại.`));
        }
    }
    if (this.isModified("shortName")) {
        const existing = await duplicateCheck(
            this.constructor,
            "shortName",
            this.shortName,
            this._id
        );
        if (existing) {
            return next(
                new Error(`Tên viết tắt "${this.shortName}" đã tồn tại.`)
            );
        }
    }
    next();
});

// Middleware for updates
departmentSchema.pre("findOneAndUpdate", async function (next) {
    const docToUpdate = this.getUpdate();
    const model = this.model;
    const originalDocId = this.getQuery()._id;

    if (docToUpdate.name) {
        const existing = await duplicateCheck(
            model,
            "name",
            docToUpdate.name,
            originalDocId
        );
        if (existing) {
            return next(
                new Error(`Tên khoa "${docToUpdate.name}" đã tồn tại.`)
            );
        }
    }
    if (docToUpdate.shortName) {
        const existing = await duplicateCheck(
            model,
            "shortName",
            docToUpdate.shortName,
            originalDocId
        );
        if (existing) {
            return next(
                new Error(`Tên viết tắt "${docToUpdate.shortName}" đã tồn tại.`)
            );
        }
    }
    next();
});

module.exports = mongoose.model("Department", departmentSchema);
