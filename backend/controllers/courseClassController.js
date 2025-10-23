const CourseClass = require("../models/CourseClass");
const mongoose = require("mongoose");

exports.createCourseClass = async (req, res) => {
    try {
        const courseClass = new CourseClass(req.body);
        await courseClass.save();
        res.status(201).json(courseClass);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.code) {
            return res
                .status(400)
                .json({ message: "Mã lớp học phần đã tồn tại." });
        }
        res.status(400).json({
            message:
                err.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
    }
};

exports.getCourseClasses = async (req, res) => {
    try {
        const courseClasses = await CourseClass.find()
            .populate("course", "code name credits totalLessons")
            .populate("semester", "name year startDate endDate")
            .populate("teacher", "code name");
        res.json(courseClasses);
    } catch (err) {
        res.status(500).json({
            message:
                "Không thể lấy danh sách lớp học phần. Vui lòng thử lại sau.",
        });
    }
};

exports.getCourseClassById = async (req, res) => {
    try {
        const courseClass = await CourseClass.findById(req.params.id)
            .populate("course", "code name credits totalLessons")
            .populate("semester", "name year startDate endDate")
            .populate("teacher", "code name");
        if (!courseClass)
            return res
                .status(404)
                .json({ message: "Không tìm thấy lớp học phần." });
        res.json(courseClass);
    } catch (err) {
        res.status(500).json({
            message:
                "Không thể lấy thông tin lớp học phần. Vui lòng thử lại sau.",
        });
    }
};

exports.updateCourseClass = async (req, res) => {
    try {
        const courseClass = await CourseClass.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        )
            .populate("course", "code name credits totalLessons")
            .populate("semester", "name year startDate endDate")
            .populate("teacher", "code name");
        if (!courseClass)
            return res
                .status(404)
                .json({ message: "Không tìm thấy lớp học phần." });
        res.json(courseClass);
    } catch (err) {
        if (err.code === 11000 && err.keyPattern.code) {
            return res
                .status(400)
                .json({ message: "Mã lớp học phần đã tồn tại." });
        }
        res.status(400).json({
            message:
                err.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
    }
};

exports.deleteCourseClass = async (req, res) => {
    try {
        const courseClass = await CourseClass.findByIdAndDelete(req.params.id);
        if (!courseClass)
            return res
                .status(404)
                .json({ message: "Không tìm thấy lớp học phần." });
        res.json({ message: "Đã xóa lớp học phần thành công." });
    } catch (err) {
        res.status(500).json({
            message: "Không thể xóa lớp học phần. Vui lòng thử lại sau.",
        });
    }
};

// Thống kê số lớp mở theo kỳ học cho một học phần cụ thể
exports.getStatsByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(courseId)) {
            return res.status(400).json({ error: "Course ID không hợp lệ." });
        }

        const stats = await CourseClass.aggregate([
            {
                $match: {
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $lookup: {
                    from: "semesters",
                    localField: "semester",
                    foreignField: "_id",
                    as: "semesterInfo",
                },
            },
            {
                $unwind: "$semesterInfo",
            },
            {
                $group: {
                    _id: "$semester",
                    semesterName: { $first: "$semesterInfo.name" },
                    semesterYear: { $first: "$semesterInfo.year" },
                    totalClasses: { $sum: 1 },
                    totalStudents: { $sum: "$studentCount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    semesterId: "$_id",
                    semesterName: 1,
                    semesterYear: 1,
                    totalClasses: 1,
                    totalStudents: 1,
                },
            },
            {
                $sort: { semesterYear: -1, semesterName: 1 },
            },
        ]);
        res.json(stats);
    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thống kê theo học phần:", err);
        res.status(500).json({ error: "Lỗi hệ thống: " + err.message });
    }
};

// Thống kê số lớp mở theo cả học kỳ và học phần
exports.getStatsBySemesterAndCourse = async (req, res) => {
    try {
        const { semesterId, courseId } = req.params;

        if (
            !mongoose.Types.ObjectId.isValid(semesterId) ||
            !mongoose.Types.ObjectId.isValid(courseId)
        ) {
            return res
                .status(400)
                .json({ error: "Semester ID hoặc Course ID không hợp lệ." });
        }

        const stats = await CourseClass.aggregate([
            {
                $match: {
                    semester: new mongoose.Types.ObjectId(semesterId),
                    course: new mongoose.Types.ObjectId(courseId),
                },
            },
            {
                $lookup: {
                    from: "semesters",
                    localField: "semester",
                    foreignField: "_id",
                    as: "semesterInfo",
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo",
                },
            },
            {
                $unwind: "$semesterInfo",
            },
            {
                $unwind: "$courseInfo",
            },
            {
                $group: {
                    _id: null,
                    semesterName: { $first: "$semesterInfo.name" },
                    semesterYear: { $first: "$semesterInfo.year" },
                    courseName: { $first: "$courseInfo.name" },
                    courseCode: { $first: "$courseInfo.code" },
                    totalClasses: { $sum: 1 },
                    totalStudents: { $sum: "$studentCount" },
                    avgStudentsPerClass: { $avg: "$studentCount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    semesterName: 1,
                    semesterYear: 1,
                    courseName: 1,
                    courseCode: 1,
                    totalClasses: 1,
                    totalStudents: 1,
                    avgStudentsPerClass: {
                        $round: ["$avgStudentsPerClass", 1],
                    },
                },
            },
        ]);

        res.json(stats.length > 0 ? stats[0] : null);
    } catch (err) {
        console.error("Lỗi khi lấy dữ liệu thống kê kết hợp:", err);
        res.status(500).json({ error: "Lỗi hệ thống: " + err.message });
    }
};

// Thống kê số lớp mở theo học phần và kỳ học
exports.getStatsBySemester = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const stats = await CourseClass.aggregate([
            {
                $match: {
                    semester: new mongoose.Types.ObjectId(semesterId),
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo",
                },
            },
            {
                $unwind: "$courseInfo",
            },
            {
                $group: {
                    _id: "$course",
                    courseName: { $first: "$courseInfo.name" },
                    courseCode: { $first: "$courseInfo.code" },
                    totalClasses: { $sum: 1 },
                    totalStudents: { $sum: "$studentCount" },
                },
            },
            {
                $project: {
                    _id: 0,
                    courseId: "$_id",
                    courseName: 1,
                    courseCode: 1,
                    totalClasses: 1,
                    totalStudents: 1,
                },
            },
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Thống kê số lớp mở theo năm học
exports.getStatsByYear = async (req, res) => {
    try {
        const { year } = req.params;
        const stats = await CourseClass.aggregate([
            {
                $lookup: {
                    from: "semesters",
                    localField: "semester",
                    foreignField: "_id",
                    as: "semesterInfo",
                },
            },
            {
                $unwind: "$semesterInfo",
            },
            {
                $match: {
                    "semesterInfo.year": year,
                },
            },
            {
                $lookup: {
                    from: "courses",
                    localField: "course",
                    foreignField: "_id",
                    as: "courseInfo",
                },
            },
            {
                $unwind: "$courseInfo",
            },
            {
                $group: {
                    _id: {
                        course: "$course",
                        semester: "$semester",
                    },
                    courseName: { $first: "$courseInfo.name" },
                    courseCode: { $first: "$courseInfo.code" },
                    semesterName: { $first: "$semesterInfo.name" },
                    totalClasses: { $sum: 1 },
                    totalStudents: { $sum: "$studentCount" },
                },
            },
            {
                $group: {
                    _id: "$_id.course",
                    courseName: { $first: "$courseName" },
                    courseCode: { $first: "$courseCode" },
                    semesters: {
                        $push: {
                            semesterName: "$semesterName",
                            totalClasses: "$totalClasses",
                            totalStudents: "$totalStudents",
                        },
                    },
                    totalClassesYear: { $sum: "$totalClasses" },
                    totalStudentsYear: { $sum: "$totalStudents" },
                },
            },
            {
                $project: {
                    _id: 0,
                    courseId: "$_id",
                    courseName: 1,
                    courseCode: 1,
                    semesters: 1,
                    totalClassesYear: 1,
                    totalStudentsYear: 1,
                },
            },
        ]);
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
