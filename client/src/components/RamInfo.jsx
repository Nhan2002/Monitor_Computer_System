import { useEffect, useState } from "react";

const RamInfo = () => {
  const [ram, setRam] = useState(null);

  const fetchRamInfo = () => {
    fetch("http://localhost:3001/ram")
      .then((res) => res.json())
      .then((data) => setRam(data));
  };

  useEffect(() => {
    fetchRamInfo();
    const interval = setInterval(fetchRamInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2>Thông tin RAM</h2>
      {ram ? (
        <ul>
          <li><strong>Tổng:</strong> {ram.total}</li>
          <li><strong>Đã dùng:</strong> {ram.used}</li>
        </ul>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default RamInfo;
