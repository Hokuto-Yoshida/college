import { getStore } from '@netlify/blobs';

// 0Fの「本」の実PDFバイナリを配信する。
const STORE_NAME = 'floor0-book';
const BLOB_KEY = 'pdf';

export default async (req) => {
    if (req.method !== 'GET') {
        return new Response('Method Not Allowed', { status: 405 });
    }

    const store = getStore(STORE_NAME);
    const data = await store.get(BLOB_KEY, { type: 'arrayBuffer' });

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
    path: '/api/floor0-pdf-file',
};
