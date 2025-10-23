const mongoose = require("mongoose");

const duplicateCheck = async function (model, field, value, idToExclude) {
    const query = { [field]: { $regex: new RegExp(`^${value}$`, "i") } };
    if (idToExclude) {
        query._id = { $ne: idToExclude };
    }
    const existing = await model.findOne(query);
    return existing;
};

const degreeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên bằng cấp là bắt buộc."],
            comment: "Tên bằng cấp",
        },
        coefficient: {
            type: Number,
            required: true,
            min: 1,
            default: 1,
            comment: "Hệ số theo bằng cấp",
        },
        shortName: {
            type: String,
            required: [true, "Tên viết tắt là bắt buộc."],
        },
    },
    { timestamps: true }
);

degreeSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const existing = await duplicateCheck(
            this.constructor,
            "name",
            this.name,
            this._id
        );
        if (existing) {
            return next(new Error(`Tên bằng cấp "${this.name}" đã tồn tại.`));
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

degreeSchema.pre("findOneAndUpdate", async function (next) {
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
                new Error(`Tên bằng cấp "${docToUpdate.name}" đã tồn tại.`)
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

module.exports = mongoose.model("Degree", degreeSchema);
