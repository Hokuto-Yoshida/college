import { getStore } from '@netlify/blobs';

// 0Fの「本」PDFを全訪問者で共有するためのAPI。
// Netlify Blobs（サイト単位の永続ストレージ）にPDF本体とメタ情報を保存する。
const STORE_NAME = 'floor0-book';
const BLOB_KEY = 'pdf';
const META_KEY = 'meta';

export default async (req) => {
    const store = getStore(STORE_NAME);

    if (req.method === 'GET') {
        const meta = await store.get(META_KEY, { type: 'json' });
        if (!meta) {
            return new Response(JSON.stringify({ exists: false }), {
                headers: { 'Content-Type': 'application/json' },
            });
        }
        return new Response(JSON.stringify({ exists: true, ...meta }), {
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

        const arrayBuffer = await file.arrayBuffer();
        await store.set(BLOB_KEY, arrayBuffer);

        const meta = {
            name: file.name || 'uploaded.pdf',
            title: (title && title.trim()) || (file.name || '').replace(/\.pdf$/i, '') || '本',
            uploadedAt: new Date().toISOString(),
        };
        await store.setJSON(META_KEY, meta);

        return new Response(JSON.stringify({ ok: true, ...meta }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    if (req.method === 'DELETE') {
        await store.delete(BLOB_KEY);
        await store.delete(META_KEY);
        return new Response(JSON.stringify({ ok: true }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    return new Response('Method Not Allowed', { status: 405 });
};

export const config = {
    path: '/api/floor0-pdf',
};
