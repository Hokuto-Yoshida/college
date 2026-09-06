import { getStore } from '@netlify/blobs';

// 0Fの「書庫」に並ぶ複数のPDF本を、全訪問者で共有するためのAPI。
// Netlify Blobsに、本の一覧(index)と各PDF本体(file:<id>)を保存する。
const STORE_NAME = 'floor0-books';
const INDEX_KEY = 'index';

async function readIndex(store) {
    const list = await store.get(INDEX_KEY, { type: 'json' });
    return Array.isArray(list) ? list : [];
}

export default async (req) => {
    const store = getStore(STORE_NAME);

    if (req.method === 'GET') {
        const books = await readIndex(store);
        books.sort((a, b) => (b.uploadedAt || '').localeCompare(a.uploadedAt || ''));
        return new Response(JSON.stringify({ books }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (req.method === 'POST') {
        let formData;
        try {
            formData = await req.formData();
        } catch {
            return new Response(JSON.stringify({ error: 'リクエストの形式が不正です' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const file = formData.get('file');
        const title = formData.get('title');

        if (!file || typeof file === 'string') {
            return new Response(JSON.stringify({ error: 'PDFファイルがありません' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        if (file.type && file.type !== 'application/pdf' && !file.name?.toLowerCase().endsWith('.pdf')) {
            return new Response(JSON.stringify({ error: 'PDFファイルを指定してください' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }

        const id = crypto.randomUUID();
        const arrayBuffer = await file.arrayBuffer();
        await store.set(`file:${id}`, arrayBuffer);

        const meta = {
            id,
            name: file.name || 'uploaded.pdf',
            title: (title && title.trim()) || (file.name || '').replace(/\.pdf$/i, '') || '本',
            uploadedAt: new Date().toISOString(),
        };

        const books = await readIndex(store);
        books.push(meta);
        await store.setJSON(INDEX_KEY, books);

        return new Response(JSON.stringify({ ok: true, book: meta }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (req.method === 'DELETE') {
        const url = new URL(req.url);
        const id = url.searchParams.get('id');
        if (!id) {
            return new Response(JSON.stringify({ error: 'idが必要です' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const books = await readIndex(store);
        const next = books.filter((b) => b.id !== id);
        await store.setJSON(INDEX_KEY, next);
        await store.delete(`file:${id}`);
        return new Response(JSON.stringify({ ok: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response('Method Not Allowed', { status: 405 });
};

export const config = {
    path: '/api/floor0-books',
};
