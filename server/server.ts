import express, { Application } from "express";
import os from "os";
import si from "systeminformation";
import cors from "cors";

const app: Application = express();
const port = 3000;
app.use(cors());

// 🖥️ Lấy thông tin hệ thống
app.get("/system", async (req, res) => {
    try {
        const system = await si.system();
        const bios = await si.bios();
        const baseboard = await si.baseboard();
        const osInfo = await si.osInfo();

        res.json({
            manufacturer: system.manufacturer,
            model: system.model,
            serial: system.serial,
            bios: {
                version: bios.version
            },
            baseboard: {
                manufacturer: baseboard.manufacturer,
                model: baseboard.model
            },
            os: {
                platform: osInfo.platform,
                distro: osInfo.distro,
                arch: osInfo.arch
            },
            time: {
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                uptime: os.uptime()
            }
        });
    } catch (error) {
        console.error("Error fetching system info:", error);
        res.status(500).json({ error: "Failed to retrieve system information" });
    }
});

app.get("/cpu", async (req, res) => {
    try {
      const cpu = await si.cpu();
      const cpuLoad = await si.currentLoad();
      res.json({
        manufacturer: cpu.manufacturer,
        brand: cpu.brand,
        speed: cpu.speed,
        speedMax: cpu.speedMax || "Không rõ",
        physicalCores: cpu.physicalCores,
        cores: cpu.cores,
        socket: cpu.socket || "Không rõ",
        load: cpuLoad.currentLoad.toFixed(1), // Load CPU
        user: cpuLoad.currentLoadUser.toFixed(1), // Load CPU User
        system: cpuLoad.currentLoadSystem.toFixed(1), // Load CPU System
        idle: cpuLoad.currentLoadIdle.toFixed(1), // Load CPU Idle
      });
    } catch (error) {
      res.status(500).json({ error: "Lỗi khi lấy thông tin CPU" });
    }
  });  

// 🛑 Lấy thông tin RAM
app.get("/ram", async (req, res) => {
    try {
        const memory = await si.mem();
        res.json({
            total: memory.total,
            free: memory.free,
            used: memory.used
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve RAM information" });
    }
});

// 💾 Lấy thông tin ổ cứng (Gồm cả phân vùng & phần trăm sử dụng)
app.get("/disk", async (req, res) => {
    try {
        const diskLayout = await si.diskLayout();
        const diskUsage = await si.fsSize();

        // Chuyển đổi dữ liệu về định dạng mong muốn
        const disks = diskLayout.map(d => ({
            type: d.type,
            name: d.name,
            size: d.size,
            interface: d.interfaceType
        }));

        const partitions = diskUsage.map(p => ({
            mount: p.mount, // Phân vùng (C:, D:, /home, etc.)
            size: p.size, // Dung lượng tổng
            used: p.used, // Dung lượng đã dùng
            available: p.available, // Dung lượng còn trống
            usagePercent: ((p.used / p.size) * 100).toFixed(1) + "%" // Tính phần trăm
        }));

        res.json({ disks, partitions });
    } catch (error) {
        console.error("❌ Lỗi lấy thông tin ổ cứng:", error);
        res.status(500).json({ error: "Failed to retrieve disk information" });
    }
});

// 🎮 Lấy thông tin GPU
app.get("/gpu", async (req, res) => {
    try {
        const graphics = await si.graphics();
        res.json({
            gpu: graphics.controllers.map(g => ({
                vendor: g.vendor,
                model: g.model,
                vram: g.vram
            })),
            display: graphics.displays.map(d => ({
                resolution: `${d.currentResX}x${d.currentResY}`,
                refreshRate: d.currentRefreshRate
            }))
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve GPU information" });
    }
});

// 🌐 Lấy thông tin mạng
app.get("/network", async (req, res) => {
    try {
        const network = await si.networkInterfaces();
        const networkArray = Array.isArray(network) ? network : [network];

        res.json({
            wifi: networkArray.filter(n => n.type === "wireless").map(w => ({
                name: w.iface, mac: w.mac, ip4: w.ip4, ip6: w.ip6
            })),
            ethernet: networkArray.filter(n => n.type === "wired").map(e => ({
                name: e.iface, mac: e.mac, ip4: e.ip4, ip6: e.ip6
            }))
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve network information" });
    }
});

// ⏳ Lấy thông tin thời gian
app.get("/time", async (req, res) => {
    try {
        res.json({
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            uptime: os.uptime()
        });
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve time information" });
    }
});

// 🔥 Chạy server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
