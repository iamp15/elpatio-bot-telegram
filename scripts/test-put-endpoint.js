/**
 * Script simple para probar el endpoint PUT /api/payment-config
 */

const axios = require("axios");

const BACKEND_URL = "http://localhost:5000/api";
const ADMIN_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4OGUwN2EzNTI5MmE3YmI5ZTQ3ZGY4YSIsImVtYWlsIjoiaWFtcDE4QGdtYWlsLmNvbSIsInJvbCI6InN1cGVyYWRtaW4iLCJpYXQiOjE3NTYxNjg3MDYsImV4cCI6MTc1Njc3MzUwNn0.IKSxOANO0v1akbcNfJQrqIZNTby7H2ymZvs4fy9lWB0";

async function testPutEndpoint() {
  console.log("🧪 **PROBANDO ENDPOINT PUT /api/payment-config**\n");
  
  try {
    console.log("URL:", `${BACKEND_URL}/payment-config`);
    console.log("Método: PUT");
    console.log("Token:", ADMIN_TOKEN.substring(0, 20) + "...");
    
    const response = await axios.put(`${BACKEND_URL}/payment-config`, {
      configType: "precios",
      configKey: "ludo.1v1",
      configValue: 70000
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ADMIN_TOKEN}`
      },
      timeout: 10000
    });
    
    console.log("✅ ÉXITO!");
    console.log("Status:", response.status);
    console.log("Data:", JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.log("❌ ERROR:");
    console.log("Status:", error.response?.status);
    console.log("Message:", error.response?.data || error.message);
    
    if (error.response?.data) {
      console.log("Response Data:", JSON.stringify(error.response.data, null, 2));
    }
  }
}

testPutEndpoint();
