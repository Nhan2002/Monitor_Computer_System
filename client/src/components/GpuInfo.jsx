import { useEffect, useState } from "react";

const GpuInfo = () => {
    const [gpuInfo, setGpuInfo] = useState(null);

    useEffect(() => {
        fetch("http://localhost:3000/gpu")
            .then((res) => res.json())
            .then((data) => setGpuInfo(data))
            .catch((error) => console.error("Lỗi khi lấy thông tin GPU:", error));
    }, []);

    return (
        <div className="card">
            <h2>Thông tin GPU</h2>
            {gpuInfo ? (
                <>
                    <h3>GPU</h3>
                    <ul>
                        {gpuInfo.gpu.map((gpu, index) => (
                            <li key={index}>
                                <p><strong>Hãng:</strong> {gpu.vendor}</p>
                                <p><strong>Model:</strong> {gpu.model}</p>
                                <p><strong>VRAM:</strong> {gpu.vram} MB</p>
                            </li>
                        ))}
                    </ul>

                    <h3>Màn hình</h3>
                    <ul>
                        {gpuInfo.display.map((display, index) => (
                            <li key={index}>
                                <p><strong>Độ phân giải:</strong> {display.resolution}</p>
                                <p><strong>Tần số quét:</strong> {display.refreshRate} Hz</p>
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

export default GpuInfo;
