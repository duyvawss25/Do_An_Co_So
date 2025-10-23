const Course = require("../models/Course");
const CourseClass = require("../models/CourseClass");

exports.createCourse = async (req, res) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json(course);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.code) {
            return res.status(400).json({ message: "Mã học phần đã tồn tại." });
        }
        res.status(400).json({
            message:
                err.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
    }
};

exports.getCourses = async (req, res) => {
    try {
        const courses = await Course.find();
        res.json(courses);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy danh sách học phần. Vui lòng thử lại sau.",
        });
    }
};

exports.getCourseById = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course)
            return res
                .status(404)
                .json({ message: "Không tìm thấy học phần." });
        res.json(course);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy thông tin học phần. Vui lòng thử lại sau.",
        });
    }
};

exports.updateCourse = async (req, res) => {
    try {
        const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!course)
            return res
                .status(404)
                .json({ message: "Không tìm thấy học phần." });
        res.json(course);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.code) {
            return res.status(400).json({ message: "Mã học phần đã tồn tại." });
        }
        res.status(400).json({
            message:
                err.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
    }
};

exports.deleteCourse = async (req, res) => {
    try {
        // Kiểm tra xem có lớp học phần nào đang sử dụng course này không
        const courseClasses = await CourseClass.find({ course: req.params.id });
        if (courseClasses.length > 0) {
            return res.status(400).json({
                message: `Không thể xóa học phần này vì có ${courseClasses.length} lớp học phần đang sử dụng. Vui lòng xóa các lớp học phần trước.`,
            });
        }

        const course = await Course.findByIdAndDelete(req.params.id);
        if (!course)
            return res
                .status(404)
                .json({ message: "Không tìm thấy học phần." });
        res.json({ message: "Đã xóa học phần thành công." });
    } catch (err) {
        res.status(500).json({
            message: "Không thể xóa học phần. Vui lòng thử lại sau.",
        });
    }
};
