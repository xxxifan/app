import "./style.css";
import {
  createIcons,
  ArrowUpRight,
  ArrowDown,
  Download,
  Bluetooth,
  Radio,
  Route,
  Cpu,
  BatteryCharging,
  Battery,
  BatteryFull,
  Fan,
  Activity,
  Signal,
  Settings2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Trophy,
  UserRound,
  PlugZap,
  Cable,
  Gauge,
  Smartphone,
  Bike,
  Zap,
  Wallet,
  ReceiptText,
  Check,
  Timer,
  Leaf,
  Plus,
  QrCode,
  X,
  Sparkles,
  BatteryMedium,
  ChartSpline,
  Navigation,
  Volume2,
  CornerUpRight,
} from "lucide";
import QRCode from "qrcode";

const icons = {
  ArrowUpRight,
  ArrowDown,
  Download,
  Bluetooth,
  Radio,
  Route,
  Cpu,
  BatteryCharging,
  Battery,
  BatteryFull,
  Fan,
  Activity,
  Signal,
  Settings2,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Trophy,
  UserRound,
  PlugZap,
  Cable,
  Gauge,
  Smartphone,
  Bike,
  Zap,
  Wallet,
  ReceiptText,
  Check,
  Timer,
  Leaf,
  Plus,
  QrCode,
  X,
  Sparkles,
  BatteryMedium,
  ChartSpline,
  Navigation,
  Volume2,
  CornerUpRight,
};
const renderIcons = () =>
  createIcons({ icons, attrs: { "aria-hidden": "true" } });
renderIcons();

const devices = {
  controller: {
    category: "动力",
    index: "01",
    icon: "cpu",
    title: "车速、电流、温度，实时看",
    description:
      "读取控制器的运行数据和故障信息，部分型号可以查看和调整参数，修改前会有风险提示。",
    tags: ["主流控制器", "更多适配中"],
  },
  battery: {
    category: "电池",
    index: "02",
    icon: "battery-charging",
    title: "电压、电流、每串电芯",
    description:
      "连接主流保护板或计量器，查看电量、总压和电流；保护板还能看到单体电压和压差。",
    tags: ["主流保护板", "计量器", "单体电压"],
  },
  fan: {
    category: "散热",
    index: "03",
    icon: "fan",
    title: "散热风扇状态",
    description: "接入支持的散热风扇，和其他设备放在同一个 App 里查看和管理。",
    tags: ["散热风扇"],
  },
  charger: {
    category: "补能",
    index: "04",
    icon: "plug-zap",
    title: "充电状态和充电记录",
    description:
      "连接支持的充电器，查看充电状态，部分型号可以调整充电参数，每次充电都会留下记录。",
    tags: ["充电状态", "充电参数", "充电记录"],
  },
  power: {
    category: "配件",
    index: "05",
    icon: "cable",
    title: "取电器也能接入",
    description:
      "支持的取电器可以绑定到车辆上，和其他设备一起查看，不用另装 App。",
    tags: ["取电器"],
  },
  tpms: {
    category: "轮胎",
    index: "06",
    icon: "gauge",
    title: "前后轮胎压",
    description: "接入支持的胎压传感器，骑行时在 App 里直接看胎压。",
    tags: ["胎压监测"],
  },
};

document.querySelectorAll("[data-device]").forEach((button) => {
  button.addEventListener("click", () => {
    const device = devices[button.dataset.device];
    document.querySelectorAll("[data-device]").forEach((item) => {
      const active = item === button;
      item.classList.toggle("active", active);
      item.setAttribute("aria-pressed", String(active));
    });
    document.querySelector("#device-category").textContent = device.category;
    document.querySelector("#device-index").textContent = device.index;
    document.querySelector("#device-title").textContent = device.title;
    document.querySelector("#device-description").textContent =
      device.description;
    const symbol = document.createElement("i");
    symbol.id = "device-symbol-icon";
    symbol.dataset.lucide = device.icon;
    document.querySelector("#device-symbol-icon").replaceWith(symbol);
    document.querySelector("#device-tags").replaceChildren(
      ...device.tags.map((tag) => {
        const span = document.createElement("span");
        span.textContent = tag;
        return span;
      }),
    );
    renderIcons();
  });
});

// 公开网关解析当前正式版并保留原有限流；不缓存带签名的临时 APK 地址。
// 版本信息不可用时，HTML 中不带版本号的下载链接仍可独立工作。
const releaseEndpoint =
  "https://rsmotor-9gtq93sed5fb9acd.service.tcloudbase.com/app-update-release";
async function loadRelease() {
  const status = document.querySelector("#release-status");
  try {
    const response = await fetch(
      `${releaseEndpoint}?action=latest&channel=release`,
      { signal: AbortSignal.timeout(8000) },
    );
    if (!response.ok) throw new Error(`Release metadata: ${response.status}`);
    const payload = await response.json();
    const release = payload.release;
    if (
      !payload.ok ||
      !release ||
      release.prerelease ||
      !/^\d+\.\d+\.\d+$/.test(release.versionName)
    )
      throw new Error("Invalid release metadata");
    const abi = release.apkAbi === "arm64-v8a" ? "arm64-v8a" : "请确认设备架构";
    status.textContent = `正式版 v${release.versionName} · Android 8.0+ · ${abi}`;
  } catch {
    status.textContent =
      "暂时无法读取版本信息，可直接下载正式版 · Android 8.0+ / arm64-v8a";
  }
}
loadRelease();

const dialog = document.querySelector("#qr-dialog");
const qrButton = document.querySelector("#qr-open");
qrButton.addEventListener("click", async () => {
  const pageUrl = new URL(window.location.href);
  pageUrl.hash = "download";
  pageUrl.search = "";
  // 二维码打开稳定的首页地址，不直接触发有频率限制的下载请求。
  dialog.showModal();
  document.body.classList.add("modal-open");
  document.querySelector("#qr-status").textContent = "Android 8.0+ · arm64-v8a";
  try {
    const canvas = document.querySelector("#qr-canvas");
    await QRCode.toCanvas(canvas, pageUrl.href, {
      width: 460,
      margin: 3,
      color: { dark: "#101112", light: "#ffffff" },
    });
    // 库会写入 460px 的内联尺寸；保留高分辨率位图，显示尺寸等比适配窄屏。
    canvas.style.width = "min(230px, 100%)";
    canvas.style.height = "auto";
  } catch {
    document.querySelector("#qr-status").textContent =
      "二维码暂时不可用，请在手机浏览器打开本页网址。";
  }
});
document
  .querySelector(".dialog-close")
  .addEventListener("click", () => dialog.close());
dialog.addEventListener("click", (event) => {
  const bounds = dialog.getBoundingClientRect();
  if (
    event.clientX < bounds.left ||
    event.clientX > bounds.right ||
    event.clientY < bounds.top ||
    event.clientY > bounds.bottom
  )
    dialog.close();
});
dialog.addEventListener("close", () => {
  document.body.classList.remove("modal-open");
  qrButton.focus();
});

if (
  "IntersectionObserver" in window &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches
) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-entering");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.08 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((element) => observer.observe(element));
}
document.querySelector("#year").textContent = new Date().getFullYear();
