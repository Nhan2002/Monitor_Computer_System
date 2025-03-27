import { useEffect, useState } from "react";

const NetworkInfo = () => {
    const [networkInfo, setNetworkInfo] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/network")
            .then((res) => res.json())
            .then((data) => setNetworkInfo(data))
            .catch((error) => console.error("Lỗi khi lấy thông tin mạng:", error));
    }, []);

    return (
        <div className="card">
            <h2>Thông tin mạng</h2>
            {networkInfo ? (
                <>
                    <h3>WiFi</h3>
                    {networkInfo.wifi.length > 0 ? (
                        <ul>
                            {networkInfo.wifi.map((wifi, index) => (
                                <li key={index}>
                                    <p><strong>Tên:</strong> {wifi.name}</p>
                                    <p><strong>MAC:</strong> {wifi.mac}</p>
                                    <p><strong>IPv4:</strong> {wifi.ip4 || "Không có"}</p>
                                    <p><strong>IPv6:</strong> {wifi.ip6 || "Không có"}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có kết nối WiFi.</p>
                    )}

                    <h3>Ethernet</h3>
                    {networkInfo.ethernet.length > 0 ? (
                        <ul>
                            {networkInfo.ethernet.map((eth, index) => (
                                <li key={index}>
                                    <p><strong>Tên:</strong> {eth.name}</p>
                                    <p><strong>MAC:</strong> {eth.mac}</p>
                                    <p><strong>IPv4:</strong> {eth.ip4 || "Không có"}</p>
                                    <p><strong>IPv6:</strong> {eth.ip6 || "Không có"}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>Không có kết nối Ethernet.</p>
                    )}
                </>
            ) : (
                <p>Đang tải...</p>
            )}
        </div>
    );
};

export default NetworkInfo;
