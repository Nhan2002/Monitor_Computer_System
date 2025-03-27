import { useEffect, useState } from "react";

const RamInfo = () => {
    const [ram, setRam] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/ram")
            .then((res) => res.json())
            .then((data) => setRam(data))
            .catch((error) => console.error("Lỗi khi lấy thông tin RAM:", error));
    }, []);

    return (
        <div className="card">
            <h2>Thông tin RAM</h2>
            {ram ? (
                <ul>
                    <li><strong>Tổng dung lượng:</strong> {(ram.total / 1e9).toFixed(2)} GB</li>
                    <li><strong>Đã sử dụng:</strong> {(ram.used / 1e9).toFixed(2)} GB</li>
                    <li><strong>Còn trống:</strong> {(ram.free / 1e9).toFixed(2)} GB</li>
                </ul>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
};

export default RamInfo;
