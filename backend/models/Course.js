const mongoose = require("mongoose");

const duplicateCheck = async function (model, field, value, idToExclude) {
    const query = { [field]: { $regex: new RegExp(`^${value}$`, "i") } };
    if (idToExclude) {
        query._id = { $ne: idToExclude };
    }
    const existing = await model.findOne(query);
    return existing;
};

const courseSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        name: {
            type: String,
            required: [true, "Tên học phần là bắt buộc."],
        },
        credits: { type: Number, required: true },
        totalLessons: { type: Number, required: true },
        description: { type: String },
    },
    { timestamps: true }
);

courseSchema.pre("save", async function (next) {
    if (this.isModified("name")) {
        const existing = await duplicateCheck(
            this.constructor,
            "name",
            this.name,
            this._id
        );
        if (existing) {
            return next(new Error(`Tên học phần "${this.name}" đã tồn tại.`));
        }
    }
    next();
});

courseSchema.pre("findOneAndUpdate", async function (next) {
    const docToUpdate = this.getUpdate();
    if (docToUpdate.name) {
        const existing = await duplicateCheck(
            this.model,
            "name",
            docToUpdate.name,
            this.getQuery()._id
        );
        if (existing) {
            return next(
                new Error(`Tên học phần "${docToUpdate.name}" đã tồn tại.`)
            );
        }
    }
    next();
});

module.exports = mongoose.model("Course", courseSchema);
