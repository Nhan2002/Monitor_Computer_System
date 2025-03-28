import { useEffect, useState } from "react";

const SystemInfo = () => {
    const [system, setSystem] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/system")
            .then((res) => res.json())
            .then((data) => setSystem(data))
            .catch((error) => console.error("Lỗi khi lấy thông tin hệ thống:", error));
    }, []);

    return (
        <div className="card">
            <h2>Thông tin hệ thống</h2>
            {system ? (
                <ul>
                    <li><strong>Hãng sản xuất:</strong> {system.manufacturer}</li>
                    <li><strong>Mẫu máy:</strong> {system.model}</li>
                    <li><strong>Số serial:</strong> {system.serial || "Không có"}</li>
                    <li><strong>Phiên bản BIOS:</strong> {system.bios.version || "Không rõ"}</li>
                    <li><strong>Mainboard:</strong> {system.baseboard.manufacturer} {system.baseboard.model}</li>
                    <li><strong>Hệ điều hành:</strong> {system.os.platform}</li>
                    <li><strong>Phiên bản:</strong> {system.os.distro}</li>
                    <li><strong>Kiến trúc:</strong> {system.os.arch}</li>
                    <li><strong>Thời gian hoạt động:</strong> {Math.floor(system.time.uptime / 3600)} giờ {Math.floor((system.time.uptime % 3600) / 60)} phút</li>
                    <li><strong>Múi giờ:</strong> {system.time.timezone}</li>
                </ul>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
};

export default SystemInfo;
