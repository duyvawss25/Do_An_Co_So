const mongoose = require("mongoose");
const Settings = require("./Settings");

const duplicateCheck = async function (model, field, value, idToExclude) {
    const query = { [field]: { $regex: new RegExp(`^${value}$`, "i") } };
    if (idToExclude) {
        query._id = { $ne: idToExclude };
    }
    const existing = await model.findOne(query);
    return existing;
};

const courseClassSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            comment: "Tham chiếu đến môn học",
        },
        semester: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Semester",
            required: true,
            comment: "Tham chiếu đến kỳ học",
        },
        teacher: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Teacher",
            required: true,
            comment: "Tham chiếu đến giảng viên",
        },
        type: {
            type: String,
            enum: ["normal", "special", "international"],
            default: "normal",
            comment: "Loại lớp: thường, chất lượng cao, quốc tế",
        },
        coefficient: {
            type: Number,
            required: true,
            min: 0,
            default: 1,
            comment: "Hệ số lớp (tự động tính theo loại lớp)",
        },
        code: { type: String, required: true, unique: true },
        name: {
            type: String,
            required: [true, "Tên lớp học phần là bắt buộc."],
        },
        studentCount: { type: Number, default: 0 },
    },
    { timestamps: true }
);

// Middleware để tự động tính hệ số lớp theo loại lớp
courseClassSchema.pre("save", async function (next) {
    try {
        // Lấy settings để tính hệ số
        const settings = await Settings.findOne();
        if (!settings) {
            // Nếu chưa có settings, sử dụng giá trị mặc định
            let coefficient = 1; // Lớp thường
            if (this.type === "special") {
                coefficient = 1.5; // Lớp chất lượng cao
            } else if (this.type === "international") {
                coefficient = 2; // Lớp quốc tế
            }
            this.coefficient = coefficient;
        } else {
            // Sử dụng hệ số từ settings
            this.coefficient = settings.classCoefficients[this.type] || 1;
        }

        // Kiểm tra trùng tên
        if (this.isModified("name")) {
            const existing = await duplicateCheck(
                this.constructor,
                "name",
                this.name,
                this._id
            );
            if (existing) {
                return next(
                    new Error(`Tên lớp học phần "${this.name}" đã tồn tại.`)
                );
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

courseClassSchema.pre("findOneAndUpdate", async function (next) {
    try {
        const docToUpdate = this.getUpdate();

        // Tính hệ số theo loại lớp nếu có thay đổi type
        if (docToUpdate.type) {
            const settings = await Settings.findOne();
            if (!settings) {
                // Nếu chưa có settings, sử dụng giá trị mặc định
                let coefficient = 1; // Lớp thường
                if (docToUpdate.type === "special") {
                    coefficient = 1.5; // Lớp chất lượng cao
                } else if (docToUpdate.type === "international") {
                    coefficient = 2; // Lớp quốc tế
                }
                docToUpdate.coefficient = coefficient;
            } else {
                // Sử dụng hệ số từ settings
                docToUpdate.coefficient =
                    settings.classCoefficients[docToUpdate.type] || 1;
            }
        }

        // Kiểm tra trùng tên
        if (docToUpdate.name) {
            const existing = await duplicateCheck(
                this.model,
                "name",
                docToUpdate.name,
                this.getQuery()._id
            );
            if (existing) {
                return next(
                    new Error(
                        `Tên lớp học phần "${docToUpdate.name}" đã tồn tại.`
                    )
                );
            }
        }
        next();
    } catch (error) {
        next(error);
    }
});

module.exports = mongoose.model("CourseClass", courseClassSchema);
