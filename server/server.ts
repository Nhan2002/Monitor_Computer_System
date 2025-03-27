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

// 🔋 Lấy thông tin CPU
app.get("/cpu", async (req, res) => {
    try {
        const cpu = await si.cpu();
        res.json(cpu);
    } catch (error) {
        res.status(500).json({ error: "Failed to retrieve CPU information" });
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

// 💾 Lấy thông tin ổ cứng
app.get("/disk", async (req, res) => {
    try {
        const disk = await si.diskLayout();
        res.json(disk.map(d => ({
            type: d.type,
            name: d.name,
            size: d.size,
            interface: d.interfaceType
        })));
    } catch (error) {
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
