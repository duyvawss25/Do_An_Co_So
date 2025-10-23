const mongoose = require("mongoose");

const teacherSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true }, // mã số
        name: { type: String, required: true }, // họ tên
        dob: {
            // ngày sinh
            type: Date,
            required: true,
            validate: {
                validator: function (value) {
                    // Tính tuổi theo năm
                    const currentYear = new Date().getFullYear();
                    const birthYear = new Date(value).getFullYear();
                    const age = currentYear - birthYear;

                    return age >= 22;
                },
                message: "Giảng viên phải từ 22 tuổi trở lên.",
            },
        },
        phone: {
            type: String,
            validate: {
                validator: function (v) {
                    // Kiểm tra SĐT có 10 chữ số
                    return /^\d{10}$/.test(v);
                },
                message: (props) =>
                    `${props.value} không phải là số điện thoại hợp lệ! Phải có 10 chữ số.`,
            },
        },
        email: {
            type: String,
            match: [/\S+@\S+\.\S+/, "Địa chỉ email không hợp lệ."],
        },
        department: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Department",
            required: true,
        },
        degree: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Degree",
            required: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Teacher", teacherSchema);
