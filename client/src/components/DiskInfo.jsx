import { useEffect, useState } from "react";

const DiskInfo = () => {
    const [diskData, setDiskData] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/disk")
            .then((res) => res.json())
            .then((data) => setDiskData(data))
            .catch((error) => console.error("Lỗi khi lấy thông tin ổ đĩa:", error));
    }, []);

    return (
        <div className="card">
            <h2>Thông tin Ổ đĩa</h2>

            {diskData ? (
                <>
                    <h3>Phần cứng</h3>
                    <ul>
                        {diskData.disks.map((disk, index) => (
                            <li key={index}>
                                <p><strong>Loại:</strong> {disk.type}</p>
                                <p><strong>Tên:</strong> {disk.name}</p>
                                <p><strong>Dung lượng:</strong> {(disk.size / 1e9).toFixed(2)} GB</p>
                                <p><strong>Giao diện:</strong> {disk.interface}</p>
                            </li>
                        ))}
                    </ul>

                    <h3>Phân vùng</h3>
                    <ul>
                        {diskData.partitions.map((partition, index) => (
                            <li key={index}>
                                <p><strong>Phân vùng:</strong> {partition.mount}</p>
                                <p><strong>Dung lượng:</strong> {(partition.size / 1e9).toFixed(2)} GB</p>
                                <p><strong>Đã dùng:</strong> {(partition.used / 1e9).toFixed(2)} GB</p>
                                <p><strong>Còn trống:</strong> {(partition.available / 1e9).toFixed(2)} GB</p>
                                <p>
                                    <strong>Phần trăm sử dụng: </strong> 
                                    <span style={{ color: partition.usagePercent > 80 ? "red" : "green" }}>
                                        {partition.usagePercent}
                                    </span>
                                </p>
                            </li>
                        ))}
                    </ul>
                </>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
};

export default DiskInfo;
