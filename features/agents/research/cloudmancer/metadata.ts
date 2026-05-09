export const cloudmancerAgent = {
  id: "cloudmancer",
  name: "Cloudmancer",
  branch: "Research",
  rank: "Weather Signal Mage",
  role: "Collects weather signals for Pacos de Ferreira and Porto, then publishes a practical forecast brief.",
  status: "online",
  cadence: "Every 30 minutes",
  callsign: "CLOUD",
  color: "blue",
  avatarImage: "/agents/cloudmancer-pixel.png",
  model: "Open-Meteo now; LLM analysis later"
} as const;
