import CpuInfo from "./components/CpuInfo";
import GpuInfo from "./components/GpuInfo";
import RamInfo from "./components/RamInfo";
import DiskInfo from "./components/DiskInfo";
import NetworkInfo from "./components/NetworkInfo";
import SystemInfo from "./components/SystemInfo";
import "./styles/main.scss"; // 🎨 Import SCSS

const App = () => {
    return (
        <div className="container">
            <h1>Thông tin hệ thống</h1>
            <SystemInfo />
            <CpuInfo />
            <GpuInfo />
            <RamInfo />
            <DiskInfo />
            <NetworkInfo />
        </div>
    );
};

export default App;
