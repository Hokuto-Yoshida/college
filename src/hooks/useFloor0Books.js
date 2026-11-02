import { useState, useEffect, useCallback } from 'react';

// 0Fの書庫に並ぶ複数のPDF本を、全訪問者で共有されるサーバー側
// (Netlify Functions + Netlify Blobs) から取得・管理するフック。
const LIST_ENDPOINT = '/api/floor0-books';
const FILE_ENDPOINT = '/api/floor0-book-file';
// 本（表紙）。各PDFは本の中の「章」として seriesId で本に紐づく
const SERIES_ENDPOINT = '/api/floor0-series';
const COVER_ENDPOINT = '/api/floor0-series-cover';

// 表紙画像はアップロード前に縮小する（Netlify Functionsの送信サイズ上限に収めるため）
const COVER_MAX_SIZE = 1200;
async function shrinkCoverImage(file) {
    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, COVER_MAX_SIZE / Math.max(bitmap.width, bitmap.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(bitmap.width * scale);
        canvas.height = Math.round(bitmap.height * scale);
        canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        const blob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/jpeg', 0.85));
        return blob ? new File([blob], 'cover.jpg', { type: 'image/jpeg' }) : file;
    } catch (e) {
        console.error('表紙画像の縮小に失敗したため、元の画像を送ります', e);
        return file;
    }
}

// タイトルのフォント・大きさ（{ titleFont, titleSize }）をフォームに入れる
function appendTitleStyle(form, { titleFont, titleSize } = {}) {
    if (titleFont) form.append('titleFont', titleFont);
    if (titleSize) form.append('titleSize', titleSize);
}

async function throwIfFailed(res, fallbackMessage) {
    if (res.ok) return;
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || fallbackMessage);
}

// アップロードされた本が1冊もない間だけ表示する、デフォルトのサンプル本
const DEFAULT_BOOK = {
    id: 'default',
    title: '改行位置サンプル',
    name: 'floor0-demo.pdf',
    pdfUrl: '/pdfs/floor0-demo.pdf',
    isDefault: true,
};

export function useFloor0Books() {
    const [rawBooks, setRawBooks] = useState([]);
    const [rawSeries, setRawSeries] = useState([]);
    const [loaded, setLoaded] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const [res, seriesRes] = await Promise.all([
                fetch(LIST_ENDPOINT, { cache: 'no-store' }),
                fetch(SERIES_ENDPOINT, { cache: 'no-store' }),
            ]);
            if (res.ok) {
                const data = await res.json();
                setRawBooks(Array.isArray(data.books) ? data.books : []);
            } else {
                setRawBooks([]);
            }
            if (seriesRes.ok) {
                const data = await seriesRes.json();
                setRawSeries(Array.isArray(data.series) ? data.series : []);
            } else {
                setRawSeries([]);
            }
        } catch (e) {
            console.error('0階の本の一覧取得に失敗しました', e);
            setRawBooks([]);
            setRawSeries([]);
        } finally {
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    // 章（PDF）のアップロード。seriesId でどの本の章かを指定する
    const uploadBook = useCallback(async (file, title, seriesId, titleStyle) => {
        const form = new FormData();
        form.append('file', file);
        if (title) form.append('title', title);
        if (seriesId) form.append('seriesId', seriesId);
        appendTitleStyle(form, titleStyle);

        const res = await fetch(LIST_ENDPOINT, { method: 'POST', body: form });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'アップロードに失敗しました');
        }
        await refresh();
    }, [refresh]);

    const deleteBook = useCallback(async (id) => {
        const res = await fetch(`${LIST_ENDPOINT}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('削除に失敗しました');
        await refresh();
    }, [refresh]);

    // 並び順をサーバーに保存する（全端末・全訪問者に反映される）
    const reorderBooks = useCallback(async (orderedIds) => {
        // 先に画面へ反映し、失敗したらサーバーの状態に戻す
        setRawBooks((prev) => {
            const byId = new Map(prev.map((b) => [b.id, b]));
            const ordered = orderedIds.map((id) => byId.get(id)).filter(Boolean);
            const rest = prev.filter((b) => !orderedIds.includes(b.id));
            return [...rest, ...ordered];
        });
        try {
            const res = await fetch(LIST_ENDPOINT, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: orderedIds }),
            });
            if (!res.ok) throw new Error('並び順の保存に失敗しました');
        } finally {
            await refresh();
        }
    }, [refresh]);

    // 章の編集。{ seriesId, title, titleFont, titleSize } のうち指定したものだけ更新する
    // （seriesId を空にすると「未分類」）
    const updateChapter = useCallback(async (id, changes) => {
        const res = await fetch(LIST_ENDPOINT, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...changes }),
        });
        await throwIfFailed(res, '章の更新に失敗しました');
        await refresh();
    }, [refresh]);

    const createSeries = useCallback(async (title, coverFile, titleStyle) => {
        const form = new FormData();
        form.append('title', title);
        appendTitleStyle(form, titleStyle);
        if (coverFile) form.append('cover', await shrinkCoverImage(coverFile));
        const res = await fetch(SERIES_ENDPOINT, { method: 'POST', body: form });
        await throwIfFailed(res, '本の追加に失敗しました');
        await refresh();
    }, [refresh]);

    // { title, titleFont, titleSize, coverFile, removeCover } のうち指定したものだけ更新する
    const updateSeries = useCallback(async (id, { title, titleFont, titleSize, coverFile, removeCover } = {}) => {
        const form = new FormData();
        form.append('id', id);
        if (title) form.append('title', title);
        appendTitleStyle(form, { titleFont, titleSize });
        if (removeCover) form.append('removeCover', '1');
        else if (coverFile) form.append('cover', await shrinkCoverImage(coverFile));
        const res = await fetch(SERIES_ENDPOINT, { method: 'PATCH', body: form });
        await throwIfFailed(res, '本の更新に失敗しました');
        await refresh();
    }, [refresh]);

    // 本を削除する（中の章は消さずに「未分類」に戻る）
    const deleteSeries = useCallback(async (id) => {
        const res = await fetch(`${SERIES_ENDPOINT}?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
        await throwIfFailed(res, '本の削除に失敗しました');
        await refresh();
    }, [refresh]);

    // 本の並び順をサーバーに保存する（全端末・全訪問者に反映される）
    const reorderSeries = useCallback(async (orderedIds) => {
        // 先に画面へ反映し、失敗したらサーバーの状態に戻す
        setRawSeries((prev) => {
            const byId = new Map(prev.map((s) => [s.id, s]));
            const ordered = orderedIds.map((id) => byId.get(id)).filter(Boolean);
            const rest = prev.filter((s) => !orderedIds.includes(s.id));
            return [...rest, ...ordered];
        });
        try {
            const res = await fetch(SERIES_ENDPOINT, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ order: orderedIds }),
            });
            await throwIfFailed(res, '並び順の保存に失敗しました');
        } finally {
            await refresh();
        }
    }, [refresh]);

    const series = rawSeries.map((s) => ({
        ...s,
        coverUrl: s.coverUpdatedAt
            ? `${COVER_ENDPOINT}?id=${encodeURIComponent(s.id)}&v=${encodeURIComponent(s.coverUpdatedAt)}`
            : null,
    }));

    const books = rawBooks.length > 0
        ? rawBooks.map((b) => ({
            ...b,
            pdfUrl: `${FILE_ENDPOINT}?id=${encodeURIComponent(b.id)}&v=${encodeURIComponent(b.uploadedAt || '')}`,
        }))
        : [DEFAULT_BOOK];

    return {
        books, rawBooks, series, loaded, refresh,
        uploadBook, deleteBook, reorderBooks, updateChapter,
        createSeries, updateSeries, deleteSeries, reorderSeries,
    };
}
