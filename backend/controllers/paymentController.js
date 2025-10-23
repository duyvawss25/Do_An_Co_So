const Settings = require("../models/Settings");
const Semester = require("../models/Semester");
const Department = require("../models/Department");
const Teacher = require("../models/Teacher");
const CourseClass = require("../models/CourseClass");

exports.reportYear = async (req, res) => {
    try {
        const { year } = req.params;
        const settings = await Settings.findOne();
        if (!settings?.baseRate) {
            return res
                .status(400)
                .json({ message: "Chưa thiết lập định mức tiền" });
        }
        const semesters = await Semester.find({ year });
        if (!semesters.length) {
            return res.json({
                year,
                totalTeachers: 0,
                totalAmount: 0,
                totalLessons: 0,
                teachers: [],
            });
        }
        const semesterIds = semesters.map((s) => s._id);
        const courseClasses = await CourseClass.find({
            semester: { $in: semesterIds },
        })
            .populate({
                path: "teacher",
                populate: [{ path: "degree" }, { path: "department" }],
            })
            .populate("course");
        const teacherGroups = courseClasses.reduce((groups, cc) => {
            const teacherId = cc.teacher._id.toString();
            if (!groups[teacherId]) {
                groups[teacherId] = {
                    teacher: {
                        id: cc.teacher._id,
                        code: cc.teacher.code,
                        name: cc.teacher.name,
                        department: cc.teacher.department.name,
                    },
                    totalLessons: 0,
                    totalAmount: 0,
                    semesters: {},
                };
            }
            const lessons = cc.course.totalLessons || 0;
            const amount =
                lessons *
                settings.baseRate *
                cc.teacher.degree.coefficient *
                cc.coefficient;
            groups[teacherId].totalLessons += lessons;
            groups[teacherId].totalAmount += amount;
            const semesterId = cc.semester.toString();
            if (!groups[teacherId].semesters[semesterId]) {
                groups[teacherId].semesters[semesterId] = {
                    lessons: 0,
                    amount: 0,
                };
            }
            groups[teacherId].semesters[semesterId].lessons += lessons;
            groups[teacherId].semesters[semesterId].amount += amount;
            return groups;
        }, {});
        const teachers = Object.values(teacherGroups);
        const totalAmount = teachers.reduce((sum, t) => sum + t.totalAmount, 0);
        const totalLessons = teachers.reduce(
            (sum, t) => sum + t.totalLessons,
            0
        );
        res.json({
            year,
            totalTeachers: teachers.length,
            totalAmount,
            totalLessons,
            baseRate: settings.baseRate,
            teachers: teachers.sort((a, b) => b.totalAmount - a.totalAmount),
        });
    } catch (error) {
        console.error("Error generating year report:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.reportDepartment = async (req, res) => {
    try {
        const { departmentId } = req.params;
        const { year } = req.query;
        const settings = await Settings.findOne();
        if (!settings?.baseRate) {
            return res
                .status(400)
                .json({ message: "Chưa thiết lập định mức tiền" });
        }
        const department = await Department.findById(departmentId);
        if (!department) {
            return res.status(404).json({ message: "Không tìm thấy khoa" });
        }
        const teachers = await Teacher.find({
            department: departmentId,
        }).populate("degree");
        if (!teachers.length) {
            return res.json({
                department: {
                    id: department._id,
                    name: department.name,
                    shortName: department.shortName,
                },
                totalTeachers: 0,
                totalAmount: 0,
                totalLessons: 0,
                teachers: [],
            });
        }
        const teacherIds = teachers.map((t) => t._id);
        let semesterQuery = {};
        if (year) {
            const semesters = await Semester.find({ year });
            semesterQuery = { semester: { $in: semesters.map((s) => s._id) } };
        }
        const courseClasses = await CourseClass.find({
            teacher: { $in: teacherIds },
            ...semesterQuery,
        })
            .populate("course")
            .populate("semester");
        const teacherGroups = courseClasses.reduce((groups, cc) => {
            const teacherId = cc.teacher.toString();
            const teacher = teachers.find(
                (t) => t._id.toString() === teacherId
            );
            if (!groups[teacherId]) {
                groups[teacherId] = {
                    teacher: {
                        id: teacher._id,
                        code: teacher.code,
                        name: teacher.name,
                    },
                    totalLessons: 0,
                    totalAmount: 0,
                    semesters: {},
                };
            }
            const lessons = cc.course.totalLessons || 0;
            const amount =
                lessons *
                settings.baseRate *
                teacher.degree.coefficient *
                cc.coefficient;
            groups[teacherId].totalLessons += lessons;
            groups[teacherId].totalAmount += amount;
            const semesterId = cc.semester._id.toString();
            if (!groups[teacherId].semesters[semesterId]) {
                groups[teacherId].semesters[semesterId] = {
                    semesterName: cc.semester.name,
                    lessons: 0,
                    amount: 0,
                };
            }
            groups[teacherId].semesters[semesterId].lessons += lessons;
            groups[teacherId].semesters[semesterId].amount += amount;
            return groups;
        }, {});
        const teacherReports = Object.values(teacherGroups);
        const totalAmount = teacherReports.reduce(
            (sum, t) => sum + t.totalAmount,
            0
        );
        const totalLessons = teacherReports.reduce(
            (sum, t) => sum + t.totalLessons,
            0
        );
        res.json({
            department: {
                id: department._id,
                name: department.name,
                shortName: department.shortName,
            },
            year: year || "Tất cả",
            totalTeachers: teacherReports.length,
            totalAmount,
            totalLessons,
            baseRate: settings.baseRate,
            teachers: teacherReports.sort(
                (a, b) => b.totalAmount - a.totalAmount
            ),
        });
    } catch (error) {
        console.error("Error generating department report:", error);
        res.status(500).json({ message: error.message });
    }
};

exports.reportSchool = async (req, res) => {
    try {
        const { year } = req.query;
        const settings = await Settings.findOne();
        if (!settings?.baseRate) {
            return res
                .status(400)
                .json({ message: "Chưa thiết lập định mức tiền" });
        }
        let semesterQuery = {};
        if (year) {
            const semesters = await Semester.find({ year });
            semesterQuery = { semester: { $in: semesters.map((s) => s._id) } };
        }
        const courseClasses = await CourseClass.find(semesterQuery)
            .populate({
                path: "teacher",
                populate: [{ path: "degree" }, { path: "department" }],
            })
            .populate("course")
            .populate("semester");
        const departmentGroups = courseClasses.reduce((groups, cc) => {
            const departmentId = cc.teacher.department._id.toString();
            const departmentName = cc.teacher.department.name;
            if (!groups[departmentId]) {
                groups[departmentId] = {
                    department: {
                        id: cc.teacher.department._id,
                        name: departmentName,
                        shortName: cc.teacher.department.shortName,
                    },
                    totalTeachers: new Set(),
                    totalAmount: 0,
                    totalLessons: 0,
                    teachers: {},
                };
            }
            const teacherId = cc.teacher._id.toString();
            groups[departmentId].totalTeachers.add(teacherId);
            const lessons = cc.course.totalLessons || 0;
            const amount =
                lessons *
                settings.baseRate *
                cc.teacher.degree.coefficient *
                cc.coefficient;
            groups[departmentId].totalAmount += amount;
            groups[departmentId].totalLessons += lessons;
            if (!groups[departmentId].teachers[teacherId]) {
                groups[departmentId].teachers[teacherId] = {
                    teacher: {
                        id: cc.teacher._id,
                        code: cc.teacher.code,
                        name: cc.teacher.name,
                    },
                    totalLessons: 0,
                    totalAmount: 0,
                };
            }
            groups[departmentId].teachers[teacherId].totalLessons += lessons;
            groups[departmentId].teachers[teacherId].totalAmount += amount;
            return groups;
        }, {});
        const departments = Object.values(departmentGroups).map((dept) => ({
            ...dept,
            totalTeachers: dept.totalTeachers.size,
            teachers: Object.values(dept.teachers).sort(
                (a, b) => b.totalAmount - a.totalAmount
            ),
        }));
        const totalAmount = departments.reduce(
            (sum, dept) => sum + dept.totalAmount,
            0
        );
        const totalLessons = departments.reduce(
            (sum, dept) => sum + dept.totalLessons,
            0
        );
        const totalTeachers = departments.reduce(
            (sum, dept) => sum + dept.totalTeachers,
            0
        );
        res.json({
            year: year || "Tất cả",
            totalDepartments: departments.length,
            totalTeachers,
            totalAmount,
            totalLessons,
            baseRate: settings.baseRate,
            departments: departments.sort(
                (a, b) => b.totalAmount - a.totalAmount
            ),
        });
    } catch (error) {
        console.error("Error generating school report:", error);
        res.status(500).json({ message: error.message });
    }
};

// Lấy định mức tiền hiện tại
exports.getPaymentRate = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        res.json(settings?.baseRate || 0);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Cập nhật định mức tiền
exports.updatePaymentRate = async (req, res) => {
    try {
        const { baseRate } = req.body;
        const settings = await Settings.findOneAndUpdate(
            {},
            { baseRate },
            { new: true, upsert: true }
        );
        res.json(settings);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// Tính tiền dạy cho một giảng viên trong một kỳ
exports.calculateTeacherPayment = async (req, res) => {
    try {
        const { teacherId, semesterId } = req.params;
        const teacher = await Teacher.findById(teacherId).populate("degree");
        console.log("Teacher data:", JSON.stringify(teacher, null, 2));
        if (!teacher) {
            return res
                .status(404)
                .json({ message: "Không tìm thấy giảng viên" });
        }
        const settings = await Settings.findOne();
        console.log("Settings:", JSON.stringify(settings, null, 2));
        if (!settings?.baseRate) {
            return res
                .status(400)
                .json({ message: "Chưa thiết lập định mức tiền" });
        }
        const courseClasses = await CourseClass.find({
            teacher: teacherId,
            semester: semesterId,
        }).populate({
            path: "course",
            select: "name code credits coefficient totalLessons",
        });
        console.log("Course classes:", JSON.stringify(courseClasses, null, 2));
        if (!courseClasses.length) {
            return res.json({
                teacher: {
                    id: teacher._id,
                    code: teacher.code,
                    name: teacher.name,
                },
                semester: semesterId,
                totalLessons: 0,
                baseRate: settings.baseRate,
                degreeCoefficient: teacher.degree.coefficient,
                totalAmount: 0,
                details: [],
            });
        }
        let totalLessons = 0;
        let totalAmount = 0;
        const details = courseClasses
            .map((cc) => {
                if (!cc.course) {
                    console.log("Warning: Course not found for class:", cc._id);
                    return null;
                }
                const lessons = cc.course.totalLessons || 0;
                const amount =
                    lessons *
                    settings.baseRate *
                    teacher.degree.coefficient *
                    cc.coefficient;
                totalLessons += lessons;
                totalAmount += amount;
                return {
                    courseClass: cc._id,
                    courseName: cc.course.name,
                    lessons: lessons,
                    classType: cc.type,
                    classCoefficient: cc.coefficient,
                    amount: amount,
                };
            })
            .filter(Boolean);
        const result = {
            teacher: {
                id: teacher._id,
                code: teacher.code,
                name: teacher.name,
            },
            semester: semesterId,
            totalLessons,
            baseRate: settings.baseRate,
            degreeCoefficient: teacher.degree.coefficient,
            totalAmount,
            details,
        };
        console.log("Final result:", JSON.stringify(result, null, 2));
        res.json(result);
    } catch (error) {
        console.error("Error calculating teacher payment:", error);
        res.status(500).json({ message: error.message });
    }
};

// Tính tiền dạy cho tất cả giảng viên trong một kỳ
exports.calculateSemesterPayments = async (req, res) => {
    try {
        const { semesterId } = req.params;
        const settings = await Settings.findOne();
        if (!settings?.baseRate) {
            return res
                .status(400)
                .json({ message: "Chưa thiết lập định mức tiền" });
        }
        const courseClasses = await CourseClass.find({ semester: semesterId })
            .populate({
                path: "teacher",
                populate: {
                    path: "degree",
                },
            })
            .populate("course");
        const teacherGroups = courseClasses.reduce((groups, cc) => {
            const teacherId = cc.teacher._id.toString();
            if (!groups[teacherId]) {
                groups[teacherId] = {
                    teacher: {
                        id: cc.teacher._id,
                        code: cc.teacher.code,
                        name: cc.teacher.name,
                    },
                    semester: semesterId,
                    totalLessons: 0,
                    baseRate: settings.baseRate,
                    degreeCoefficient: cc.teacher.degree.coefficient,
                    totalAmount: 0,
                    details: [],
                };
            }
            const lessons = cc.course.totalLessons || 0;
            const amount =
                lessons *
                settings.baseRate *
                cc.teacher.degree.coefficient *
                cc.coefficient;
            groups[teacherId].totalLessons += lessons;
            groups[teacherId].totalAmount += amount;
            groups[teacherId].details.push({
                courseClass: cc._id,
                courseName: cc.course.name,
                lessons: lessons,
                classType: cc.type,
                classCoefficient: cc.coefficient,
                amount: amount,
            });
            return groups;
        }, {});
        const results = Object.values(teacherGroups);
        res.json(results);
    } catch (error) {
        console.error("Error calculating semester payments:", error);
        res.status(500).json({ message: error.message });
    }
};
