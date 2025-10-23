const mongoose = require("mongoose");

const semesterSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Tên học kỳ là bắt buộc."],
            enum: {
                values: ["Học kì 1", "Học kì 2", "Học kì 3"],
                message: "{VALUE} không phải là học kỳ hợp lệ.",
            },
        },
        year: {
            type: String,
            required: [true, "Năm học là bắt buộc."],
            validate: {
                validator: function (v) {
                    const yearRegex = /^(\d{4})-(\d{4})$/;
                    if (!yearRegex.test(v)) {
                        return false;
                    }
                    const [startYear, endYear] = v.split("-").map(Number);
                    return endYear === startYear + 1;
                },
                message: (props) =>
                    `${props.value} không phải là định dạng năm học hợp lệ (ví dụ: 2023-2024).`,
            },
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
    { timestamps: true }
);

// Đảm bảo mỗi học kỳ trong một năm là duy nhất
semesterSchema.index({ name: 1, year: 1 }, { unique: true });

module.exports = mongoose.model("Semester", semesterSchema);
