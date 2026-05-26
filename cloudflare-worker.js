const GOOGLE_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbz-eHvChujZd8PHrFz8Vq1IewcmtH58KfqaBl2R9EPBzhGso9KbdPMYBpy_5dyviE-9/exec";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type"
};

export default {
  async fetch(request) {
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (request.method !== "POST") {
      return json({ ok: false, error: "Method not allowed" }, 405);
    }

    let payload;
    try {
      payload = await request.json();
    } catch (error) {
      return json({ ok: false, error: "Invalid JSON" }, 400);
    }

    if (!payload.main || !payload.drink || !payload.dessert) {
      return json({ ok: false, error: "Missing required order fields" }, 400);
    }

    const response = await fetch(GOOGLE_SCRIPT_URL, {
      method: "POST",
      headers: {
        "Content-Type": "text/plain;charset=utf-8"
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      return json({ ok: false, error: "Google Sheets write failed" }, 502);
    }

    return json({ ok: true });
  }
};

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json;charset=utf-8"
    }
  });
}
