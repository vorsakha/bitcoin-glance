import "./View/styles/index.css";
import "./View/Components/footer.js";
import { getBtc } from "./Controller/Api/binanceData.js";
import { handleSignal } from "./Controller/Signal/signal.js";

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
