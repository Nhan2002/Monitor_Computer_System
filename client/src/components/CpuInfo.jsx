import { useEffect, useState } from "react";

const CpuInfo = () => {
  const [cpu, setCpu] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/cpu")
      .then((res) => res.json())
      .then((data) => setCpu(data));
  }, []);

  return (
    <div className="card">
      <h2>Thông tin CPU</h2>
      {cpu ? (
        <ul>
          <li><strong>Hãng:</strong> {cpu.manufacturer}</li>
          <li><strong>Tên:</strong> {cpu.brand}</li>
          <li><strong>Tốc độ:</strong> {cpu.speed} GHz</li>
          <li><strong>Số nhân:</strong> {cpu.cores}</li>
          <li><strong>Số luồng:</strong> {cpu.threads}</li>
          <li><strong>Load:</strong> {cpu.load} %</li>
        </ul>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default CpuInfo;
