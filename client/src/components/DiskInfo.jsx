import { useEffect, useState } from "react";

const DiskInfo = () => {
  const [disks, setDisks] = useState([]);

  const fetchDiskInfo = () => {
    fetch("http://localhost:3001/disk")
      .then((res) => res.json())
      .then((data) => setDisks(data));
  };

  useEffect(() => {
    fetchDiskInfo();
    const interval = setInterval(fetchDiskInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2>Thông tin Ổ Cứng</h2>
      {disks.length > 0 ? (
        disks.map((disk, index) => (
          <ul key={index}>
            <li><strong>Mount:</strong> {disk.mount}</li>
            <li><strong>Dung lượng:</strong> {disk.size}</li>
            <li><strong>Đã dùng:</strong> {disk.used}</li>
          </ul>
        ))
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default DiskInfo;
