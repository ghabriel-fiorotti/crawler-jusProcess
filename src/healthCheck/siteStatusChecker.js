const fs = require("fs");
const axios = require("axios");
const path = require("path");

const SITES = {
  "02": "https://www2.tjal.jus.br/cpopg/open.do",
  "06": "https://esaj.tjce.jus.br/cpopg/open.do",
};

const CHECK_INTERVAL = 30 * 10 * 1000;
const jsonFilePath = path.resolve(__dirname, "sitesStatus.json");

const checkSiteStatus = async () => {
  try {
    const currentTime = new Date().toISOString();
    const dateTimeCheck = currentTime.replace("T", " ").replace(/\.\d+Z/, "");

    for (const siteKey in SITES) {
      try {
        if (Object.hasOwnProperty.call(SITES, siteKey)) {
          const siteUrl = SITES[siteKey];
          await updateSiteStatus(siteKey, siteUrl, dateTimeCheck);
        }
      } catch (error) {
        const siteStatus = {
          dateTimeCheck,
          isOnline: false,
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
      }
    }
  } catch (error) {
    console.error("Error checking site status:", error);
  } finally {
    setTimeout(checkSiteStatus, CHECK_INTERVAL);
  }
};

const updateSiteStatus = async (siteKey, siteUrl, dateTimeCheck) => {
  const response = await axios.head(siteUrl);
  const isOnline = response.status === 200 ? true : false;
  const siteStatus = {
    dateTimeCheck,
    isOnline,
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
