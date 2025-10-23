const Semester = require("../models/Semester");
const CourseClass = require("../models/CourseClass");

exports.createSemester = async (req, res) => {
    try {
        const semester = new Semester(req.body);
        await semester.save();
        res.status(201).json(semester);
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({ message: messages.join(" ") });
        }
        if (err.code === 11000) {
            return res
                .status(400)
                .json({ message: "Học kỳ này trong năm học đã tồn tại." });
        }
        res.status(500).json({ message: "Đã xảy ra lỗi hệ thống." });
    }
};

exports.getSemesters = async (req, res) => {
    try {
        const semesters = await Semester.find();
        res.json(semesters);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy danh sách kỳ học. Vui lòng thử lại sau.",
        });
    }
};

exports.getSemesterById = async (req, res) => {
    try {
        const semester = await Semester.findById(req.params.id);
        if (!semester)
            return res.status(404).json({ message: "Không tìm thấy kỳ học." });
        res.json(semester);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy thông tin kỳ học. Vui lòng thử lại sau.",
        });
    }
};

exports.updateSemester = async (req, res) => {
    try {
        const semester = await Semester.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!semester)
            return res.status(404).json({ message: "Không tìm thấy học kỳ." });
        res.json(semester);
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({ message: messages.join(" ") });
        }
        if (err.code === 11000) {
            return res
                .status(400)
                .json({ message: "Học kỳ này trong năm học đã tồn tại." });
        }
        res.status(500).json({ message: "Đã xảy ra lỗi hệ thống." });
    }
};

exports.deleteSemester = async (req, res) => {
    try {
        // Kiểm tra xem có lớp học phần nào đang sử dụng học kỳ này không
        const courseClasses = await CourseClass.find({
            semester: req.params.id,
        });
        if (courseClasses.length > 0) {
            return res.status(400).json({
                message: `Không thể xóa học kỳ này vì có ${courseClasses.length} lớp học phần đang sử dụng. Vui lòng xóa các lớp học phần trước.`,
            });
        }

        const semester = await Semester.findByIdAndDelete(req.params.id);
        if (!semester)
            return res.status(404).json({ message: "Không tìm thấy kỳ học." });
        res.json({ message: "Đã xóa kỳ học thành công." });
    } catch (err) {
        res.status(500).json({
            message: "Không thể xóa kỳ học. Vui lòng thử lại sau.",
        });
    }
};
