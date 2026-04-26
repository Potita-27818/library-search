export default async function handler(req, res) {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  const API_KEY = '8cd5962ece7902776259ea8a30c3e677';
  const url = `https://api.calil.jp/library?appkey=${API_KEY}&geocode=${lng},${lat}&limit=10&callback=no`;

  const response = await fetch(url);
  const data = await response.json();

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(data);
}
