import { useState, useEffect, useCallback } from 'react';

// 0Fの書庫に並ぶ複数のPDF本を、全訪問者で共有されるサーバー側
// (Netlify Functions + Netlify Blobs) から取得・管理するフック。
const LIST_ENDPOINT = '/api/floor0-books';
const FILE_ENDPOINT = '/api/floor0-book-file';

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
    const [loaded, setLoaded] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch(LIST_ENDPOINT, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                setRawBooks(Array.isArray(data.books) ? data.books : []);
            } else {
                setRawBooks([]);
            }
        } catch (e) {
            console.error('0階の本の一覧取得に失敗しました', e);
            setRawBooks([]);
        } finally {
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const uploadBook = useCallback(async (file, title) => {
        const form = new FormData();
        form.append('file', file);
        if (title) form.append('title', title);

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

    const books = rawBooks.length > 0
        ? rawBooks.map((b) => ({
            ...b,
            pdfUrl: `${FILE_ENDPOINT}?id=${encodeURIComponent(b.id)}&v=${encodeURIComponent(b.uploadedAt || '')}`,
        }))
        : [DEFAULT_BOOK];

    return { books, rawBooks, loaded, uploadBook, deleteBook, refresh };
}
