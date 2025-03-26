const express = require("express");
const cors = require("cors");
const si = require("systeminformation");
const dns = require("dns");
const os = require("os");

const app = express();
const PORT = 3001;

app.use(cors());

function getIPv4() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === "IPv4" && !iface.internal) {
        return iface.address;
      }
    }
  }
  return "Không tìm thấy IPv4";
}

// API lấy IPv4
app.get("/ipv4", (req, res) => {
  res.json({ ipv4: getIPv4() });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌍 Server đang chạy tại: http://${getIPv4()}:${PORT}`);
});

// Lấy thông tin cơ bản về hệ thống
app.get("/system", async (req, res) => {
  try {
    const osInfo = await si.osInfo();
    const system = {
      hostname: osInfo.hostname,
      platform: osInfo.platform,
      distro: osInfo.distro,
      arch: osInfo.arch,
      uptime: si.time().uptime,
    };
    res.json(system);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin hệ thống" });
  }
});

// Lấy thông tin CPU
app.get("/cpu", async (req, res) => {
  try {
    const cpu = await si.cpu();
    const cpuLoad = await si.currentLoad();
    res.json({
      manufacturer: cpu.manufacturer,
      brand: cpu.brand,
      speed: cpu.speed,
      cores: cpu.physicalCores,
      threads: cpu.cores,
      load: cpuLoad.currentLoad.toFixed(1), // Làm tròn 1 số thập phân
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin CPU" });
  }
});

// Lấy thông tin GPU (nếu có)
app.get("/gpu", async (req, res) => {
  try {
    const gpus = await si.graphics();
    const gpuList = gpus.controllers.map((gpu) => ({
      model: gpu.model,
      vram: gpu.vram,
      temperature: gpu.temperatureGpu,
    }));
    res.json(gpuList);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin GPU" });
  }
});

// Lấy thông tin RAM
app.get("/ram", async (req, res) => {
  try {
    const mem = await si.mem();
    res.json({
      total: (mem.total / 1e9).toFixed(2) + " GB",
      used: ((mem.used / mem.total) * 100).toFixed(1) + "%",
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin RAM" });
  }
});

// Lấy thông tin ổ cứng
app.get("/disk", async (req, res) => {
  try {
    const disk = await si.fsSize();
    const diskInfo = disk.map((d) => ({
      mount: d.mount,
      size: (d.size / 1e9).toFixed(2) + " GB",
      used: ((d.used / d.size) * 100).toFixed(1) + "%",
    }));
    res.json(diskInfo);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin ổ cứng" });
  }
});

// Lấy thông tin tốc độ mạng
app.get("/network", async (req, res) => {
  try {
    const networkInterfaces = await si.networkInterfaces();
    const networkStats = await si.networkStats();

    // Lọc địa chỉ IPv4 và IPv6 từ danh sách interfaces
    const interfaces = networkInterfaces.map((iface) => ({
      name: iface.iface,
      ipv4: iface.ip4 || "Không có",
      ipv6: iface.ip6 || "Không có",
      mac: iface.mac,
    }));

    // Lấy tốc độ mạng
    const networkSpeed = {
      rx: (networkStats[0].rx_sec / 1e6).toFixed(2) + " Mbps",
      tx: (networkStats[0].tx_sec / 1e6).toFixed(2) + " Mbps",
    };

    res.json({
      interfaces,
      speed: networkSpeed,
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin mạng" });
  }
});

// Khởi động server
app.listen(PORT, () => {
  console.log(`Server chạy tại http://localhost:${PORT}`);
});
