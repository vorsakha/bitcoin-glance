import "./View/styles/index.css";
import "./View/Components/footer";
import { getBtc } from "./Controller/Api/binanceData";
import { handleSignal } from "./Controller/Signal/signal";

// Service worker
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}

// If not in about page
const about = document.getElementById("about");

if (!about) {
  // Get websocket Binance data
  getBtc();
  // Get glance at default '4h' time frame
  handleSignal("4h");

  // get buttons
  const signal4h = document.getElementById("signal-4h");
  const signal1d = document.getElementById("signal-1d");
  const signal1w = document.getElementById("signal-1w");
  // apply onclick functions
  signal4h.onclick = () => handleSignal("4h");
  signal1d.onclick = () => handleSignal("1d");
  signal1w.onclick = () => handleSignal("1w");
}
