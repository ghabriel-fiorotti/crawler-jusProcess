const fs = require("fs");
const axios = require("axios");
const path = require("path");

const SITES = {
  tjal: "https://www2.tjal.jus.br/cpopg/open.do",
  tjce: "https://esaj.tjce.jus.br/cpopg/open.do",
};

const CHECK_INTERVAL = 5 * 60 * 1000;
const jsonFilePath = path.resolve(__dirname, "sitesStatus.json");

const checkSiteStatus = async () => {
  try {
    for (const siteKey in SITES) {
      if (Object.hasOwnProperty.call(SITES, siteKey)) {
        const siteUrl = SITES[siteKey];
        await updateSiteStatus(siteKey, siteUrl);
      }
    }
  } catch (error) {
    console.error("Error checking site status:", error);
  } finally {
    setTimeout(checkSiteStatus, CHECK_INTERVAL);
  }
};

const updateSiteStatus = async (siteKey, siteUrl) => {
  const currentTime = new Date().toISOString();
  const response = await axios.head(siteUrl);
  const status = response.status === 200 ? "ok" : "offline";
  const dateTimeCheck = currentTime.replace("T", " ").replace(/\.\d+Z/, "");
  const siteStatus = {
    dateTimeCheck,
    status,
  };
  let sitesStatus = {};

  try {
    const existingData = fs.readFileSync(jsonFilePath, "utf-8");
    sitesStatus = JSON.parse(existingData);
  } catch (err) {
    if (err.code !== "ENOENT") {
      console.error("Error reading file:", err);
    }
  }

  sitesStatus[siteKey] = siteStatus;

  try {
    fs.writeFileSync(jsonFilePath, JSON.stringify(sitesStatus, null, 2));
  } catch (err) {
    console.error("Error writing file:", err);
  }
};

checkSiteStatus();
