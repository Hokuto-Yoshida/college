import { getStore } from '@netlify/blobs';

// 0Fのテーブルゾーンに置く「今週のピックアップ」（本1冊・章1つ）を全訪問者で共有するAPI。
// { seriesId, chapterId } を Netlify Blobs に保存する。どちらも空ならテーブルには何も置かない。
const STORE_NAME = 'floor0-books';
const PICKUP_KEY = 'pickup';

const json = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
});

async function readPickup(store) {
    const pickup = await store.get(PICKUP_KEY, { type: 'json' });
    return pickup && typeof pickup === 'object' ? pickup : {};
}

export default async (req) => {
    const store = getStore(STORE_NAME);

    if (req.method === 'GET') {
        return json({ pickup: await readPickup(store) });
    }

    // { seriesId?, chapterId? } のうち送られたものだけ変更する（空文字・null で外す）
    if (req.method === 'PUT') {
        let body;
        try {
            body = await req.json();
        } catch {
            body = null;
        }
        if (!body || typeof body !== 'object') return json({ error: 'リクエストの形式が不正です' }, 400);

        const pickup = await readPickup(store);
        for (const key of ['seriesId', 'chapterId']) {
            if (!(key in body)) continue;
            if (typeof body[key] === 'string' && body[key]) pickup[key] = body[key];
            else delete pickup[key];
        }
        await store.setJSON(PICKUP_KEY, pickup);
        return json({ ok: true, pickup });
    }

    return new Response('Method Not Allowed', { status: 405 });
};

export const config = {
    path: '/api/floor0-pickup',
};
