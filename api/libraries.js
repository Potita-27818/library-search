export default async function handler(req, res) {
  const { lat, lng } = req.query;

  if (!lat || !lng) {
    return res.status(400).json({ error: 'lat and lng are required' });
  }

  const API_KEY = '8cd5962ece7902776259ea8a30c3e677';
  const url = `https://api.calil.jp/library?appkey=${API_KEY}&geocode=${lng},${lat}&limit=10`;

  const response = await fetch(url);
  const xml = await response.text();

  const libraries = parseLibrariesXml(xml);

  res.setHeader('Access-Control-Allow-Origin', '*');
  res.status(200).json(libraries);
}

function parseLibrariesXml(xml) {
  const libraries = [];
  const blocks = xml.matchAll(/<Library>([\s\S]*?)<\/Library>/g);

  for (const match of blocks) {
    const block = match[1];
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}>([\\s\\S]*?)<\\/${tag}>`));
      return m ? m[1].trim() : '';
    };

    libraries.push({
      libid:    get('libid'),
      formal:   get('formal'),
      short:    get('short'),
      systemid: get('systemid'),
      category: get('category'),
      post:     get('post'),
      tel:      get('tel'),
      pref:     get('pref'),
      city:     get('city'),
      address:  get('address'),
      geocode:  get('geocode'),
      url_pc:   get('url_pc'),
      distance: parseFloat(get('distance')) || 0,
    });
  }

  return libraries;
}
