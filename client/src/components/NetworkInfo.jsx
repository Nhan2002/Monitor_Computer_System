import { useEffect, useState } from "react";

const NetworkInfo = () => {
  const [network, setNetwork] = useState(null);

  useEffect(() => {
    fetch("http://localhost:3000/network")
      .then((res) => res.json())
      .then((data) => setNetwork(data));
  }, []);

  return (
    <div className="card">
      <h2>Thông tin Mạng</h2>
      {network ? (
        <>
          <ul>
            <li><strong>Download:</strong> {network.speed.rx}</li>
            <li><strong>Upload:</strong> {network.speed.tx}</li>
          </ul>
          <h3>Interfaces</h3>
          {network.interfaces.map((iface, index) => (
            <ul key={index}>
              <li><strong>Tên:</strong> {iface.name}</li>
              <li><strong>IPv4:</strong> {iface.ipv4}</li>
              <li><strong>IPv6:</strong> {iface.ipv6}</li>
              <li><strong>MAC:</strong> {iface.mac}</li>
            </ul>
          ))}
        </>
      ) : (
        <p>Đang tải...</p>
      )}
    </div>
  );
};

export default NetworkInfo;
