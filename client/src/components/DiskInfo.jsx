import { useEffect, useState } from "react";

const DiskInfo = () => {
    const [disks, setDisks] = useState([]);

    useEffect(() => {
        fetch("http://localhost:3000/disk")
            .then((res) => res.json())
            .then((data) => setDisks(data))
            .catch((error) => console.error("Lỗi khi lấy thông tin ổ đĩa:", error));
    }, []);

    return (
        <div className="card">
            <h2>Thông tin Ổ đĩa</h2>
            {disks.length > 0 ? (
                <ul>
                    {disks.map((disk, index) => (
                        <li key={index}>
                            <p><strong>Loại:</strong> {disk.type}</p>
                            <p><strong>Tên:</strong> {disk.name}</p>
                            <p><strong>Dung lượng:</strong> {(disk.size / 1e9).toFixed(2)} GB</p>
                            <p><strong>Giao diện:</strong> {disk.interface}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
};

export default DiskInfo;
