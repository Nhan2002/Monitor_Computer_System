const express = require("express");
const cors = require("cors");
const si = require("systeminformation");
const os = require("os");
const network = require("network");

const app = express();
const PORT = 3000;

app.use(cors({ origin: "*" }));

const HOST = "0.0.0.0"; // Cho phép truy cập từ mọi thiết bị trong mạng LAN

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

// Lấy thông tin hệ thống từ máy khách
app.get("/system", async (req, res) => {
  try {
    const osInfo = await si.osInfo();
    const system = {
      hostname: osInfo.hostname,
      platform: osInfo.platform,
      distro: osInfo.distro,
      arch: osInfo.arch,
      uptime: si.time().uptime,
      ip: getLocalIP(), // Trả về địa chỉ IP của server
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

// Lấy thông tin GPU
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

// Lấy thông tin mạng
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
app.listen(PORT, HOST, () => {
  console.log(`🌐 Server chạy trên: http://${getLocalIP()}:${PORT}`);
});
