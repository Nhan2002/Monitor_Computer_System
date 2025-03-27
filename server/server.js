const express = require("express");
const cors = require("cors");
const si = require("systeminformation");
const os = require("os");

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));

// Lấy địa chỉ IP nội bộ
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (let iface in interfaces) {
    for (let alias of interfaces[iface]) {
      if (alias.family === "IPv4" && !alias.internal) {
        return alias.address;
      }
    }
  }
  return "Không tìm thấy IP";
}

// API: Lấy thông tin hệ thống
app.get("/system", async (req, res) => {
  try {
    const osInfo = await si.osInfo();
    res.json({
      hostname: osInfo.hostname,
      platform: osInfo.platform,
      distro: osInfo.distro,
      arch: osInfo.arch,
      uptime: si.time().uptime,
      ip: getLocalIP(),
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin hệ thống" });
  }
});

// API: Lấy thông tin CPU
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
      load: cpuLoad.currentLoad.toFixed(1),
    });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin CPU" });
  }
});

// API: Lấy thông tin GPU (có GPU Load)
app.get("/gpu", async (req, res) => {
  try {
    const gpus = await si.graphics();
    const gpuLoad = await si.currentLoad(); // Lấy tải GPU

    const gpuList = gpus.controllers.map((gpu, index) => ({
      model: gpu.model,
      vram: gpu.vram + " MB",
      temperature: gpu.temperatureGpu ? gpu.temperatureGpu + "°C" : "N/A",
      load: gpuLoad.gpu ? gpuLoad.gpu[index].toFixed(1) + "%" : "N/A",
    }));

    res.json(gpuList);
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin GPU" });
  }
});

// API: Lấy thông tin RAM
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

// API: Lấy thông tin ổ cứng
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

// API: Lấy thông tin mạng (đảm bảo tránh lỗi undefined)
app.get("/network", async (req, res) => {
  try {
    const networkInterfaces = await si.networkInterfaces();
    const networkStats = await si.networkStats();

    const interfaces = networkInterfaces.map((iface) => ({
      name: iface.iface,
      ipv4: iface.ip4 || "Không có",
      ipv6: iface.ip6 || "Không có",
      mac: iface.mac,
    }));

    const networkSpeed =
      networkStats.length > 0
        ? {
            rx: (networkStats[0].rx_sec / 1e6).toFixed(2) + " Mbps",
            tx: (networkStats[0].tx_sec / 1e6).toFixed(2) + " Mbps",
          }
        : { rx: "0 Mbps", tx: "0 Mbps" };

    res.json({ interfaces, speed: networkSpeed });
  } catch (error) {
    res.status(500).json({ error: "Lỗi khi lấy thông tin mạng" });
  }
});

// Khởi động server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🌐 Server chạy trên: http://${getLocalIP()}:${PORT}`);
});
