import "./styles/main.scss";
import SystemInfo from "./components/SystemInfo";
import CpuInfo from "./components/CpuInfo";
import GpuInfo from "./components/GpuInfo";
import RamInfo from "./components/RamInfo";
import DiskInfo from "./components/DiskInfo";
import NetworkInfo from "./components/NetworkInfo";

function App() {
  return (
    <div className="container">
      <h1>Giám sát hệ thống</h1>
      <SystemInfo />
      <CpuInfo />
      <GpuInfo />
      <RamInfo />
      <DiskInfo />
      <NetworkInfo />
    </div>
  );
}

export default App;
