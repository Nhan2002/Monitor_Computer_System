import { useEffect, useState } from "react";

const CpuInfo = () => {
    const [cpu, setCpu] = useState(null);

    useEffect(() => {
        const fetchCpuInfo = () => {
            fetch("http://localhost:3000/cpu")
                .then((res) => res.json())
                .then((data) => setCpu(data))
                .catch((error) => console.error("Lỗi khi lấy thông tin CPU:", error));
        };

        fetchCpuInfo();
        const interval = setInterval(fetchCpuInfo, 3000); // Cập nhật mỗi 3 giây
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="card">
            <h2>Thông tin CPU</h2>
            {cpu ? (
                <ul>
                    <li><strong>Hãng sản xuất:</strong> {cpu.manufacturer}</li>
                    <li><strong>Mẫu CPU:</strong> {cpu.brand}</li>
                    <li><strong>Số nhân:</strong> {cpu.physicalCores} nhân</li>
                    <li><strong>Số luồng:</strong> {cpu.cores} luồng</li>
                    <li><strong>Xung nhịp cơ bản:</strong> {cpu.speed} GHz</li>
                    <li><strong>Xung nhịp tối đa:</strong> {cpu.speedMax} GHz</li>
                    <li><strong>Socket:</strong> {cpu.socket || "Không rõ"}</li>
                    <li><strong>Tải CPU tổng:</strong> {cpu.load}%</li>
                    <li><strong>Tải CPU do người dùng:</strong> {cpu.user}%</li>
                    <li><strong>Tải CPU do hệ thống:</strong> {cpu.system}%</li>
                    <li><strong>CPU trống:</strong> {cpu.idle}%</li>
                </ul>
            ) : (
                <p>Đang tải dữ liệu...</p>
            )}
        </div>
    );
};

export default CpuInfo;
