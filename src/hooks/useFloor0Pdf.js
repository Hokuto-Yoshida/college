import { useState, useEffect, useCallback } from 'react';

// 0Fの「本」PDFを、全訪問者で共有されるサーバー側(Netlify Functions + Netlify Blobs)に保存する。
// 管理者がアップロードすると、以後は誰がアクセスしてもそのPDFが表示される。
const DEFAULT_PDF_URL = '/pdfs/floor0-demo.pdf';
const DEFAULT_TITLE = '改行位置サンプル';
const META_ENDPOINT = '/api/floor0-pdf';
const FILE_ENDPOINT = '/api/floor0-pdf-file';

export function useFloor0Pdf() {
    const [pdfUrl, setPdfUrl] = useState(DEFAULT_PDF_URL);
    const [pdfName, setPdfName] = useState(null); // null = デフォルトPDFを使用中
    const [bookTitle, setBookTitle] = useState(DEFAULT_TITLE);
    const [loaded, setLoaded] = useState(false);

    const refresh = useCallback(async () => {
        try {
            const res = await fetch(META_ENDPOINT, { cache: 'no-store' });
            if (res.ok) {
                const data = await res.json();
                if (data.exists) {
                    setPdfUrl(`${FILE_ENDPOINT}?v=${encodeURIComponent(data.uploadedAt || Date.now())}`);
                    setPdfName(data.name || 'アップロード済みPDF');
                    setBookTitle(data.title || DEFAULT_TITLE);
                    return;
                }
            }
            setPdfUrl(DEFAULT_PDF_URL);
            setPdfName(null);
            setBookTitle(DEFAULT_TITLE);
        } catch (e) {
            console.error('Floor0のPDF情報取得に失敗しました', e);
            setPdfUrl(DEFAULT_PDF_URL);
            setPdfName(null);
            setBookTitle(DEFAULT_TITLE);
        } finally {
            setLoaded(true);
        }
    }, []);

    useEffect(() => {
        refresh();
    }, [refresh]);

    const uploadPdf = useCallback(async (file, title) => {
        const form = new FormData();
        form.append('file', file);
        if (title) form.append('title', title);

        const res = await fetch(META_ENDPOINT, { method: 'POST', body: form });
        if (!res.ok) {
            const err = await res.json().catch(() => ({}));
            throw new Error(err.error || 'アップロードに失敗しました');
        }
        await refresh();
    }, [refresh]);

    const resetPdf = useCallback(async () => {
        const res = await fetch(META_ENDPOINT, { method: 'DELETE' });
        if (!res.ok) throw new Error('リセットに失敗しました');
        await refresh();
    }, [refresh]);

    return { pdfUrl, pdfName, bookTitle, loaded, uploadPdf, resetPdf, isDefault: pdfName === null };
}
