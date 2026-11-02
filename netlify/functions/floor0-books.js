import { getStore } from '@netlify/blobs';

// 0Fの「書庫」に並ぶ複数のPDF本を、全訪問者で共有するためのAPI。
// Netlify Blobsに、本の一覧(index)と各PDF本体(file:<id>)を保存する。
const STORE_NAME = 'floor0-books';
const INDEX_KEY = 'index';

// タイトルのフォント・大きさとして受け付ける値（src/data/floor0TitleStyle.js と同じ）
const TITLE_FONTS = ['gothic', 'mincho'];
const TITLE_SIZES = ['small', 'medium', 'large'];

// titleFont / titleSize のうち、正しい値だけを target に書き込む
function applyTitleStyle(target, { titleFont, titleSize }) {
    if (TITLE_FONTS.includes(titleFont)) target.titleFont = titleFont;
    if (TITLE_SIZES.includes(titleSize)) target.titleSize = titleSize;
}

async function readIndex(store) {
    const list = await store.get(INDEX_KEY, { type: 'json' });
    return Array.isArray(list) ? list : [];
}

// 表示順: 管理画面で並べ替えた本は order の小さい順。まだ並べ替えていない本
// （新しくアップロードした本など）は、その前に新しい順で並べる。
function sortBooks(books) {
    const hasOrder = (b) => typeof b.order === 'number';
    return books.sort((a, b) => {
        if (hasOrder(a) && hasOrder(b)) return a.order - b.order;
        if (hasOrder(a)) return 1;
        if (hasOrder(b)) return -1;
        return (b.uploadedAt || '').localeCompare(a.uploadedAt || '');
    });
}

export default async (req) => {
    const store = getStore({ name: STORE_NAME, consistency: 'strong' }); // 保存した直後に読み直しても最新の内容が返るようにする

    if (req.method === 'GET') {
        const books = sortBooks(await readIndex(store));
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
        const seriesId = formData.get('seriesId');

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
        // どの本（表紙）の章か。未指定なら「未分類」
        if (typeof seriesId === 'string' && seriesId) meta.seriesId = seriesId;
        applyTitleStyle(meta, { titleFont: formData.get('titleFont'), titleSize: formData.get('titleSize') });

        const books = await readIndex(store);
        // 新しく追加したものは一番下に並べる（今ある order の最大値の次の番号を付ける）
        meta.order = Math.max(-1, ...books.map((x) => (typeof x.order === 'number' ? x.order : -1))) + 1;
        books.push(meta);
        await store.setJSON(INDEX_KEY, books);

        return new Response(JSON.stringify({ ok: true, book: meta }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // 並び順の保存: { order: [id, id, ...] } を受け取り、その順番を全訪問者に共有する
    if (req.method === 'PUT') {
        let body;
        try {
            body = await req.json();
        } catch {
            body = null;
        }
        const ids = body && Array.isArray(body.order) ? body.order : null;
        if (!ids) {
            return new Response(JSON.stringify({ error: 'orderが必要です' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const books = await readIndex(store);
        const next = books.map((b) => {
            const idx = ids.indexOf(b.id);
            if (idx === -1) return b;
            return { ...b, order: idx };
        });
        await store.setJSON(INDEX_KEY, next);
        return new Response(JSON.stringify({ ok: true, books: sortBooks(next) }), {
            headers: { 'Content-Type': 'application/json' },
        });
    }

    // 章の編集: { id, seriesId, title, titleFont, titleSize } 。seriesId を空にすると「未分類」に戻す
    if (req.method === 'PATCH') {
        let body;
        try {
            body = await req.json();
        } catch {
            body = null;
        }
        if (!body || !body.id) {
            return new Response(JSON.stringify({ error: 'idが必要です' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        const books = await readIndex(store);
        const target = books.find((b) => b.id === body.id);
        if (!target) {
            return new Response(JSON.stringify({ error: '章が見つかりません' }), {
                status: 404,
                headers: { 'Content-Type': 'application/json' },
            });
        }
        if ('seriesId' in body) {
            if (body.seriesId) target.seriesId = body.seriesId;
            else delete target.seriesId;
        }
        if (typeof body.title === 'string' && body.title.trim()) target.title = body.title.trim();
        applyTitleStyle(target, body);
        await store.setJSON(INDEX_KEY, books);
        return new Response(JSON.stringify({ ok: true, book: target }), {
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
