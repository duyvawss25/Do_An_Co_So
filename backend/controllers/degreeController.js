const Degree = require("../models/Degree");

exports.createDegree = async (req, res) => {
    try {
        const degree = new Degree(req.body);
        await degree.save();
        res.status(201).json(degree);
    } catch (err) {
        res.status(400).json({
            message:
                err.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
    }
};

exports.getDegrees = async (req, res) => {
    try {
        const degrees = await Degree.find();
        res.json(degrees);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy danh sách bằng cấp. Vui lòng thử lại sau.",
        });
    }
};

exports.getDegreeById = async (req, res) => {
    try {
        const degree = await Degree.findById(req.params.id);
        if (!degree)
            return res
                .status(404)
                .json({ message: "Không tìm thấy bằng cấp." });
        res.json(degree);
    } catch (err) {
        res.status(500).json({
            message: "Không thể lấy thông tin bằng cấp. Vui lòng thử lại sau.",
        });
    }
};

exports.updateDegree = async (req, res) => {
    try {
        const degree = await Degree.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!degree)
            return res
                .status(404)
                .json({ message: "Không tìm thấy bằng cấp." });
        res.json(degree);
    } catch (err) {
        res.status(400).json({
            message:
                err.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.",
        });
    }
};

exports.deleteDegree = async (req, res) => {
    try {
        const degree = await Degree.findByIdAndDelete(req.params.id);
        if (!degree)
            return res
                .status(404)
                .json({ message: "Không tìm thấy bằng cấp." });
        res.json({ message: "Đã xóa bằng cấp thành công." });
    } catch (err) {
        res.status(500).json({
            message: "Không thể xóa bằng cấp. Vui lòng thử lại sau.",
        });
    }
};
