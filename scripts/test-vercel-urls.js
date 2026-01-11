#!/usr/bin/env node

/**
 * Script para probar diferentes URLs de Vercel
 */

const https = require("https");

console.log("🔍 Probando URLs de Vercel para Mini Apps\n");

const urls = [
  "https://elpatio-miniapps-4858oihdx-igors-projects-bc0633eb.vercel.app/depositos/",
  "https://elpatio-miniapps-git-main-igors-projects-bc0633eb.vercel.app/depositos/",
  "https://elpatio-miniapps.vercel.app/depositos/",
];

async function testUrl(url) {
  return new Promise((resolve) => {
    const req = https.get(url, (res) => {
      let data = "";

      res.on("data", (chunk) => {
        data += chunk;
      });

      res.on("end", () => {
        const isLoginPage =
          data.includes("login") ||
          data.includes("signin") ||
          data.includes("vercel") ||
          data.includes("authentication");

        resolve({
          url,
          status: res.statusCode,
          isLoginPage,
          contentLength: data.length,
          hasTelegramScript: data.includes("telegram-web-app.js"),
        });
      });
    });

    req.on("error", (err) => {
      resolve({
        url,
        status: "ERROR",
        error: err.message,
        isLoginPage: false,
        contentLength: 0,
        hasTelegramScript: false,
      });
    });

    req.setTimeout(10000, () => {
      req.destroy();
      resolve({
        url,
        status: "TIMEOUT",
        error: "Request timeout",
        isLoginPage: false,
        contentLength: 0,
        hasTelegramScript: false,
      });
    });
  });
}

async function testAllUrls() {
  console.log("⏳ Probando URLs...\n");

  for (const url of urls) {
    console.log(`🔗 Probando: ${url}`);
    const result = await testUrl(url);

    console.log(`   Status: ${result.status}`);
    console.log(`   Tamaño: ${result.contentLength} bytes`);
    console.log(
      `   Es página de login: ${result.isLoginPage ? "❌ SÍ" : "✅ NO"}`
    );
    console.log(
      `   Tiene script de Telegram: ${
        result.hasTelegramScript ? "✅ SÍ" : "❌ NO"
      }`
    );

    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }

    console.log("");
  }
}

testAllUrls().catch(console.error);
