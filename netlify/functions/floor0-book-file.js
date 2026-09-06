import { getStore } from '@netlify/blobs';

// 0Fの書庫にある、指定したidのPDF本体を配信する。
const STORE_NAME = 'floor0-books';

export default async (req) => {
    if (req.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const url = new URL(req.url);
    const id = url.searchParams.get('id');
    if (!id) {
        return new Response('Bad Request', { status: 400 });
    }

    const store = getStore(STORE_NAME);
    const data = await store.get(`file:${id}`, { type: 'arrayBuffer' });

    if (!data) {
        return new Response('Not Found', { status: 404 });
    }

    return new Response(data, {
        headers: {
            'Content-Type': 'application/pdf',
            'Cache-Control': 'no-store',
        },
    });
};

export const config = {
    path: '/api/floor0-book-file',
};
