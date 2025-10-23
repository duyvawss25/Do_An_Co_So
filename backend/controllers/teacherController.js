const Teacher = require("../models/Teacher");

exports.createTeacher = async (req, res) => {
    try {
        const teacher = new Teacher(req.body);
        await teacher.save();
        res.status(201).json({
            teacher,
            message: "Thêm giảng viên thành công!",
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const firstError = Object.values(err.errors)[0].message;
            return res.status(400).json({ message: firstError });
        }
        if (err.code === 11000) {
            return res
                .status(400)
                .json({ message: "Mã giảng viên đã tồn tại." });
        }
        res.status(500).json({ message: "Đã xảy ra lỗi hệ thống." });
    }
};

exports.getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find()
            .populate("department", "name shortName")
            .populate("degree", "name shortName");
        res.json(teachers);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy danh sách giáo viên. Vui lòng thử lại sau.",
        });
    }
};

exports.getTeacherById = async (req, res) => {
    try {
        const teacher = await Teacher.findById(req.params.id)
            .populate("department", "name shortName")
            .populate("degree", "name shortName");
        if (!teacher)
            return res
                .status(404)
                .json({ message: "Không tìm thấy giáo viên." });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy thông tin giáo viên. Vui lòng thử lại sau.",
        });
    }
};

exports.updateTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );
        if (!teacher)
            return res
                .status(404)
                .json({ message: "Không tìm thấy giảng viên." });
        res.json({ teacher, message: "Cập nhật giảng viên thành công!" });
    } catch (err) {
        if (err.name === "ValidationError") {
            const firstError = Object.values(err.errors)[0].message;
            return res.status(400).json({ message: firstError });
        }
        if (err.code === 11000) {
            return res
                .status(400)
                .json({ message: "Mã giảng viên đã tồn tại." });
        }
        res.status(500).json({ message: "Đã xảy ra lỗi hệ thống." });
    }
};

exports.deleteTeacher = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndDelete(req.params.id);
        if (!teacher)
            return res
                .status(404)
                .json({ message: "Không tìm thấy giáo viên." });
        res.json({ message: "Đã xóa giáo viên thành công." });
    } catch (err) {
        res.status(500).json({
            message: "Không thể xóa giáo viên. Vui lòng thử lại sau.",
        });
    }
};
