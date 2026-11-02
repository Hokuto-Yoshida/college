import { getStore } from '@netlify/blobs';

// 0Fの書庫の「本」（表紙）を管理するAPI。
// 各PDFは本の中の「章」としてアップロードし（floor0-books）、seriesId でこの本に紐づける。
// Netlify Blobsに、本の一覧(series)と各表紙画像(cover:<id>)を保存する。
const STORE_NAME = 'floor0-books';
const SERIES_KEY = 'series';
const CHAPTER_INDEX_KEY = 'index';

// タイトルのフォント・大きさとして受け付ける値（src/data/floor0TitleStyle.js と同じ）
const TITLE_FONTS = ['gothic', 'mincho'];
const TITLE_SIZES = ['small', 'medium', 'large'];

// フォームの titleFont / titleSize のうち、正しい値だけを target に書き込む
function applyTitleStyle(target, formData) {
    const font = formData.get('titleFont');
    const size = formData.get('titleSize');
    if (TITLE_FONTS.includes(font)) target.titleFont = font;
    if (TITLE_SIZES.includes(size)) target.titleSize = size;
}

const json = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
});

async function readList(store, key) {
    const list = await store.get(key, { type: 'json' });
    return Array.isArray(list) ? list : [];
}

// 表示順: 並べ替えた本は order の小さい順。まだ並べ替えていない本は、その前に新しい順で並べる
function sortSeries(series) {
    const hasOrder = (s) => typeof s.order === 'number';
    return series.sort((a, b) => {
        if (hasOrder(a) && hasOrder(b)) return a.order - b.order;
        if (hasOrder(a)) return 1;
        if (hasOrder(b)) return -1;
        return (b.createdAt || '').localeCompare(a.createdAt || '');
    });
}

// フォームの表紙画像を保存する。画像でなければエラーメッセージを返す
async function saveCover(store, id, cover) {
    if (!cover || typeof cover === 'string' || cover.size === 0) return null;
    if (cover.type && !cover.type.startsWith('image/')) return '表紙には画像ファイルを指定してください';
    await store.set(`cover:${id}`, await cover.arrayBuffer(), {
        metadata: { contentType: cover.type || 'image/jpeg' },
    });
    return null;
}

export default async (req) => {
    const store = getStore(STORE_NAME);

    if (req.method === 'GET') {
        return json({ series: sortSeries(await readList(store, SERIES_KEY)) });
    }

    // 本の追加: title と cover(画像・任意)
    if (req.method === 'POST') {
        let formData;
        try {
            formData = await req.formData();
        } catch {
            return json({ error: 'リクエストの形式が不正です' }, 400);
        }
        const title = (formData.get('title') || '').trim();
        if (!title) return json({ error: '本のタイトルを入力してください' }, 400);

        const id = crypto.randomUUID();
        const coverError = await saveCover(store, id, formData.get('cover'));
        if (coverError) return json({ error: coverError }, 400);

        const now = new Date().toISOString();
        const meta = { id, title, createdAt: now };
        applyTitleStyle(meta, formData);
        if (formData.get('cover') && typeof formData.get('cover') !== 'string') meta.coverUpdatedAt = now;

        const series = await readList(store, SERIES_KEY);
        // 新しく追加したものは一番下に並べる（今ある order の最大値の次の番号を付ける）
        meta.order = Math.max(-1, ...series.map((x) => (typeof x.order === 'number' ? x.order : -1))) + 1;
        series.push(meta);
        await store.setJSON(SERIES_KEY, series);
        return json({ ok: true, series: meta });
    }

    // 本の編集: id と title / cover(画像) / removeCover
    if (req.method === 'PATCH') {
        let formData;
        try {
            formData = await req.formData();
        } catch {
            return json({ error: 'リクエストの形式が不正です' }, 400);
        }
        const id = formData.get('id');
        const series = await readList(store, SERIES_KEY);
        const target = series.find((s) => s.id === id);
        if (!target) return json({ error: '本が見つかりません' }, 404);

        const title = formData.get('title');
        if (typeof title === 'string' && title.trim()) target.title = title.trim();
        applyTitleStyle(target, formData);

        if (formData.get('removeCover') === '1') {
            await store.delete(`cover:${id}`);
            delete target.coverUpdatedAt;
        } else {
            const cover = formData.get('cover');
            const coverError = await saveCover(store, id, cover);
            if (coverError) return json({ error: coverError }, 400);
            if (cover && typeof cover !== 'string' && cover.size > 0) target.coverUpdatedAt = new Date().toISOString();
        }

        await store.setJSON(SERIES_KEY, series);
        return json({ ok: true, series: target });
    }

    // 並び順の保存: { order: [id, id, ...] }
    if (req.method === 'PUT') {
        let body;
        try {
            body = await req.json();
        } catch {
            body = null;
        }
        const ids = body && Array.isArray(body.order) ? body.order : null;
        if (!ids) return json({ error: 'orderが必要です' }, 400);
        const series = await readList(store, SERIES_KEY);
        const next = series.map((s) => {
            const idx = ids.indexOf(s.id);
            return idx === -1 ? s : { ...s, order: idx };
        });
        await store.setJSON(SERIES_KEY, next);
        return json({ ok: true, series: sortSeries(next) });
    }

    // 本の削除: 本だけを消し、中の章（PDF）は「未分類」に戻す
    if (req.method === 'DELETE') {
        const id = new URL(req.url).searchParams.get('id');
        if (!id) return json({ error: 'idが必要です' }, 400);

        const series = await readList(store, SERIES_KEY);
        await store.setJSON(SERIES_KEY, series.filter((s) => s.id !== id));
        await store.delete(`cover:${id}`);

        const chapters = await readList(store, CHAPTER_INDEX_KEY);
        if (chapters.some((c) => c.seriesId === id)) {
            await store.setJSON(CHAPTER_INDEX_KEY, chapters.map((c) => {
                if (c.seriesId !== id) return c;
                const { seriesId: _removed, ...rest } = c;
                return rest;
            }));
        }
        return json({ ok: true });
    }

    return new Response('Method Not Allowed', { status: 405 });
};

export const config = {
    path: '/api/floor0-series',
};
