import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, animate, useMotionValue } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

// JSX の <motion.div> だと、このプロジェクトの ESLint 設定が motion を「使っていない」と誤検出するため、名前を付けて使う
const MotionDiv = motion.div;

// 0F 本棚ゾーンの「アップの本棚」。背景の本棚の写真ごとカメラで寄って、棚板の上に本を立てて並べる。
// 上下左右の矢印（キーボードの矢印・スワイプでも）でカメラを動かし、棚の中を見て回る。背景と本は一緒に動く。

// 本棚の写真（src/assets/floor_0f_shelf.png, 1536×1024）の中の、本を置ける場所（写真のピクセル）
const SHELF_IMAGE_SIZE = { w: 1536, h: 1024 };
const SHELF_INNER = { left: 455, right: 1090 }; // 棚の内側の左右の端
// 本を置く4段: top = その段の天井（上の棚板の下）、stand = 本を立てる棚板の上面
const SHELF_ROWS = [
    { top: 250, stand: 357 },
    { top: 386, stand: 497 },
    { top: 512, stand: 630 },
    { top: 646, stand: 749 },
];
const BOOKS_PER_ROW = 7;
const BOOKS_PER_PAGE = BOOKS_PER_ROW * SHELF_ROWS.length; // これを超えたら次のページ（次の棚）に並べる
const BOOK_H = 84; // 本の高さ（写真のピクセル。いちばん低い段にも収まる大きさ）
const BOOK_W = BOOK_H / 1.47; // 表紙の縦横比に合わせる
const SLOT_W = (SHELF_INNER.right - SHELF_INNER.left) / BOOKS_PER_ROW;
const ROW_H = 106; // 1段の高さの目安（カメラの寄り具合を決める）
const EDGE_PAD = 36; // 左右の端まで行ったとき、棚の外側をどれだけ見せるか

// 最初に見せる段（上から2段目。本棚の真ん中あたり）
const START_ROW = 1;
// 本を並べ始める段。全部の段を使わないときは、最初に見せる段（2段目）から並べる（最初に空の段が映らないように）
const firstRowFor = (count) => (Math.ceil(count / BOOKS_PER_ROW) >= SHELF_ROWS.length ? 0 : START_ROW);

// 本の置き場所（写真のピクセル）。段の途中で終わる最後の段は、真ん中に寄せて並べる
function slotPositions(count) {
    const positions = [];
    const firstRow = firstRowFor(count);
    for (let i = 0; i < count; i++) {
        const row = firstRow + Math.floor(i / BOOKS_PER_ROW);
        const inRow = Math.min(BOOKS_PER_ROW, count - (row - firstRow) * BOOKS_PER_ROW);
        const col = i % BOOKS_PER_ROW;
        const offset = (BOOKS_PER_ROW - inRow) / 2; // 途中までの段は真ん中に寄せる
        const cx = SHELF_INNER.left + SLOT_W * (col + offset + 0.5);
        positions.push({ row, x: cx - BOOK_W / 2, y: SHELF_ROWS[row].stand - BOOK_H });
    }
    return positions;
}

// 画面の大きさから、カメラの寄り具合（写真 1px が画面の何 px か）を決める
// 1段が見える範囲の高さの半分ほどになるように寄る（寄りすぎると写真がぼやけるため）。縦長の画面では、横に本が2冊ほど見える程度にとどめる
function cameraScale(viewW, viewH) {
    const byHeight = (viewH * 0.5) / ROW_H;
    const byWidth = viewW / (SLOT_W * 2.2);
    const cover = Math.max(viewW / SHELF_IMAGE_SIZE.w, viewH / SHELF_IMAGE_SIZE.h); // 写真が画面を覆いきる最小の寄り
    return Math.max(cover, Math.min(byHeight, byWidth));
}

function useViewSize() {
    const get = () => ({ w: window.innerWidth, h: window.innerHeight });
    const [size, setSize] = useState(get);
    useEffect(() => {
        const onResize = () => setSize(get());
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);
    return size;
}

const arrowBase = {
    position: 'fixed', zIndex: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
    width: '44px', height: '44px', borderRadius: '50%', border: 'none', cursor: 'pointer',
    background: 'rgba(0,0,0,0.18)', color: 'rgba(255,255,255,0.75)',
    transition: 'opacity 0.25s ease, background 0.2s ease',
};

/**
 * items: 並べる本 [{ key, node }]（node は本の見た目）
 * imageSrc: 本棚の写真
 * opacity / blur / x: 出てくるときのふわっと・ぼかし、学びの準備室への横スクロール（motion value）
 * interactive: 本を押したり矢印で動かしたりできるか（中身が出てから）
 * listMode: 本の一覧を出しているか。false（章の一覧など）のときは本と矢印を消して、背景としてだけ置く
 * topInset / bottomInset: 上に固定したタブ・検索窓、下の注意書きの高さ。この間に段が来るようにカメラを置く
 * emptyMessage: 本が1冊もないときに出す文（検索で見つからないときなど）
 * resetKey: 変わったらカメラを最初の位置に戻す（検索の言葉など）
 */
export function Floor0ShelfScene({ items, imageSrc, opacity, blur, x, interactive, listMode, topInset = 0, bottomInset = 0, emptyMessage, resetKey }) {
    const view = useViewSize();
    const scale = cameraScale(view.w, view.h - topInset - bottomInset);
    const pageCount = Math.max(1, Math.ceil(items.length / BOOKS_PER_PAGE));
    const [pageState, setPage] = useState(0);
    const [rowState, setRow] = useState(START_ROW);
    const [camX, setCamX] = useState(null); // 見ている真ん中（写真のピクセル）。null = 棚の真ん中

    // 検索の言葉などが変わったら、最初のページの2段目・真ん中に戻す
    const [lastResetKey, setLastResetKey] = useState(resetKey);
    if (lastResetKey !== resetKey) {
        setLastResetKey(resetKey);
        setPage(0);
        setRow(START_ROW);
        setCamX(null);
    }

    // 本が減ってページや段がなくなったときは、ある所までに収める
    const page = Math.min(pageState, pageCount - 1);
    const pageItems = useMemo(() => items.slice(page * BOOKS_PER_PAGE, (page + 1) * BOOKS_PER_PAGE), [items, page]);
    const positions = useMemo(() => slotPositions(pageItems.length), [pageItems.length]);
    // 本が並んでいる段の範囲（この中だけ上下に動ける）
    const rowsUsed = Math.max(1, Math.ceil(pageItems.length / BOOKS_PER_ROW));
    const firstRow = firstRowFor(pageItems.length);
    const lastRow = firstRow + rowsUsed - 1;
    const row = Math.min(lastRow, Math.max(firstRow, rowState));

    // 横に動ける範囲（写真のピクセル）。画面の方が棚より広いときは真ん中に固定
    const halfViewW = view.w / 2 / scale;
    const minX = SHELF_INNER.left - EDGE_PAD + halfViewW;
    const maxX = SHELF_INNER.right + EDGE_PAD - halfViewW;
    const centerX = (SHELF_INNER.left + SHELF_INNER.right) / 2;
    const canPanX = minX < maxX;
    const clampX = (v) => (canPanX ? Math.min(maxX, Math.max(minX, v)) : centerX);
    const curX = clampX(camX ?? centerX);
    const rowCenterY = (SHELF_ROWS[row].top + SHELF_ROWS[row].stand) / 2;

    // 写真のどこを画面のどこに置くか: 見ている点（curX, rowCenterY）を、上下の余白を除いた範囲の真ん中に
    const areaCenterY = topInset + (view.h - topInset - bottomInset) / 2;
    const targetTx = view.w / 2 - curX * scale;
    const targetTy = areaCenterY - rowCenterY * scale;
    const tx = useMotionValue(targetTx);
    const ty = useMotionValue(targetTy);
    const firstMove = useRef(true);
    useLayoutEffect(() => {
        // 最初と、画面の大きさが変わったときはそのまま置く。矢印で動かしたときはすっと動かす
        if (firstMove.current) {
            tx.set(targetTx); ty.set(targetTy); firstMove.current = false;
            return undefined;
        }
        const a = animate(tx, targetTx, { duration: 0.6, ease: [0.25, 0.8, 0.3, 1] });
        const b = animate(ty, targetTy, { duration: 0.6, ease: [0.25, 0.8, 0.3, 1] });
        return () => { a.stop(); b.stop(); };
    }, [targetTx, targetTy, tx, ty]);
    useEffect(() => { tx.set(targetTx); ty.set(targetTy); }, [view.w, view.h, scale]); // eslint-disable-line react-hooks/exhaustive-deps

    const atLeft = !canPanX || curX <= minX + 0.5;
    const atRight = !canPanX || curX >= maxX - 0.5;
    const can = {
        left: !atLeft || page > 0,
        right: !atRight || page < pageCount - 1,
        up: row > firstRow,
        down: row < lastRow,
    };
    const move = (dir) => {
        if (!can[dir]) return;
        if (dir === 'up') setRow(row - 1);
        else if (dir === 'down') setRow(row + 1);
        else if (dir === 'left') {
            if (!atLeft) setCamX(clampX(curX - SLOT_W));
            else { setPage(page - 1); setCamX(maxX); setRow(START_ROW); } // 前の棚（ページ）の右端へ
        } else if (dir === 'right') {
            if (!atRight) setCamX(clampX(curX + SLOT_W));
            else { setPage(page + 1); setCamX(minX); setRow(START_ROW); } // 次の棚（ページ）の左端へ
        }
    };
    const moveRef = useRef(move);
    useEffect(() => { moveRef.current = move; }); // キーボードの矢印は、いつも最新の move を呼ぶ

    const enabled = interactive && listMode;
    // キーボードの矢印でも動かす（文字を入力しているときは除く）
    useEffect(() => {
        if (!enabled) return undefined;
        const onKey = (e) => {
            const tag = e.target?.tagName;
            if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target?.isContentEditable) return;
            const dir = { ArrowLeft: 'left', ArrowRight: 'right', ArrowUp: 'up', ArrowDown: 'down' }[e.key];
            if (!dir) return;
            e.preventDefault();
            moveRef.current(dir);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [enabled]);

    // スワイプ（指・マウスでなぞる）でも動かす。なぞった向きと反対に棚が動く＝なぞった先の方を見に行く
    const swipe = useRef(null);
    const swiped = useRef(false); // スワイプした直後は、指を離した所の本を開かない
    const onPointerDown = (e) => { if (e.pointerType !== 'mouse') swipe.current = { x: e.clientX, y: e.clientY }; };
    const onPointerUp = (e) => {
        const s = swipe.current;
        swipe.current = null;
        if (!s) return;
        const dx = e.clientX - s.x;
        const dy = e.clientY - s.y;
        if (Math.max(Math.abs(dx), Math.abs(dy)) < 40) return;
        swiped.current = true;
        setTimeout(() => { swiped.current = false; }, 400);
        if (Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 'right' : 'left');
        else move(dy < 0 ? 'down' : 'up');
    };

    const imgW = SHELF_IMAGE_SIZE.w * scale;
    const imgH = SHELF_IMAGE_SIZE.h * scale;
    const arrowMidY = areaCenterY;

    return createPortal(
        <MotionDiv
            style={{
                position: 'fixed', inset: 0, overflow: 'hidden',
                // 本の一覧のときは中身より手前（本を押せるように）。章の一覧などでは背景として中身の奥に置く
                zIndex: listMode ? 1 : -1,
                opacity, filter: blur, x,
                pointerEvents: enabled ? 'auto' : 'none',
                touchAction: enabled ? 'none' : 'auto',
            }}
            onPointerDown={enabled ? onPointerDown : undefined}
            onPointerUp={enabled ? onPointerUp : undefined}
            onPointerCancel={() => { swipe.current = null; }}
            onClickCapture={(e) => { if (swiped.current) { e.stopPropagation(); e.preventDefault(); } }}
        >
            <MotionDiv style={{
                position: 'absolute', left: 0, top: 0, width: imgW, height: imgH, x: tx, y: ty,
                backgroundImage: `url(${imageSrc})`, backgroundSize: '100% 100%',
            }}>
                <AnimatePresence mode="wait">
                    {listMode && (
                        <MotionDiv
                            key={`page-${page}`}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.35 }}
                            style={{ position: 'absolute', inset: 0 }}
                        >
                            {pageItems.map((item, i) => {
                                const p = positions[i];
                                return (
                                    <div key={item.key} style={{
                                        position: 'absolute', left: p.x * scale, top: p.y * scale,
                                        width: BOOK_W * scale,
                                        // 本の足元に棚へ落ちる影
                                        filter: 'drop-shadow(0 6px 6px rgba(0,0,0,0.45))',
                                    }}>
                                        {item.node}
                                    </div>
                                );
                            })}
                        </MotionDiv>
                    )}
                </AnimatePresence>
            </MotionDiv>

            {listMode && items.length === 0 && emptyMessage && (
                <div style={{
                    position: 'absolute', left: 0, right: 0, top: arrowMidY, transform: 'translateY(-50%)',
                    textAlign: 'center', padding: '0 24px', color: 'white', fontFamily: 'var(--font-jp)', fontSize: '0.9rem',
                    textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                }}>
                    {emptyMessage}
                </div>
            )}

            {/* さりげない矢印（その向きにまだ本棚が続くときだけ） */}
            {enabled && (
                <>
                    {[
                        { dir: 'left', label: '左の本へ', style: { left: '12px', top: arrowMidY, transform: 'translateY(-50%)' }, rotate: 180 },
                        { dir: 'right', label: '右の本へ', style: { right: '12px', top: arrowMidY, transform: 'translateY(-50%)' }, rotate: 0 },
                        { dir: 'up', label: '上の段へ', style: { left: '50%', top: topInset + 6, transform: 'translateX(-50%)' }, rotate: -90 },
                        { dir: 'down', label: '下の段へ', style: { left: '50%', bottom: bottomInset + 6, transform: 'translateX(-50%)' }, rotate: 90 },
                    ].map(({ dir, label, style, rotate }) => (
                        <button
                            key={dir}
                            type="button"
                            aria-label={label}
                            className="floor0-shelf-arrow"
                            onClick={(e) => { e.stopPropagation(); move(dir); }}
                            onPointerDown={(e) => e.stopPropagation()}
                            style={{
                                ...arrowBase, ...style,
                                opacity: can[dir] ? 1 : 0, pointerEvents: can[dir] ? 'auto' : 'none',
                            }}
                        >
                            <ChevronRight size={26} style={{ transform: `rotate(${rotate}deg)` }} />
                        </button>
                    ))}
                    <style>{`.floor0-shelf-arrow:hover { background: rgba(0,0,0,0.4) !important; color: #fff !important; }`}</style>
                </>
            )}
        </MotionDiv>,
        document.body,
    );
}
