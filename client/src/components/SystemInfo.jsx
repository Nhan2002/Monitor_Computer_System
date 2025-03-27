import { useEffect, useState } from "react";

const SystemInfo = () => {
  const [system, setSystem] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/system")
      .then((res) => res.json())
      .then((data) => setSystem(data));
  }, []);

  return (
    <div className="card">
      <h2>Thông tin hệ thống</h2>
      {system ? (
        <ul>
          <li><strong>Hostname:</strong> {system.hostname}</li>
          <li><strong>OS:</strong> {system.distro} ({system.platform})</li>
          <li><strong>Architecture:</strong> {system.arch}</li>
          <li><strong>Uptime:</strong> {Math.floor(system.uptime / 3600)} giờ</li>
        </ul>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default SystemInfo;
