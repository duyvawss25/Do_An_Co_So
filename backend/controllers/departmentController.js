const Department = require("../models/Department");

exports.createDepartment = async (req, res) => {
    try {
        const department = new Department(req.body);
        await department.save();
        res.status(201).json(department);
    } catch (err) {
        res.status(400).json({
            message:
                err.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
    }
};

exports.getDepartments = async (req, res) => {
    try {
        const departments = await Department.find();
        res.json(departments);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy danh sách khoa. Vui lòng thử lại sau.",
        });
    }
};

exports.getDepartmentById = async (req, res) => {
    try {
        const department = await Department.findById(req.params.id);
        if (!department)
            return res.status(404).json({ message: "Không tìm thấy khoa." });
        res.json(department);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy thông tin khoa. Vui lòng thử lại sau.",
        });
    }
};

exports.updateDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!department)
            return res.status(404).json({ message: "Không tìm thấy khoa." });
        res.json(department);
    } catch (err) {
        res.status(400).json({
            message:
                err.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
    }
};

exports.deleteDepartment = async (req, res) => {
    try {
        const department = await Department.findByIdAndDelete(req.params.id);
        if (!department)
            return res.status(404).json({ message: "Không tìm thấy khoa." });
        res.json({ message: "Đã xóa khoa thành công." });
    } catch (err) {
        res.status(500).json({
            message: "Không thể xóa khoa. Vui lòng thử lại sau.",
        });
    }
};
