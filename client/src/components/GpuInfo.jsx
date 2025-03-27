import { useEffect, useState } from "react";

const GpuInfo = () => {
  const [gpus, setGpus] = useState([]);

  const fetchGpuInfo = () => {
    fetch("http://localhost:3000/gpu")
      .then((res) => res.json())
      .then((data) => setGpus(data));
  };

  useEffect(() => {
    fetchGpuInfo();
    const interval = setInterval(fetchGpuInfo, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="card">
      <h2>Thông tin GPU</h2>
      {gpus.length > 0 ? (
        gpus.map((gpu, index) => (
          <ul key={index}>
            <li><strong>Model:</strong> {gpu.model}</li>
            <li><strong>VRAM:</strong> {gpu.vram} MB</li>
            <li><strong>Nhiệt độ:</strong> {gpu.temperature}°C</li>
          </ul>
        ))
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default GpuInfo;
