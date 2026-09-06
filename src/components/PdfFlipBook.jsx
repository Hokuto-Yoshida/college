import React, { useEffect, useRef, useState } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { BookOpen, AlertTriangle } from 'lucide-react';
import * as pdfjsLib from 'pdfjs-dist';
// Vite: `?url` gives us the built worker file's final URL so pdf.js can load it in a Worker.
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// react-pageflip（page-flip）は forwardRef で渡したルート要素そのものを内部で
// クローン/差し替えして扱うため、ルートに直接背景などを指定すると失われることがある。
// ルートは素の入れ物にし、見た目は内側のdivに持たせることで回避する。

// 本文ページ（PDFの1ページをcanvasでレンダリングした画像）
const PdfPage = React.forwardRef(({ imageUrl, pageNumber }, ref) => (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
        <div style={{ background: '#fdfaf2', width: '100%', height: '100%', overflow: 'hidden' }}>
            <img
                src={imageUrl}
                alt={`page ${pageNumber}`}
                draggable={false}
                style={{ width: '100%', height: '100%', objectFit: 'contain', display: 'block', userSelect: 'none' }}
            />
        </div>
    </div>
));

// 表紙ページ
const CoverPage = React.forwardRef(({ title }, ref) => (
    <div ref={ref} style={{ width: '100%', height: '100%' }}>
        <div
            style={{
                width: '100%', height: '100%', boxSizing: 'border-box',
                background: 'linear-gradient(160deg, #223324 0%, #10190f 100%)',
                border: '10px solid #0c130c',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                padding: '12%', position: 'relative',
            }}
        >
            <div style={{ position: 'absolute', inset: '6%', border: '1.5px solid rgba(212,175,55,0.55)' }} />
            <BookOpen size={36} color="#d4af37" style={{ marginBottom: 20, filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
            <h2 style={{
                margin: 0, color: '#d4af37', textAlign: 'center', fontFamily: 'var(--font-jp)',
                fontSize: 'clamp(1rem, 4vw, 1.4rem)', lineHeight: 1.9, letterSpacing: '0.05em',
                textShadow: '0 1px 2px rgba(0,0,0,0.6)',
            }}>
                {title}
            </h2>
        </div>
    </div>
));

/**
 * 長いPDFを本のようにページめくりで見せるビューア。
 * pdf.js でページを画像化 → react-pageflip で表示。
 */
export function PdfFlipBook({ pdfUrl, title = '' }) {
    const [pages, setPages] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [progress, setProgress] = useState(0);
    const [status, setStatus] = useState('loading'); // 'loading' | 'ready' | 'error'
    const [error, setError] = useState('');
    const [pageSize, setPageSize] = useState({ width: 420, height: 594 });
    const bookRef = useRef(null);

    useEffect(() => {
        let cancelled = false;
        setStatus('loading');
        setPages([]);
        setProgress(0);
        setError('');

        (async () => {
            try {
                const loadingTask = pdfjsLib.getDocument({ url: pdfUrl });
                loadingTask.onProgress = (p) => {
                    if (p.total && !cancelled) setProgress(Math.round((p.loaded / p.total) * 40));
                };
                const pdf = await loadingTask.promise;
                if (cancelled) return;

                const numPages = pdf.numPages;
                setTotalPages(numPages);

                const rendered = [];
                for (let i = 1; i <= numPages; i++) {
                    if (cancelled) return;
                    const page = await pdf.getPage(i);
                    const viewport = page.getViewport({ scale: 2 });
                    if (i === 1) {
                        setPageSize({ width: viewport.width / 2, height: viewport.height / 2 });
                    }
                    const canvas = document.createElement('canvas');
                    canvas.width = viewport.width;
                    canvas.height = viewport.height;
                    const ctx = canvas.getContext('2d');
                    await page.render({ canvasContext: ctx, viewport }).promise;
                    rendered.push(canvas.toDataURL('image/jpeg', 0.85));
                    if (!cancelled) setProgress(40 + Math.round((i / numPages) * 60));
                }

                if (!cancelled) {
                    setPages(rendered);
                    setStatus('ready');
                }
            } catch (e) {
                if (!cancelled) {
                    setError(e?.message || 'PDFの読み込みに失敗しました');
                    setStatus('error');
                }
            }
        })();

        return () => { cancelled = true; };
    }, [pdfUrl]);

    if (status === 'error') {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '40vh', color: '#fff', fontFamily: 'var(--font-jp)', textAlign: 'center', gap: 12,
            }}>
                <AlertTriangle size={32} color="#f87171" />
                <div>本の読み込みに失敗しました</div>
                <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>{error}</div>
            </div>
        );
    }

    if (status === 'loading') {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                height: '40vh', color: '#fff', fontFamily: 'var(--font-jp)',
            }}>
                <BookOpen size={36} color="#d4af37" style={{ marginBottom: 16 }} />
                <div>本を読み込んでいます… {progress}%</div>
                {totalPages > 0 && (
                    <div style={{ fontSize: '0.8rem', opacity: 0.65, marginTop: 8 }}>
                        {pages.length}/{totalPages} ページ
                    </div>
                )}
            </div>
        );
    }

    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '100%', height: '100%',
        }}>
            <HTMLFlipBook
                ref={bookRef}
                width={pageSize.width}
                height={pageSize.height}
                size="stretch"
                minWidth={260}
                maxWidth={1400}
                minHeight={368}
                maxHeight={1980}
                showCover
                maxShadowOpacity={0.5}
                flippingTime={700}
                className="pdf-flipbook"
                style={{ margin: '0 auto', maxHeight: '88vh' }}
            >
                <CoverPage title={title} />
                {pages.map((src, idx) => (
                    <PdfPage key={idx} imageUrl={src} pageNumber={idx + 1} />
                ))}
            </HTMLFlipBook>
        </div>
    );
}
