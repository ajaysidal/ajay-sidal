import { NextResponse } from 'next/server';
import { fetchWithAuth } from '@/lib/openprovider/client';

const BENCHMARKS = {
  domains: {
    '.com': { retail_avg: 13.98, cheapest: 9.03, wholesale: 10.46 },
    '.net': { retail_avg: 15.98, cheapest: 12.98, wholesale: 11.86 },
    '.org': { retail_avg: 14.98, cheapest: 10.74, wholesale: 6.50 },
    '.io': { retail_avg: 45.00, cheapest: 39.00, wholesale: 38.50 },
    '.ai': { retail_avg: 99.99, cheapest: 82.70, wholesale: 85.00 },
  },
  ssl: {
    dv: { retail_avg: 18.00, cheapest: 6.99, wholesale: 5.12 },
    ov: { retail_avg: 89.00, cheapest: 45.00, wholesale: 60.00 },
    ev: { retail_avg: 299.00, cheapest: 149.00, wholesale: 169.60 },
  }
};

const MARKUPS = { std_dom: 0.08, prem_dom: 0.12, ssl_dv: 0.27, ssl_ov: 0.25, ssl_ev: 0.15 };
const cache = new Map<string, { data: any; ts: number }>();
const TTL = 86400000;

function getSmartPrice(wholesale: number, cat: string, tld?: string) {
  let base = cat === 'ssl'
    ? (tld?.includes('ev') ? MARKUPS.ssl_ev : tld?.includes('ov') ? MARKUPS.ssl_ov : MARKUPS.ssl_dv)
    : (['.io','.ai','.tech','.app'].includes(tld||'') ? MARKUPS.prem_dom : MARKUPS.std_dom);
  let final = base;
  const b = cat === 'domains' && tld ? BENCHMARKS.domains[tld as keyof typeof BENCHMARKS.domains] : null;
  let pos = 'standard';
  if (b) {
    const ours = wholesale * (1 + base);
    if (ours <= b.cheapest * 1.03) { final *= 0.92; pos = 'aggressive'; }
    else if (ours < b.retail_avg * 0.85) { final *= 1.05; pos = 'value'; }
  }
  return { price: Math.round(wholesale * (1 + final) * 100) / 100, markup: Math.round(final * 1000) / 1000, pos };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'tlds';
    const exts = searchParams.get('extensions')?.split(',').filter(Boolean) || [];

    const key = `${category}:${exts.join(',')}`;
    const cached = cache.get(key);
    if (cached && Date.now() - cached.ts < TTL) return NextResponse.json(cached.data);

    let url = category === 'tlds'
      ? `https://api.openprovider.eu/v1beta/tlds?with_price=true&is_active=true&extensions=${exts.map(e => e.replace(/^\./, '')).join(',')}`
      : 'https://api.openprovider.eu/v1beta/ssl/products?with_price=true&limit=100';

    const res = await fetchWithAuth(url);
    if (!res.ok) throw new Error(`OpenProvider API ${res.status}`);
    const json = await res.json();

    const items = (json.data.results || []).map((item: any) => {
      if (category === 'tlds') {
        const tld = `.${item.name}`;
        const w = item.prices?.create_price?.reseller?.price || 0;
        const { price, markup, pos } = getSmartPrice(w, 'domains', tld);
        return { extension: tld, price, wholesale: w, markup, position: pos };
      } else {
        const w = item.prices?.[0]?.price?.reseller?.price || 0;
        const { price, markup, pos } = getSmartPrice(w, 'ssl', item.category);
        return { id: item.id, name: item.name, type: item.category, price, wholesale: w, markup, position: pos };
      }
    });

    const out = { success: true, category, count: items.length, data: items };
    cache.set(key, { data: out, ts: Date.now() });
    return NextResponse.json(out);
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
