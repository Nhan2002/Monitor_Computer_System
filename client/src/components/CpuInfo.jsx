import { useEffect, useState } from "react";

const CpuInfo = () => {
    const [cpu, setCpu] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/cpu")
            .then((res) => res.json())
            .then((data) => setCpu(data))
            .catch((error) => console.error("Lỗi khi lấy thông tin CPU:", error));
    }, []);

    return (
        <div className="card">
            <h2>Thông tin CPU</h2>
            {cpu ? (
                <ul>
                    <li><strong>Model:</strong> {cpu.manufacturer} {cpu.brand}</li>
                    <li><strong>Số nhân:</strong> {cpu.physicalCores} nhân</li>
                    <li><strong>Số luồng:</strong> {cpu.cores} luồng</li>
                    <li><strong>Xung nhịp cơ bản:</strong> {cpu.speed} GHz</li>
                    <li><strong>Xung nhịp tối đa:</strong> {cpu.speedMax} GHz</li>
                    <li><strong>Socket:</strong> {cpu.socket || "Không rõ"}</li>
                </ul>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
};

export default CpuInfo;
