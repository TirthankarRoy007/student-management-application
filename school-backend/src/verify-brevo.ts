import "dotenv/config";
import * as brevo from "@getbrevo/brevo";

async function verify() {
  console.log("🔍 Checking Brevo Configuration...");
  
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.error("❌ BREVO_API_KEY is NOT defined in process.env");
    return;
  }

  // Print first few chars to check if it's the right key without leaking it
  console.log(`🔑 Key loaded: ${apiKey.substring(0, 10)}...******`);
  console.log(`📏 Key length: ${apiKey.length}`);

  // Check for common issues
  if (apiKey.startsWith('"') || apiKey.endsWith('"')) {
    console.warn("⚠️  WARNING: Key appears to be wrapped in quotes. This might be the issue.");
  }
  if (apiKey.trim() !== apiKey) {
    console.warn("⚠️  WARNING: Key has leading/trailing whitespace.");
  }

  const apiInstance = new brevo.AccountApi();
  apiInstance.setApiKey(brevo.AccountApiApiKeys.apiKey, apiKey);

  try {
    console.log("📡 Sending test request to Brevo (getAccount)...");
    const data = await apiInstance.getAccount();
    console.log("✅ Connection Successful! The API key is valid.");
    console.log(`👤 Account: ${data.body.email}`);
  } catch (error: any) {
    console.error("❌ Connection Failed!");
    if (error.response) {
      console.error(`   Status: ${error.response.status}`);
      console.error(`   Message:`, error.response.body);
    } else {
      console.error("   Error:", error.message);
    }
  }
}

verify();
