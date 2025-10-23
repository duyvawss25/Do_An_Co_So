const Settings = require("../models/Settings");
const CourseClass = require("../models/CourseClass");

// Lấy cài đặt hiện tại
exports.getSettings = async (req, res) => {
    try {
        let settings = await Settings.findOne();

        // Nếu chưa có settings, tạo mặc định
        if (!settings) {
            settings = new Settings({
                baseRate: 50000,
                classCoefficients: {
                    normal: 1.0,
                    special: 1.5,
                    international: 2.0,
                },
            });
            await settings.save();
        }

        res.json(settings);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy cài đặt. Vui lòng thử lại sau.",
        });
    }
};

// Cập nhật cài đặt
exports.updateSettings = async (req, res) => {
    try {
        const { baseRate, classCoefficients } = req.body;

        let settings = await Settings.findOne();

        if (!settings) {
            // Tạo mới nếu chưa có
            settings = new Settings({
                baseRate,
                classCoefficients,
            });
        } else {
            // Cập nhật settings hiện có
            settings.baseRate = baseRate;
            settings.classCoefficients = classCoefficients;
        }

        await settings.save();

        // Cập nhật hệ số cho tất cả lớp học phần
        await updateAllCourseClassCoefficients(classCoefficients);

        res.json({
            settings,
            message: "Cập nhật cài đặt thành công!",
        });
    } catch (err) {
        if (err.name === "ValidationError") {
            const messages = Object.values(err.errors).map(
                (val) => val.message
            );
            return res.status(400).json({ message: messages.join(" ") });
        }
        res.status(500).json({
            message: "Không thể cập nhật cài đặt. Vui lòng thử lại sau.",
        });
    }
};

// Hàm helper để cập nhật hệ số cho tất cả lớp học phần
async function updateAllCourseClassCoefficients(classCoefficients) {
    try {
        // Cập nhật từng loại lớp
        for (const [type, coefficient] of Object.entries(classCoefficients)) {
            await CourseClass.updateMany(
                { type: type },
                { coefficient: coefficient }
            );
        }
        console.log("Đã cập nhật hệ số cho tất cả lớp học phần");
    } catch (error) {
        console.error("Lỗi khi cập nhật hệ số lớp học phần:", error);
    }
}

// Lấy định mức tiền (cho backward compatibility)
exports.getPaymentRate = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            return res.json(50000); // Giá trị mặc định
        }
        res.json(settings.baseRate);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy định mức tiền. Vui lòng thử lại sau.",
        });
    }
};

// Cập nhật định mức tiền (cho backward compatibility)
exports.updatePaymentRate = async (req, res) => {
    try {
        const { baseRate } = req.body;

        let settings = await Settings.findOne();

        if (!settings) {
            settings = new Settings({
                baseRate,
                classCoefficients: {
                    normal: 1.0,
                    special: 1.5,
                    international: 2.0,
                },
            });
        } else {
            settings.baseRate = baseRate;
        }

        await settings.save();

        res.json({
            message: "Cập nhật định mức tiền thành công!",
        });
    } catch (err) {
        res.status(500).json({
            message: "Không thể cập nhật định mức tiền. Vui lòng thử lại sau.",
        });
    }
};

// Cập nhật hệ số cho tất cả lớp học phần
exports.updateAllCoefficients = async (req, res) => {
    try {
        const settings = await Settings.findOne();
        if (!settings) {
            return res.status(400).json({
                message:
                    "Chưa có cài đặt hệ thống. Vui lòng tạo cài đặt trước.",
            });
        }

        // Cập nhật hệ số cho từng loại lớp
        const updates = [
            { type: "normal", coefficient: settings.classCoefficients.normal },
            {
                type: "special",
                coefficient: settings.classCoefficients.special,
            },
            {
                type: "international",
                coefficient: settings.classCoefficients.international,
            },
        ];

        let totalUpdated = 0;
        for (const update of updates) {
            const result = await CourseClass.updateMany(
                { type: update.type },
                { coefficient: update.coefficient }
            );
            totalUpdated += result.modifiedCount;
        }

        res.json({
            message: `Đã cập nhật hệ số cho ${totalUpdated} lớp học phần`,
            settings: settings.classCoefficients,
        });
    } catch (err) {
        res.status(500).json({
            message: "Không thể cập nhật hệ số. Vui lòng thử lại sau.",
        });
    }
};
