import { getStore } from '@netlify/blobs';

// 0Fの書庫にある、指定したidの本の表紙画像を配信する。
const STORE_NAME = 'floor0-books';

export default async (req) => {
    if (req.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const id = new URL(req.url).searchParams.get('id');
    if (!id) {
        return new Response('Bad Request', { status: 400 });
    }

    const store = getStore(STORE_NAME);
    const result = await store.getWithMetadata(`cover:${id}`, { type: 'arrayBuffer' });

    if (!result || !result.data) {
        return new Response('Not Found', { status: 404 });
    }

    return new Response(result.data, {
        headers: {
            'Content-Type': result.metadata?.contentType || 'image/jpeg',
            // URLに更新日時(v)を付けているので、同じURLの間は長めにキャッシュしてよい
            'Cache-Control': 'public, max-age=86400',
        },
    });
};

export const config = {
    path: '/api/floor0-series-cover',
};
