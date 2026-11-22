import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useMotionValueEvent } from 'framer-motion';
import { Send, User, BookOpen, PenTool, ChevronRight, ExternalLink, PlayCircle, ArrowLeft, Search, X } from 'lucide-react';

import { ResponseModal } from './ResponseModal';
import { CinemaModal } from './CinemaModal';
import { ClassroomModal } from './ClassroomModal';
import { PdfFlipBook } from './PdfFlipBook';
import hallwayBg from '../assets/library_bg.jpg'; // All floors library background
import floor6Reveal from '../assets/floor_6f_reveal.png';
import floor6Base from '../assets/floor_bg2.png';
import avRoomBg from '../assets/av_room_bg.jpg';
import workshopLibraryBg from '../assets/workshop_library_bg.jpg';
import { titleTextStyle, runsFromItem, TITLE_SIZES, DEFAULT_TITLE_SIZE } from '../data/floor0TitleStyle';
import { Floor0TitleText } from './Floor0TitleText';
import { useIsMobile, useMediaQuery, useHasMouse } from '../hooks/useMediaQuery';
import workshopSide1 from '../assets/workshop_side_1.webp';
import workshopSide2 from '../assets/workshop_side_2.webp';

// ワーク画面の右端に入れる写真（ワークごとに順番に切り替える）
const WORKSHOP_SIDE_PHOTOS = [workshopSide1, workshopSide2];
import imgCinema from '../assets/cinema_room.png';
import imgClassroom from '../assets/virtual_classroom.png';
import lectureBg from '../assets/lecture_bg2.png';
import lectureBg7F from '../assets/lecture_bg_7f.png';
import floor0ChapterCover from '../assets/floor0_chapter_cover.jpg'; // 0F の章（チャプター）の本の表紙。全章共通
import floor0ShelfImage from '../assets/floor_0f_shelf.png'; // 0F のアップの本棚（本を並べる棚。App の背景の最後の1枚と同じ写真）
import { Floor0ShelfScene } from './Floor0ShelfScene';

const STORAGE_KEY = 'mind_university_classroom_v1';

const ResourceTransitionOverlay = ({ resource }) => {
    if (!resource) return null;
    const imgSrc = resource.isRecorded ? imgCinema : imgClassroom;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ backgroundColor: 'rgba(0,0,0,1)' }}
                animate={{ backgroundColor: ['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,0)'] }}
                transition={{ duration: 3.2, times: [0, 0.4, 0.9, 1] }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    overflow: 'hidden', perspective: '1200px'
                }}
            >
                {/* Door Container / Frame */}
                <motion.div
                    animate={{ scale: [1, 2, 20, 20], opacity: [1, 1, 1, 0] }}
                    transition={{ duration: 3.2, times: [0, 0.4, 0.9, 1], ease: "easeInOut" }}
                    style={{
                        width: '280px', height: '420px',
                        position: 'relative',
                        display: 'flex',
                        transformStyle: 'preserve-3d',
                        zIndex: 1,
                        background: '#fff', // White interior
                        boxShadow: '0 0 50px rgba(255,255,255,0.8)' // Glow from inside
                    }}
                >
                    {/* Left Door */}
                    <motion.div
                        animate={{ rotateY: [0, 0, -110, -110] }}
                        transition={{ duration: 3.2, times: [0, 0.4, 0.9, 1], ease: "easeInOut" }}
                        style={{
                            width: '50%', height: '100%',
                            background: 'linear-gradient(135deg, #1a1a24 0%, #0d0d14 100%)',
                            border: '3px solid #333', borderRight: '1px solid #000',
                            transformOrigin: 'left',
                            display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
                            paddingRight: '12px',
                            boxShadow: 'inset 0 0 20px rgba(129,230,217,0.1), 10px 0 20px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '5%', bottom: '5%', left: '10%', right: '20%', border: '2px solid rgba(129,230,217,0.3)', borderRadius: '4px' }} />
                        <div style={{ width: '10px', height: '60px', background: '#333', borderRadius: '4px', border: '1px solid #111', boxShadow: '-1px 0 5px rgba(0,0,0,0.5)', zIndex: 2 }} />
                    </motion.div>

                    {/* Right Door */}
                    <motion.div
                        animate={{ rotateY: [0, 0, 110, 110] }}
                        transition={{ duration: 3.2, times: [0, 0.4, 0.9, 1], ease: "easeInOut" }}
                        style={{
                            width: '50%', height: '100%',
                            background: 'linear-gradient(225deg, #1a1a24 0%, #0d0d14 100%)',
                            border: '3px solid #333', borderLeft: '1px solid #000',
                            transformOrigin: 'right',
                            display: 'flex', alignItems: 'center', justifyContent: 'flex-start',
                            paddingLeft: '12px',
                            boxShadow: 'inset 0 0 20px rgba(129,230,217,0.1), -10px 0 20px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{ position: 'absolute', top: '5%', bottom: '5%', right: '10%', left: '20%', border: '2px solid rgba(129,230,217,0.3)', borderRadius: '4px' }} />
                        <div style={{ width: '10px', height: '60px', background: '#333', borderRadius: '4px', border: '1px solid #111', boxShadow: '1px 0 5px rgba(0,0,0,0.5)', zIndex: 2 }} />
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

// hinge: 表紙の綴じ側。'left' なら表紙が左へ、'right' なら右へ開く
// showIcon: 表紙に本のマークを出すか（0F の本棚では出さない）
const BookTransitionOverlay = ({ resource, hinge = 'left', showIcon = true }) => {
    if (!resource) return null;
    const hingeRight = hinge === 'right';

    return (
        <AnimatePresence>
            <motion.div
                initial={{ backgroundColor: 'rgba(0,0,0,0)' }}
                animate={{ backgroundColor: ['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0.8)', 'rgba(0,0,0,0)'] }}
                transition={{ duration: 2.5, times: [0, 0.2, 0.8, 1] }}
                style={{
                    position: 'fixed', inset: 0, zIndex: 99999, pointerEvents: 'none',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    perspective: '2000px'
                }}
            >
                <motion.div
                    initial={{ scale: 0.8, opacity: 0, rotateX: 10 }}
                    animate={{ scale: [0.8, 1.8, 2.8], opacity: [0, 1, 1], rotateX: [10, 0, 0] }}
                    transition={{ duration: 2.5, times: [0, 0.4, 1], ease: "easeInOut" }}
                    style={{
                        position: 'relative',
                        width: '30vh',
                        height: '45vh',
                        perspective: '1500px',
                        transformStyle: 'preserve-3d',
                        zIndex: 10
                    }}
                >
                    {/* Back Cover (Pages) — 開いたページの中身として、実際のワークショップ内容を表示 */}
                    <div style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%',
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: hingeRight ? '12px 4px 4px 12px' : '4px 12px 12px 4px',
                        boxShadow: `${hingeRight ? '-10px' : '10px'} 10px 30px rgba(0,0,0,0.5)`,
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '24px',
                        overflow: 'hidden'
                    }}>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 0, 1] }}
                            transition={{ duration: 2.5, times: [0, 0.45, 0.75] }}
                            style={{ textAlign: 'center' }}
                        >
                            <h4 style={{ margin: '0 0 12px', fontSize: '1.05rem', color: '#1a202c', fontFamily: 'var(--font-jp)' }}>
                                {resource.title}
                            </h4>
                            {resource.description && (
                                <p style={{ margin: 0, fontSize: '0.8rem', color: '#4a5568', fontFamily: 'var(--font-jp)', lineHeight: 1.8 }}>
                                    {resource.description}
                                </p>
                            )}
                        </motion.div>
                    </div>

                    {/* Front Cover */}
                    <motion.div
                        animate={{ rotateY: [0, 0, hingeRight ? 150 : -150] }}
                        transition={{ duration: 2.5, times: [0, 0.4, 1], ease: "easeInOut" }}
                        style={{
                            position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%',
                            background: `linear-gradient(135deg, ${resource.color || 'var(--floor-6)'} 0%, #151e32 100%)`,
                            border: '2px solid #111',
                            borderRadius: hingeRight ? '12px 4px 4px 12px' : '4px 12px 12px 4px',
                            transformOrigin: hingeRight ? 'right center' : 'left center',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '24px', textAlign: 'center',
                            boxShadow: hingeRight
                                ? 'inset -4px 0 10px rgba(0,0,0,0.5), -5px 0 15px rgba(0,0,0,0.5)'
                                : 'inset 4px 0 10px rgba(0,0,0,0.5), 5px 0 15px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{ border: '2px solid rgba(255,255,255,0.2)', position: 'absolute', inset: '12px', borderRadius: '8px' }} />
                        {showIcon && <BookOpen size={48} color="white" style={{ marginBottom: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />}
                        <h3 style={{ color: 'white', margin: 0, fontSize: '1.4rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)', fontFamily: 'var(--font-jp)' }}>
                            {resource.title}
                        </h3>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

const WorkshopLibrary = ({ workshops = [], activeWorkshop, onWorkshopSelect, getWorkshopColor }) => {
    const containerRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start center", "end end"]
    });

    // Scale from 1.0 to 1.3 to simulate advancing deeper
    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.3]);
    // スマホでは部屋の幅が狭く、左右のテーブルの本が重なるので、本を小さくする
    const isMobile = useIsMobile();

    const bookPositions = [
        { left: '33%', top: '65%' }, // Middle left table
        { left: '67%', top: '65%' }, // Middle right table
        { left: '25%', top: '80%' }, // Bottom left table
        { left: '75%', top: '80%' }, // Bottom right table
        { left: '50%', top: '72%' }, // Fallback center
        { left: '40%', top: '85%' },
        { left: '60%', top: '85%' },
    ];

    return (
        <div ref={containerRef} style={{ height: '200vh', position: 'relative', marginTop: '40px', marginBottom: '40px' }}>
            <div style={{ position: 'sticky', top: 0, height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderRadius: '20px' }}>
                <motion.div
                    style={{
                        width: '100%',
                        height: '100%',
                        backgroundImage: `url(${workshopLibraryBg})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        scale,
                        boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
                        position: 'relative'
                    }}
                >
                    {/* Books on Tables */}
                    {workshops.map((w, idx) => {
                        const pos = bookPositions[idx % bookPositions.length];
                        const isActive = activeWorkshop?.id === w.id;
                        const wColor = getWorkshopColor(w.id);

                        return (
                            <motion.button
                                key={w.id}
                                onClick={() => onWorkshopSelect(w, wColor)}
                                whileHover={{ scale: 1.1, y: -10 }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    position: 'absolute',
                                    left: pos.left,
                                    top: pos.top,
                                    x: '-50%',
                                    y: '-50%',
                                    width: isMobile ? '78px' : '110px',
                                    height: isMobile ? '106px' : '150px',
                                    borderRadius: '4px 10px 10px 4px',
                                    border: isActive ? '3px solid white' : '1px solid rgba(0,0,0,0.2)',
                                    background: wColor,
                                    borderLeft: '10px solid rgba(0,0,0,0.4)',
                                    color: '#1a202c',
                                    fontWeight: 'bold',
                                    fontSize: isMobile ? '0.7rem' : '0.85rem',
                                    cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: isMobile ? '4px' : '8px',
                                    boxShadow: isActive ? '10px 10px 20px rgba(0,0,0,0.6), inset 2px 0 5px rgba(255,255,255,0.8)' : '5px 5px 15px rgba(0,0,0,0.5), inset 2px 0 5px rgba(255,255,255,0.4)',
                                    padding: isMobile ? '6px' : '12px',
                                    textAlign: 'center',
                                    outline: 'none',
                                    zIndex: isActive ? 6 : 5
                                }}
                            >
                                <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '3px', background: 'rgba(255,255,255,0.5)', borderRadius: '0 6px 6px 0' }} />
                                <BookOpen size={isMobile ? 18 : 24} color="#1a202c" style={{ filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.5))' }} />
                                <span style={{ fontFamily: 'var(--font-jp)', lineHeight: 1.2, zIndex: 1 }}>{w.title}</span>
                            </motion.button>
                        );
                    })}
                </motion.div>
            </div>
        </div>
    );
};

const introTextLines = [
    "潜在意識を最大化し、地球規模の「価値」を創出する",
    "皆さま、ようこそ。",
    "マインドデザイン研究所が体系化した「心の階層」のゴール、第7フロアへ。",
    "これまでのプロセスでは、自分のマインドを整え、周囲に影響を与える「技術」を磨いてきました。しかし、この最高階層である「プロセス7」では、これまでの常識を一度手放していただきます。",
    "この講義では、以下の3つのステップで「心の在り方」を書き換えていきます。",
    "1. 「心の視座」を宇宙の高さまで引き上げる",
    "日常の忙しさやストレスという「重力」から離れ、もっとも高い視点から自分を俯瞰（ふかん）してみましょう。時間軸を広げ、宇宙のような大きな視座を持つことで、目先の不安は消え、あなたがこの世に存在する「真の理由」が見えてきます。",
    "2. 究極の自分軸「在（Being）」を体得する",
    "「何かをしなければ（Doing）」という執着を捨て、ただ「自分として在る（Being）」ことに集中します。「何もない=無」の状態は、実はあらゆる可能性が詰まった「満たされている」状態です。言葉や論理を超えた「感じる世界」の感度を高めることで、しなやかで揺るぎない自分軸が完成します。",
    "3. 「共生」によるサステナブルな繁栄",
    "一人のリーダーがこの高い視座に立つことは、社会に計り知れない価値をもたらします。",
    "「自分のため」という枠を超え、「企業が繁栄することで、国が栄え、世界、そして地球全体が良くなる」という循環（共生）を、透明な設計図として描き出します。",
    "あなたの心の変革が、地球の未来を創り出す。",
    "人類の可能性を解き放つ、究極のメンタルトレーニングを始めましょう。"
];

const LectureIntroSequence = ({ lecture, onComplete, onBack }) => {
    const scrollRef = useRef(null);
    const { scrollYProgress } = useScroll({
        container: scrollRef
    });

    const scale = useTransform(scrollYProgress, [0, 1], [1, 1.4]);
    const buttonOpacity = useTransform(scrollYProgress, [0.8, 1], [0, 1]);
    const buttonPointerEvents = useTransform(scrollYProgress, [0.8, 1], ['none', 'auto']);
    const introBg = lecture?.floorId === '7F' ? lectureBg7F : lectureBg;
    // スマホ: 題名と本文を小さくし、左右の余白を詰める
    const isMobile = useIsMobile();

    return (
        <div style={{ position: 'relative', marginTop: '20px', height: 'calc(100vh - 120px)', borderRadius: '20px', overflow: 'hidden' }}>
            <motion.div
                style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${introBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    scale: scale,
                    zIndex: 0
                }}
            />
            {/* 背景を明るく保つためオーバーレイシャドウを削除 */}
            
            <button
                onClick={onBack}
                style={{ position: 'absolute', top: '20px', left: '20px', padding: '8px 16px', borderRadius: '20px', background: 'rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', zIndex: 10 }}
            >
                <ArrowLeft size={14} /> 廊下へ戻る
            </button>

            <div ref={scrollRef} style={{ position: 'relative', zIndex: 2, height: '100%', overflowY: 'auto', padding: isMobile ? '76px 20px' : '100px 40px', scrollbarWidth: 'none', boxSizing: 'border-box' }}>
                <style>{`::-webkit-scrollbar { display: none; }`}</style>
                <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', textShadow: '0px 2px 4px rgba(0,0,0,0.9), 0px 0px 10px rgba(0,0,0,0.8), 0px 0px 20px rgba(0,0,0,0.8), 0px 0px 30px rgba(0,0,0,0.8)', fontSize: isMobile ? '0.95rem' : '1.2rem', lineHeight: '2.0', fontFamily: 'var(--font-jp)', fontWeight: 'bold' }}>
                    {lecture && (
                        <h2 style={{ fontSize: isMobile ? '1.5rem' : '2.5rem', lineHeight: 1.5, marginBottom: isMobile ? '32px' : '60px', textAlign: 'center', wordBreak: 'keep-all', overflowWrap: 'anywhere', color: 'white', textShadow: '0px 4px 10px rgba(0,0,0,0.9), 0px 0px 20px rgba(0,0,0,0.9)' }}>
                            {lecture.title}
                        </h2>
                    )}
                    {introTextLines.map((text, idx) => (
                        <p key={idx} style={{ marginBottom: isMobile ? '22px' : '32px' }}>{text}</p>
                    ))}
                    
                    <div style={{ height: '40vh' }} /> {/* Extra space to allow scrolling past text */}

                    <motion.div style={{ opacity: buttonOpacity, pointerEvents: buttonPointerEvents, display: 'flex', justifyContent: 'center', paddingBottom: '100px' }}>
                        <button onClick={onComplete} style={{ background: '#e53e3e', color: 'white', fontSize: isMobile ? '1.05rem' : '1.2rem', padding: isMobile ? '14px 40px' : '16px 48px', borderRadius: '30px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', fontWeight: 'bold' }}>
                            授業を受ける
                        </button>
                    </motion.div>
                </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 3, color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '0.75rem' : '0.9rem', whiteSpace: 'nowrap', textShadow: '0 1px 4px rgba(0,0,0,0.8)', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                    ↓ スクロールして講義へ進む
                </motion.div>
            </div>
        </div>
    );
};

function Floor6View() {
    // 扉が開くまではテキストを出さず、スクロール距離確保用のスペーサーのみ
    return <div style={{ height: '540vh' }} />;
}

function Floor5View() {
    // 扉が開くまではテキストを出さず、スクロール距離確保用のスペーサーのみ
    return <div style={{ height: '540vh' }} />;
}

function Floor4View() {
    // 扉が開くまではテキストを出さず、スクロール距離確保用のスペーサーのみ
    return <div style={{ height: '540vh' }} />;
}

function Floor3View() {
    // 扉が開くまではテキストを出さず、スクロール距離確保用のスペーサーのみ
    return <div style={{ height: '540vh' }} />;
}

function Floor2View() {
    // 扉が開くまではテキストを出さず、スクロール距離確保用のスペーサーのみ
    return <div style={{ height: '540vh' }} />;
}

function Floor7Placeholder() {
    // 扉が開くまではテキストを出さず、スクロール距離確保用のスペーサーのみ
    return <div style={{ height: '540vh' }} />;
}

// 0F: どの本にも入っていない章をまとめて見せるための仮の本
const FLOOR0_UNSORTED_ID = '__unsorted__';

// 0F: 横スクロールで切り替わるゾーン（左から順に）
// タブには英語の名前（上段）と日本語の名前（下段）を二段で出す
const FLOOR0_ZONES = [
    { en: 'KURU’S BOOKSHELF', ja: '書棚・書籍一覧' },
    { en: 'KURU’S LEARNING PICKS', ja: '学びの準備室' },
];
// 0F に入ってから、背景が 広間 → 本棚に近づいたところ → アップの本棚 と切り替わり中身が出てくるまでのスクロール量（App の背景の切り替えと同じ）
export const floor0ShelfScrollDistance = () => window.innerHeight * 3.2;
const FLOOR0_ZONE_PATHS = [null, 'pickup']; // 各ゾーンの URL（/main/0F/pickup）。本棚ゾーンは /main/0F のまま

// 0F: 本棚と本を読む画面に出す、無断ダウンロード等へのお願い
const FLOOR0_COPY_NOTICE = '※無断ダウンロード・複製・転載禁止';
// 本棚のページの右下に常に出す、著作権についての詳しい注意書き
const FLOOR0_COPY_NOTICE_DETAIL = [
    '当サイトに掲載している文章・画像・写真等の著作権はすべて当方に帰属します。',
    '無断での複製、転載、改変、再配布等は一切禁止します。',
    '悪質な無断転載を発見した場合は、法的措置が下されます。',
];
// 0F のタブ・見出し・検索窓を固定する位置（画面上端から）。
// 広い画面では右上の「大学ルームマップ」ボタンと同じ高さにタブを並べ、狭い画面ではボタンと重ならないようその下に置く
const FLOOR0_CONTROLS_TOP = 78;
const FLOOR0_CONTROLS_TOP_WIDE = 18;
const FLOOR0_CONTROLS_CSS = `
.floor0-controls { padding-top: ${FLOOR0_CONTROLS_TOP}px; }
@media (min-width: 1100px) { .floor0-controls { padding-top: ${FLOOR0_CONTROLS_TOP_WIDE}px; } }
/* スマホを横にした（背の低い）画面: 上下が狭いので、横幅が足りればタブを右上のボタンと同じ高さに上げる */
@media (max-height: 500px) and (min-width: 700px) { .floor0-controls { padding-top: ${FLOOR0_CONTROLS_TOP_WIDE}px; } }
.floor0-controls-on button, .floor0-controls-on input { pointer-events: auto; }
`;

// 本の表紙の下に出す章の数（章がまだない本は「準備中」）
const floor0ChapterCountLabel = (chapters) => (chapters.length > 0 ? `全${chapters.length}章` : '準備中');

// 章の本の上の方に小さく入れる「本のタイトル」。区切りごとの大きさ（小・中・大など）は、比率だけ保って親の文字の大きさに合わせる
const FLOOR0_SIZE_REM = Object.fromEntries(TITLE_SIZES.map((s) => [s.value, parseFloat(s.css)]));
// 表紙の中に書くタイトル。本の幅に合わせて文字も縮む（幅 150px の本で、管理画面で選んだ大きさ × scale になる）。
// 表紙の枠に container-type: inline-size を付けておき、その幅に対する cqw で大きさを決める
const FLOOR0_COVER_REF_WIDTH = 150;
const floor0CoverFontSize = (rem) => `${((rem * 16) / FLOOR0_COVER_REF_WIDTH * 100).toFixed(2)}cqw`;
function Floor0FitTitle({ item, fallback = '', scale = 1 }) {
    const base = item?.titleSize || DEFAULT_TITLE_SIZE;
    const baseRem = (FLOOR0_SIZE_REM[base] || FLOOR0_SIZE_REM[DEFAULT_TITLE_SIZE]) * scale;
    const runs = item ? runsFromItem(item) : [];
    // display: block にして、行の高さを外側（16px）ではなくこの縮めた文字の大きさで決める（外側の大きさだと行間が広がる）
    if (runs.length === 0) return <span style={{ display: 'block', fontSize: floor0CoverFontSize(baseRem) }}>{fallback}</span>;
    return (
        <span style={{ display: 'block', fontSize: floor0CoverFontSize(baseRem), ...(item.titleFont && { fontFamily: titleTextStyle(item).fontFamily }) }}>
            {runs.map((run, i) => (
                <span key={i} style={{
                    // 区切りごとの大きさは、タイトル全体の大きさとの比率で（本が小さくなっても比率は同じ）
                    fontSize: `${((FLOOR0_SIZE_REM[run.size || base] || FLOOR0_SIZE_REM[base]) / FLOOR0_SIZE_REM[base]).toFixed(3)}em`,
                    ...(run.font && { fontFamily: titleTextStyle({ titleFont: run.font }).fontFamily }),
                }}>{run.text}</span>
            ))}
        </span>
    );
}

// 0F の本。表紙画像があれば画像、なければ無地の表紙。タイトル（と subLabel）は本に重ねず、本の下に出す
// titleStyle: 管理画面で選んだタイトルの見た目（{ titleFont, titleSize, titleRuns }。titleRuns は一部だけ変えた区切りと改行）
// onClick がなければ、押せない飾りの本として出す（章の一覧の左に置く「いま開いている本」など）
// captionTone: 本の下の文字色。暗い背景（本棚）では 'light'、明るい背景（ピックアップのテーブル）では 'dark'
// titleInside: タイトルを本の下ではなく表紙の中（章の本の枠の中、著者名の上）に書く。章の本で使う
// bookTitle: titleInside のとき、表紙の上の方に入れる「その章が入っている本」のタイトル（本のデータ。なければ出さない）
// titleOnHover: タイトル（と subLabel）を本の下に出さず、マウスを乗せたときに表紙の手前に重ねて出す（本棚に並べる本で使う）。
//   タッチで操作しているとき（スマホ・タブレットなど）は乗せられないので、これまでどおり本の下に出す
function Floor0Cover({ title, coverUrl, subLabel, titleStyle, onClick, captionTone = 'light', titleInside = false, bookTitle = null, titleOnHover = false }) {
    const titleCss = titleTextStyle(titleStyle);
    const Tag = onClick ? motion.button : motion.div;
    const canHover = useHasMouse(); // マウスで操作しているときだけ（タッチでは乗せられない）
    const [hovered, setHovered] = useState(false);
    const hoverTitle = titleOnHover && canHover && !titleInside;
    // タッチで操作しているときは乗せられないので、表紙の下の方にタイトルを帯のようにいつも重ねておく
    const bannerTitle = titleOnHover && !canHover && !titleInside;
    const captionColor = captionTone === 'dark'
        ? { color: '#3b2f22' }
        : { color: 'white', textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)' };
    return (
        <Tag
            onClick={onClick}
            onHoverStart={titleOnHover ? () => setHovered(true) : undefined}
            onHoverEnd={titleOnHover ? () => setHovered(false) : undefined}
            whileHover={onClick ? { scale: 1.05, y: -6 } : undefined}
            whileTap={onClick ? { scale: 0.96 } : undefined}
            style={{
                width: '100%', minWidth: 0, // 置かれた枠（スライダーの1枠・テーブルの上など）の幅いっぱいに広げる
                display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: '10px',
                padding: 0, border: 'none', background: 'none', font: 'inherit',
                cursor: onClick ? 'pointer' : 'default',
            }}
        >
            <div style={{
                width: '100%', aspectRatio: '1 / 1.47', // 縦横比は表紙画像（マインドの法則: 818×1200）に合わせる
                borderRadius: '4px',
                border: '1px solid rgba(212,175,55,0.4)',
                background: coverUrl
                    ? `center / cover no-repeat url(${coverUrl})`
                    : 'linear-gradient(160deg, #223324 0%, #10190f 100%)',
                boxShadow: '0 10px 24px rgba(0,0,0,0.5)',
                position: 'relative', overflow: 'hidden',
                containerType: 'inline-size', // 中に書くタイトルを、この表紙の幅に合わせて縮める（Floor0FitTitle）
            }}>
                {!coverUrl && <div style={{ position: 'absolute', inset: '8px', border: '1px solid rgba(212,175,55,0.4)' }} />}
                {titleInside && bookTitle && (
                    // 章の本の上の方: その章が入っている本のタイトル（本の表紙と同じ改行・大きさの比率で、小さめに）
                    <div style={{
                        position: 'absolute', left: '19%', right: '11%', top: '12%', height: '28%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                        color: '#423329', fontFamily: 'var(--font-jp)', textAlign: 'center', lineHeight: 1.35,
                        wordBreak: 'keep-all', overflowWrap: 'anywhere',
                    }}>
                        <div style={{ fontWeight: 'bold', whiteSpace: 'pre-line' }}>
                            <Floor0FitTitle item={bookTitle} fallback={bookTitle.title} scale={0.62} />
                        </div>
                    </div>
                )}
                {titleInside && (
                    // 章の本の表紙画像の、金の枠の内側（左に背表紙があるので少し右寄り）・著者名より上に収める。
                    // 上に本のタイトルを入れるときは、章のタイトルはその下（表紙の真ん中より下）に置く
                    <div style={{
                        position: 'absolute', left: '19%', right: '11%', top: bookTitle ? '42%' : '16%', bottom: '34%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                        color: '#4a3410', textShadow: '0 1px 0 rgba(255,250,235,0.6)',
                        fontFamily: 'var(--font-jp)', textAlign: 'center', lineHeight: 1.5,
                        wordBreak: 'keep-all', overflowWrap: 'anywhere',
                    }}>
                        <div style={{ fontWeight: 'bold', whiteSpace: 'pre-line' /* 管理画面で入れた改行 */ }}>
                            <Floor0FitTitle item={titleStyle} fallback={title} />
                        </div>
                    </div>
                )}
                {(hoverTitle || bannerTitle) && (
                    // マウスのとき: 乗せたときだけ、表紙の手前に半透明の黒を敷いてタイトルを出す
                    // タッチのとき: 表紙の下の方に、下ほど濃い黒を敷いてタイトルをいつも出す
                    <div style={{
                        position: 'absolute', inset: 0, padding: bannerTitle ? '10% 8% 8%' : '10%', boxSizing: 'border-box',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: bannerTitle ? 'flex-end' : 'center',
                        background: bannerTitle ? 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 35%, rgba(0,0,0,0) 60%)' : 'rgba(0,0,0,0.5)',
                        color: 'white', fontFamily: 'var(--font-jp)',
                        textAlign: 'center', lineHeight: 1.5, wordBreak: 'keep-all', overflowWrap: 'anywhere',
                        textShadow: '0 1px 4px rgba(0,0,0,0.6)',
                        opacity: bannerTitle || hovered ? 1 : 0, transition: 'opacity 0.2s ease', pointerEvents: 'none',
                    }}>
                        <div style={{ fontWeight: 'bold', whiteSpace: 'pre-line' /* 管理画面で入れた改行 */ }}>
                            <Floor0FitTitle item={titleStyle} fallback={title} />
                        </div>
                        {subLabel && <div style={{ fontSize: floor0CoverFontSize(0.75), opacity: 0.9, marginTop: '6px' }}>{subLabel}</div>}
                    </div>
                )}
            </div>
            {!hoverTitle && !bannerTitle && (!titleInside || subLabel) && (
                <div style={{
                    ...captionColor, fontFamily: 'var(--font-jp)', textAlign: 'center', lineHeight: 1.5,
                    wordBreak: 'keep-all', overflowWrap: 'anywhere', // 長いタイトルは本の幅の中で折り返す（本が横に広がらないように）
                }}>
                    {!titleInside && (
                        <div style={{ ...titleCss, fontWeight: 'bold', whiteSpace: 'pre-line' /* 管理画面で入れた改行 */ }}>
                            <Floor0TitleText item={titleStyle} fallback={title} />
                        </div>
                    )}
                    {subLabel && <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>{subLabel}</div>}
                </div>
            )}
        </Tag>
    );
}

// 0F テーブルゾーンの背景画像（2309×1299）。テーブルの上の、表紙(左)・章(右)を置く位置（画像に対する%）
// 縦長の画面では画像の左右が切れて見えなくなるので、テーブルの中央に上下に並べる
const FLOOR0_TABLE_ASPECT = 1672 / 941; // テーブルの背景画像（floor_0f_table_marble.jpg）の縦横比
const FLOOR0_TABLE_CSS = `
.floor0-pick { position: absolute; top: 51%; width: 13%; transform: translate(-50%, -50%); }
.floor0-pick-series { left: 33.5%; }
.floor0-pick-chapter { left: 57.5%; }
@media (max-aspect-ratio: 1/1) {
    .floor0-pick { left: 45.6%; width: 10%; }
    .floor0-pick-series { top: 33%; }
    .floor0-pick-chapter { top: 64%; }
}
`;

// 0F テーブルゾーンのテーブルの上に、学びの準備室のピックアップ（学びの一冊・注目の章）を置く。
// 背景（App 側、画面全体に cover で表示）とぴったり重なるよう、画面に固定して同じ大きさ・同じ横スクロールで動かす
function Floor0PickupTable({ zoneProgress, contentOpacity, pickupSeries, pickupChapter, pickupChapterSeries, onOpenSeries, onOpenChapter }) {
    const fallbackProgress = useMotionValue(0);
    // テーブルゾーンの背景は本棚ゾーンの右隣（+100vw）にあり、スクロールに合わせて 0 まで流れてくる
    const x = useTransform(zoneProgress || fallbackProgress, [0, 1], ['100vw', '0vw']);
    if (!pickupSeries && !pickupChapter) return null;

    const items = [
        pickupSeries && {
            key: 'series', label: '学びの一冊',
            cover: <Floor0Cover title={pickupSeries.title} coverUrl={pickupSeries.coverUrl} titleStyle={pickupSeries} subLabel={floor0ChapterCountLabel(pickupSeries.chapters)} onClick={onOpenSeries} captionTone="dark" />,
        },
        pickupChapter && {
            key: 'chapter', label: '注目の章',
            cover: <Floor0Cover title={pickupChapter.title} coverUrl={floor0ChapterCover} titleStyle={pickupChapter} titleInside bookTitle={pickupChapterSeries} subLabel={pickupChapterSeries?.title} onClick={onOpenChapter} captionTone="dark" />,
        },
    ].filter(Boolean);

    return createPortal(
        <motion.div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5, x, opacity: contentOpacity ?? 1 }}>
            {/* 背景画像の cover 表示と同じ大きさ・位置の枠。この中の % は画像に対する位置になる */}
            <div style={{
                position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%, -50%)',
                width: `max(100vw, ${100 * FLOOR0_TABLE_ASPECT}vh)`, height: `max(100vh, ${100 / FLOOR0_TABLE_ASPECT}vw)`,
            }}>
                <style>{FLOOR0_TABLE_CSS}</style>
                {items.map(({ key, label, cover }) => (
                    <div key={key} className={`floor0-pick floor0-pick-${key}`} style={{
                        pointerEvents: 'auto',
                        filter: 'drop-shadow(0 18px 18px rgba(60,45,30,0.35))', // テーブルに落ちる影
                    }}>
                        <div style={{
                            marginBottom: '8px', textAlign: 'center', fontFamily: 'var(--font-jp)', fontSize: '0.8rem',
                            fontWeight: 'bold', letterSpacing: '0.15em', color: '#5a4630',
                        }}>
                            {label}
                        </div>
                        {cover}
                    </div>
                ))}
            </div>
        </motion.div>,
        document.body,
    );
}

// 0F 本棚の検索用に、タイトルの表記ゆれ（全角/半角・大文字/小文字・ひらがな/カタカナ・空白や改行）をそろえる
function normalizeForSearch(text) {
    return String(text || '').normalize('NFKC').toLowerCase().replace(/\s+/g, '')
        .replace(/[\u3041-\u3096]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
}

// 0F: 地下ホールの書庫。まず本（表紙）を選び、その本の章（PDF）を本のようにめくって読める。
// zone / onZoneChange: 見ているゾーンの URL 名（null = 本棚ゾーン, 'pickup'）。App が URL と合わせる
// shelfProgress: App の背景の切り替え（0 = 広間, 1 = アップの本棚）。1 に近づいたら中身をふわっと出す
function Floor0Library({ books = [], series = [], pickup = {}, zoneProgress, shelfProgress, zone = null, onZoneChange }) {
    const [activeBook, setActiveBook] = useState(null);
    const [transitioningBook, setTransitioningBook] = useState(null);
    const [openSeriesId, setOpenSeriesId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');
    // スマホ: 上に固定するタブ・見出し・検索窓を詰めて、本の見える部分を広くする。本は1段3冊
    const isMobile = useIsMobile();
    // スマホを横にした（背の低い）画面: さらに見出しと検索窓を1行に並べ、「読みたい本を選んでください」は省く
    const isShort = useMediaQuery('(max-height: 500px)');

    // 本棚に並べる本: 登録された本すべて（章がまだない本も）と、どの本にも入っていない章をまとめた「未分類」
    const seriesIds = new Set(series.map(s => s.id));
    const unsorted = books.filter(b => !b.seriesId || !seriesIds.has(b.seriesId));
    const shelf = [
        ...series.map(s => ({ ...s, chapters: books.filter(b => b.seriesId === s.id) })),
        ...(unsorted.length > 0 ? [{ id: FLOOR0_UNSORTED_ID, title: series.length > 0 ? '未分類' : '書庫', coverUrl: null, chapters: unsorted }] : []),
    ];
    // 開いている本が削除された場合は null になり、表紙の一覧に戻る
    const openSeries = shelf.find(s => s.id === openSeriesId) || null;
    // 検索: 本のタイトルに含まれていればその本を出す（章のタイトルは見ない）
    const normalizedQuery = normalizeForSearch(searchQuery);
    const visibleShelf = normalizedQuery
        ? shelf.filter(s => normalizeForSearch(s.title).includes(normalizedQuery))
        : shelf;

    // 表示中の章がリストから消えた（削除された）場合は本棚に戻す
    useEffect(() => {
        if (activeBook && !books.some(b => b.id === activeBook.id)) {
            setActiveBook(null);
        }
    }, [books, activeBook]);
    const handleSelectBook = (book) => {
        setTransitioningBook(book);
        // 本が開き切る演出(BookTransitionOverlayの2.5秒アニメーション)を見せてから全画面へ切り替える
        setTimeout(() => {
            setActiveBook(book);
            setTransitioningBook(null);
        }, 2500);
    };

    // 本棚ゾーン / テーブルゾーン の横スクロール。位置(0〜1)を App に伝えて背景も一緒に流す
    const zoneScrollRef = useRef(null);
    const [activeZone, setActiveZone] = useState(0);
    useEffect(() => {
        zoneProgress?.set(0);
        return () => zoneProgress?.set(0);
    }, [zoneProgress]);
    const handleZoneScroll = (e) => {
        const el = e.currentTarget;
        const max = el.scrollWidth - el.clientWidth;
        const progress = max > 0 ? el.scrollLeft / max : 0;
        zoneProgress?.set(progress);
        const index = Math.round(progress * (FLOOR0_ZONES.length - 1));
        if (index !== activeZone) {
            setActiveZone(index);
            onZoneChange?.(FLOOR0_ZONE_PATHS[index]);
        }
    };
    const scrollToZone = (index, behavior = 'smooth') => {
        const el = zoneScrollRef.current;
        if (el) el.scrollTo({ left: el.clientWidth * index, behavior });
    };
    // URL で指定されたゾーン（開いたとき・ブラウザの戻る/進む）へ移る。開いたときはアニメなしで直接
    const zoneIndex = Math.max(0, FLOOR0_ZONE_PATHS.indexOf(zone));
    const firstZoneScrollRef = useRef(true);
    useEffect(() => {
        const first = firstZoneScrollRef.current;
        firstZoneScrollRef.current = false;
        // 手で切り替えたときは activeZone と zone が同じになっているので動かさない
        if (zoneIndex !== activeZone) scrollToZone(zoneIndex, first ? 'instant' : 'smooth');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [zoneIndex]);

    // 入った直後は背景（本棚全体）だけ。スクロールして背景がアップに切り替わったところで、中身がその場にふわっと出る。
    // 切り替わるまでは中身をスクロールに合わせて下げ、下から上がってこないようにする（切り替わった後は普通にスクロール）
    const fallbackShelfProgress = useMotionValue(1);
    const progress = shelfProgress || fallbackShelfProgress;
    const contentOpacity = useTransform(progress, [0.85, 1], [0, 1]);
    const contentPointer = useTransform(progress, (v) => (v > 0.9 ? 'auto' : 'none'));
    const scrollHintOpacity = useTransform(progress, [0, 0.3], [1, 0]);
    // アップの本棚（Floor0ShelfScene）: App の背景の「本棚に近づいたところ」から、ぼやっと切り替わって出てくる
    const sceneOpacity = useTransform(progress, [0.79, 0.945], [0, 1]);
    const sceneBlur = useTransform(progress, [0.79, 0.8675, 0.945], ['blur(0px)', 'blur(6px)', 'blur(0px)']);
    // 学びの準備室へ横に切り替えるときは、App の背景と一緒に左へ流す
    const fallbackZoneProgress = useMotionValue(0);
    const sceneX = useTransform(zoneProgress || fallbackZoneProgress, [0, 1], ['0vw', '-100vw']);
    const { scrollY } = useScroll();
    const contentY = useTransform(scrollY, (v) => Math.min(Math.max(v, 0), floor0ShelfScrollDistance()));

    // 上に固定したタブ・検索窓は、中身が出てから押せるようにする（それまでは見えないので押せない）
    const [controlsActive, setControlsActive] = useState(() => progress.get() > 0.9);
    useMotionValueEvent(progress, 'change', (v) => setControlsActive(v > 0.9));

    // 本の一覧が、上に固定したタブ・見出し・検索窓のすぐ下から始まるよう、間に入れる空きの高さを測る。
    // 中身が出たとき（スクロールに合わせて下げている分を除いた位置）の空きの上端から、固定した部分の下端までの差
    const controlsRef = useRef(null);
    const controlsSpacerRef = useRef(null);
    const [controlsSpacerHeight, setControlsSpacerHeight] = useState(0);
    const [controlsBottom, setControlsBottom] = useState(0); // 上に固定した部分の下端（アップの本棚は、これより下に段が来るように寄る）
    useEffect(() => {
        const controls = controlsRef.current;
        const spacer = controlsSpacerRef.current;
        if (!controls || !spacer) return;
        const measure = () => {
            const spacerTop = spacer.getBoundingClientRect().top + window.scrollY - contentY.get();
            setControlsSpacerHeight(Math.max(0, Math.round(controls.offsetHeight - spacerTop)));
            setControlsBottom(controls.offsetHeight);
        };
        const observer = new ResizeObserver(measure);
        observer.observe(controls);
        window.addEventListener('resize', measure);
        return () => {
            observer.disconnect();
            window.removeEventListener('resize', measure);
        };
    }, [contentY]);

    // ピックアップの URL（/main/0F/pickup）で開いたときは、背景が切り替わった後の位置までスクロールしておく
    useEffect(() => {
        if (zoneIndex > 0) window.scrollTo({ top: floor0ShelfScrollDistance(), behavior: 'instant' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 学びの準備室のピックアップ（設定画面で選んだ本1冊・章1つ）。消された本・章は置かない
    const pickupSeries = shelf.find(s => s.id === pickup.seriesId && s.id !== FLOOR0_UNSORTED_ID) || null;
    const pickupChapter = books.find(b => b.id === pickup.chapterId && !b.isDefault) || null;
    const pickupChapterSeries = pickupChapter ? series.find(s => s.id === pickupChapter.seriesId) : null;
    // 表紙をクリック: 本棚ゾーンへ戻って、その本の章の一覧を開く
    const openPickupSeries = () => {
        setOpenSeriesId(pickupSeries.id);
        scrollToZone(0);
    };

    return (
        <>
            {/* 入った直後だけ出す案内（画面の下に固定） */}
            <motion.div style={{
                position: 'fixed', left: 0, right: 0, bottom: '28px', zIndex: 4, pointerEvents: 'none',
                display: 'flex', justifyContent: 'center', opacity: scrollHintOpacity,
            }}>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        color: 'white', fontFamily: 'var(--font-jp)', fontSize: '0.85rem', letterSpacing: '0.1em',
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    }}
                >
                    スクロールして本棚へ
                    <ChevronRight size={20} style={{ transform: 'rotate(90deg)' }} />
                </motion.div>
            </motion.div>

            {/* タブ・見出し・注意書き・検索窓は、元の並びのまま画面の上の中央（右上のボタンの下）に固定し、スクロールで流さない。
                親に transform がかかっていると fixed がずれるので body に直接出す */}
            {createPortal(
                <motion.div
                    ref={controlsRef}
                    className={controlsActive ? 'floor0-controls floor0-controls-on' : 'floor0-controls'}
                    style={{
                        // 背景の帯は敷かない。透明なところは下を流れる本を押せるよう素通しにし、ボタン・検索窓だけ押せるようにする（.floor0-controls-on）
                        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 6,
                        opacity: contentOpacity, pointerEvents: 'none',
                        paddingLeft: '16px', paddingRight: '16px', paddingBottom: '12px', // 上の余白は FLOOR0_CONTROLS_CSS（画面幅で変える）
                    }}
                >
                    <style>{FLOOR0_CONTROLS_CSS}</style>
                    {/* ゾーン切り替えのタブ（横スクロール・スワイプでも切り替わる） */}
                    <div style={{ display: 'flex', flexWrap: isMobile ? 'nowrap' : 'wrap', justifyContent: 'center', gap: isMobile ? '8px' : '14px' }}>
                        {FLOOR0_ZONES.map((zone, i) => (
                            <button
                                key={zone.en}
                                onClick={() => scrollToZone(i)}
                                aria-pressed={activeZone === i}
                                style={{
                                    position: 'relative', display: 'inline-flex', alignItems: 'center', minWidth: 0,
                                    padding: isMobile ? '6px 16px' : '7px 30px',
                                    border: 'none', background: 'none', cursor: 'pointer',
                                    fontFamily: 'var(--font-jp)', color: 'white',
                                }}
                            >
                                {/* 形: 右上の「大学ルームマップ」（角の丸いボタン）と見分けがつくよう、斜めの平行四辺形にする。
                                    色: どちらも同じ緑。いま見ている方は透かし（薄く塗って枠線）、もう一方は塗りつぶしで見分ける */}
                                <span aria-hidden="true" style={{
                                    position: 'absolute', inset: 0, transform: 'skewX(-18deg)', borderRadius: '3px',
                                    background: activeZone === i ? 'rgba(90,162,142,0.3)' : 'rgb(90,162,142)',
                                    border: '1px solid rgb(90,162,142)',
                                    backdropFilter: activeZone === i ? 'blur(6px)' : undefined,
                                    boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                                }} />
                                <span style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.3, textShadow: '0 1px 3px rgba(0,0,0,0.35)' }}>
                                    {/* 英字は小さく、日本語を大きく */}
                                    <span style={{ fontSize: isMobile ? '0.5rem' : '0.62rem', letterSpacing: '0.06em', whiteSpace: 'nowrap', opacity: 0.95 }}>{zone.en}</span>
                                    <span style={{ fontSize: isMobile ? '0.78rem' : '0.95rem', fontWeight: 'bold', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>{zone.ja}</span>
                                </span>
                            </button>
                        ))}
                    </div>

                    {/* 本棚ゾーンの見出し・注意書きと、検索窓（本の一覧のとき）/ 本の一覧に戻る（章の一覧のとき） */}
                    {activeZone === 0 && (
                        <>
                        <div style={isShort ? {
                            // 背の低い画面: 見出し（と戻るボタン）・検索窓を1行に並べる
                            display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '6px 16px', marginTop: '8px',
                        } : undefined}>
                        <div style={{
                            marginTop: isShort ? 0 : isMobile ? '10px' : '20px', color: 'white', fontFamily: 'var(--font-jp)',
                            textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                            ...(isShort && { display: 'flex', alignItems: 'center', gap: '12px' }),
                        }}>
                            {openSeries && (
                                <button
                                    onClick={() => setOpenSeriesId(null)}
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: isShort ? 0 : isMobile ? '8px' : '14px', whiteSpace: 'nowrap',
                                        padding: '8px 18px', borderRadius: '20px', background: 'rgba(0,0,0,0.45)',
                                        border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '0.8rem',
                                    }}
                                >
                                    <ArrowLeft size={14} /> 本の一覧に戻る
                                </button>
                            )}
                            {/* 見出しは章の一覧（本を開いたとき）だけ。本の一覧では「地下書庫」「読みたい本を選んでください」は出さない */}
                            {openSeries && (
                                <h3 style={{ margin: isShort ? 0 : isMobile ? '0 0 4px' : '0 0 8px', fontSize: isMobile ? '1.05rem' : '1.2rem', fontWeight: 'bold', color: 'var(--floor-0)' }}>
                                    {openSeries.title}
                                </h3>
                            )}
                            {openSeries && !isShort && (
                                <p style={{ margin: 0, fontSize: isMobile ? '0.8rem' : '0.85rem', opacity: 0.75 }}>
                                    読みたい章を選んでください
                                </p>
                            )}
                            {!isShort && (
                                <p style={{ margin: openSeries ? (isMobile ? '6px 0 0' : '10px 0 0') : 0, fontSize: isMobile ? '0.65rem' : '0.75rem', opacity: 0.6 }}>
                                    {FLOOR0_COPY_NOTICE}
                                </p>
                            )}
                        </div>
                        {!openSeries && (
                            <div style={{ display: 'flex', justifyContent: 'center', padding: '0 4px', marginTop: isShort ? 0 : isMobile ? '10px' : '20px', ...(isShort && { flex: '0 1 300px' }) }}>
                                <div style={{ position: 'relative', width: '100%', maxWidth: '360px' }}>
                                    <input
                                        type="search"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="タイトルで検索"
                                        aria-label="本をタイトルで検索"
                                        className="floor0-search"
                                        style={{
                                            width: '100%', boxSizing: 'border-box', padding: isMobile ? '8px 38px' : '10px 38px 10px 38px',
                                            borderRadius: '20px', border: '1px solid rgba(255,255,255,0.25)',
                                            background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                                            color: 'white', fontSize: '0.9rem', fontFamily: 'var(--font-jp)', outline: 'none',
                                        }}
                                    />
                                    {/* 虫めがね。検索窓（ぼかしで重なり順が上がる）に隠れないよう、入力欄より後に置く */}
                                    <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }} />
                                    {searchQuery && (
                                        <button
                                            onClick={() => setSearchQuery('')}
                                            aria-label="検索をクリア"
                                            style={{
                                                position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)',
                                                display: 'flex', padding: '4px', border: 'none', borderRadius: '50%',
                                                background: 'transparent', color: 'rgba(255,255,255,0.8)', cursor: 'pointer',
                                            }}
                                        >
                                            <X size={16} />
                                        </button>
                                    )}
                                </div>
                                <style>{`
                                    .floor0-search::placeholder { color: rgba(255,255,255,0.55); }
                                    .floor0-search::-webkit-search-cancel-button { display: none; }
                                    .floor0-search:focus { border-color: var(--floor-0); }
                                `}</style>
                            </div>
                        )}
                        </div>
                        {/* 背の低い画面では、注意書きは見出しの行の下に小さく1行で */}
                        {isShort && (
                            <p style={{
                                margin: '6px 0 0', fontSize: '0.62rem', opacity: 0.6, color: 'white', textAlign: 'center',
                                fontFamily: 'var(--font-jp)', textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                            }}>
                                {FLOOR0_COPY_NOTICE}
                            </p>
                        )}
                        </>
                    )}
                </motion.div>,
                document.body,
            )}

            <motion.div style={{ y: contentY, opacity: contentOpacity, pointerEvents: contentPointer }}>
            {/* 上に固定したタブ・見出し・検索窓のぶんだけ空けて、本がそのすぐ下から始まるようにする */}
            <div ref={controlsSpacerRef} style={{ height: `${controlsSpacerHeight}px` }} />

            <div
                ref={zoneScrollRef}
                onScroll={handleZoneScroll}
                className="floor0-zones"
                style={{
                    display: 'flex', overflowX: 'auto', overflowY: 'hidden',
                    scrollSnapType: 'x mandatory', scrollbarWidth: 'none',
                }}
            >
            <style>{`.floor0-zones::-webkit-scrollbar { display: none; }`}</style>

            {/* 本棚ゾーン */}
            <div style={{ flex: '0 0 100%', minWidth: 0, scrollSnapAlign: 'start', marginTop: '12px' }}>
                {/* 本の一覧も章の一覧も、下の Floor0ShelfScene が棚板の上に並べる */}
            </div>

            {/* テーブルゾーン（背景は App 側で本棚ゾーンの右隣に並べている。ピックアップは下の Floor0PickupTable がテーブルの上に置く） */}
            <div style={{ flex: '0 0 100%', minWidth: 0, scrollSnapAlign: 'start', marginTop: '20px', minHeight: '60vh' }}>
                {/* 白いテーブル・壁の上でも読めるよう、文字の後ろに暗めの板を敷く。
                    ピックアップがあるときは本と章が「学びの一冊/注目の章」の札付きでテーブルに置かれ、見出しと重なるので出さない */}
                {!pickupSeries && !pickupChapter && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block', padding: '12px 28px', borderRadius: '14px',
                        background: 'rgba(20,16,12,0.6)', backdropFilter: 'blur(6px)',
                        color: 'white', fontFamily: 'var(--font-jp)',
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--floor-0)' }}>
                            学びの準備室
                        </h3>
                        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', opacity: 0.85 }}>学びの一冊・注目の章は準備中です</p>
                    </div>
                </div>
                )}
            </div>
            </div>
            </motion.div>
            {/* 背景が切り替わるまでのスクロールの余地（中身はその間スクロールに合わせて下げているので、その分を下に足す） */}
            <div style={{ height: '320vh' }} />

            <Floor0PickupTable
                zoneProgress={zoneProgress}
                contentOpacity={contentOpacity}
                pickupSeries={pickupSeries}
                pickupChapter={pickupChapter}
                pickupChapterSeries={pickupChapterSeries}
                onOpenSeries={openPickupSeries}
                onOpenChapter={() => handleSelectBook(pickupChapter)}
            />

            {/* アップの本棚。本の一覧のときは棚板の上に本を立てて並べ、矢印・スワイプ・キーボードの矢印で棚の中を見て回る。
                章の一覧のときは本を消して、背景としてだけ置く */}
            <Floor0ShelfScene
                imageSrc={floor0ShelfImage}
                opacity={sceneOpacity}
                blur={sceneBlur}
                x={sceneX}
                listMode
                interactive={controlsActive && activeZone === 0}
                topInset={controlsBottom}
                bottomInset={isMobile ? 64 : 72}
                // 本を開いた・閉じた・検索の言葉を変えたときは、棚の最初（2段目・真ん中）から見せる
                resetKey={openSeries ? `series:${openSeries.id}` : `search:${normalizedQuery}`}
                emptyMessage={openSeries
                    ? 'この本にはまだ章がありません'
                    : normalizedQuery ? `「${searchQuery.trim()}」に当てはまる本は見つかりませんでした` : 'まだ本がありません'}
                items={openSeries
                    // 本を開いているとき: その本の章を、本の一覧と同じように棚板の上に並べる
                    ? openSeries.chapters.map((b) => ({
                        key: `chapter:${b.id}`,
                        node: (
                            <Floor0Cover
                                title={b.title}
                                coverUrl={floor0ChapterCover}
                                titleStyle={b}
                                titleInside
                                bookTitle={openSeries.id !== FLOOR0_UNSORTED_ID ? openSeries : null}
                                onClick={() => handleSelectBook(b)}
                            />
                        ),
                    }))
                    : visibleShelf.map((s) => ({
                        key: s.id,
                        node: (
                            <Floor0Cover
                                title={s.title}
                                coverUrl={s.coverUrl}
                                titleStyle={s}
                                subLabel={floor0ChapterCountLabel(s.chapters)}
                                titleOnHover // タイトルは本の下に出さず、マウスを乗せたときに表紙の手前に出す（タッチのときは表紙の下の方にいつも）
                                onClick={() => setOpenSeriesId(s.id)}
                            />
                        ),
                    }))}
            />
                    ),
                }))}
            />

            {/* 著作権についての詳しい注意書き。0F の中身が出ている間は、画面の右下に常に出す
                （学びの準備室の白いテーブルの上でも読めるよう、薄い黒を敷く） */}
            {createPortal(
                <motion.div style={{
                    position: 'fixed', right: isMobile ? '8px' : '16px', bottom: isMobile ? '8px' : '12px', zIndex: 6,
                    maxWidth: isMobile ? 'calc(100vw - 16px)' : '460px', boxSizing: 'border-box',
                    padding: '6px 10px', borderRadius: '6px', background: 'rgba(0,0,0,0.35)',
                    color: 'rgba(255,255,255,0.85)', fontFamily: 'var(--font-jp)',
                    fontSize: isMobile ? '0.55rem' : '0.62rem', lineHeight: 1.6,
                    opacity: contentOpacity, pointerEvents: 'none',
                }}>
                    {FLOOR0_COPY_NOTICE_DETAIL.map((line) => <div key={line}>{line}</div>)}
                </motion.div>,
                document.body,
            )}

            {/* 本を開く演出（ワークショップの本と同じ3D演出を流用） */}
            <BookTransitionOverlay hinge="right" showIcon={false} resource={transitioningBook ? { title: transitioningBook.title, color: 'var(--floor-0)' } : null} />

            {/* 全画面での本文表示 */}
            <AnimatePresence>
                {activeBook && (
                    <motion.div
                        key="floor0-fullscreen-book"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.4 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 600,
                            background: 'radial-gradient(circle at 50% 35%, #1a2e22 0%, #05080a 100%)',
                            overflowY: 'auto',
                            display: 'flex', flexDirection: 'column', alignItems: 'center',
                            padding: '24px 24px 60px',
                        }}
                    >
                        <button
                            onClick={() => setActiveBook(null)}
                            style={{
                                alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '6px',
                                padding: '10px 20px', borderRadius: '20px', background: 'rgba(255,255,255,0.1)',
                                border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer',
                                fontSize: '0.85rem', marginBottom: '20px', flexShrink: 0,
                                position: 'relative', zIndex: 2, // 本（めくり部分）が大きいと上にはみ出して重なるので、ボタンを手前に出して押せるようにする
                            }}
                        >
                            <ArrowLeft size={14} /> 章の一覧に戻る
                        </button>
                        <div style={{
                            flex: '1 1 auto', minHeight: 0, width: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            {activeBook && <PdfFlipBook pdfUrl={activeBook.pdfUrl} title={activeBook.title} />}
                        </div>
                        <p style={{
                            margin: '20px 0 0', flexShrink: 0, color: 'white', opacity: 0.55, position: 'relative', zIndex: 2, pointerEvents: 'none',
                            fontSize: '0.75rem', fontFamily: 'var(--font-jp)', textAlign: 'center',
                        }}>
                            {FLOOR0_COPY_NOTICE}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

export function Classroom({ currentFloorId, lectures = [], sixFRoomEntered = false, sevenFRoomEntered = false, fiveFRoomEntered = false, fourFRoomEntered = false, threeFRoomEntered = false, twoFRoomEntered = false, floor0Books = [], floor0Series = [], floor0Pickup, floor0ZoneProgress, floor0ShelfProgress, floor0Zone = null, onFloor0ZoneChange, room7RevealOpacity }) {
    // Find applicable lectures for this floor
    const floorLectures = lectures.filter(l => l.floorId === currentFloorId);

    const [activeLecture, setActiveLecture] = useState(null);
    const [isIntroFinished, setIsIntroFinished] = useState(false);
    const [activeWorkshop, setActiveWorkshop] = useState(null);

    // Cinema Modal State
    const [cinemaData, setCinemaData] = useState({ isOpen: false, url: '', title: '' });
    // Classroom Modal State (Real-time)
    const [classroomModalData, setClassroomModalData] = useState({ isOpen: false, url: '', title: '' });
    // Transition overlay state
    const [transitioningResource, setTransitioningResource] = useState(null);
    const [transitioningWorkshop, setTransitioningWorkshop] = useState(null);
    const [skipToWorkshopHallway, setSkipToWorkshopHallway] = useState(false); // 7F: 本→本のアニメ→全画面ワークに直行した場合のフラグ

    // Auth removed
    const user = null;
    const [responses, setResponses] = useState([]);
    const [formAnswers, setFormAnswers] = useState({}); // { qId: text }
    const [viewMode, setViewMode] = useState('WALL'); // 'FORM' or 'WALL'
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0); // 1問ずつ表示
    const [selectedResponse, setSelectedResponse] = useState(null); // For Modal
    // スマホ: 講義室の映像・オンライン講義のボタンを部屋の写真の中に収める
    const isMobile = useIsMobile();

    // Reset selection when floor changes
    useEffect(() => {
        setActiveLecture(null);
        setIsIntroFinished(false);
        setActiveWorkshop(null);
        setFormAnswers({});
        setViewMode('WALL');
        setCinemaData({ isOpen: false, url: '', title: '' });
        setClassroomModalData({ isOpen: false, url: '', title: '' });
        setSkipToWorkshopHallway(false);
    }, [currentFloorId]);

    // Load responses
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setResponses(JSON.parse(saved));
        }
    }, []);

    // Keep active records in sync with `lectures` prop (e.g., when edited in Admin Dashboard)
    useEffect(() => {
        if (activeLecture) {
            const updatedLecture = lectures.find(l => l.id === activeLecture.id);
            if (updatedLecture && JSON.stringify(updatedLecture) !== JSON.stringify(activeLecture)) {
                setActiveLecture(updatedLecture);
                if (activeWorkshop) {
                    const updatedWorkshop = updatedLecture.workshops.find(w => w.id === activeWorkshop.id);
                    if (updatedWorkshop) {
                        setActiveWorkshop(updatedWorkshop);
                    } else {
                        setActiveWorkshop(null);
                    }
                }
            }
        }
    }, [lectures, activeLecture, activeWorkshop]);

    // フックはすべて呼び終えているので、ここでフロア別のプレースホルダーに早期returnして良い
    // （hooksの呼び出し順が毎レンダー同じになるよう、早期returnはhooksの後に置く）
    if (currentFloorId === '6F' && !sixFRoomEntered) return <Floor6View />;
    if (currentFloorId === '7F' && !sevenFRoomEntered) return <Floor7Placeholder />;
    if (currentFloorId === '5F' && !fiveFRoomEntered) return <Floor5View />;
    if (currentFloorId === '4F' && !fourFRoomEntered) return <Floor4View />;
    if (currentFloorId === '3F' && !threeFRoomEntered) return <Floor3View />;
    if (currentFloorId === '2F' && !twoFRoomEntered) return <Floor2View />;
    if (currentFloorId === '0F') return <Floor0Library books={floor0Books} series={floor0Series} pickup={floor0Pickup} zoneProgress={floor0ZoneProgress} shelfProgress={floor0ShelfProgress} zone={floor0Zone} onZoneChange={onFloor0ZoneChange} />;

    const handleLectureSelect = (l) => {
        setActiveLecture(l);
        setIsIntroFinished(false);
        setActiveWorkshop(null); // Reset workshop
        window.scrollTo(0, 0);
    };

    const handleBackToHallway = () => {
        setActiveLecture(null);
        setIsIntroFinished(false);
        setActiveWorkshop(null);
        setSkipToWorkshopHallway(false);
        window.scrollTo(0, 0);
    }

    // 7F: 本をクリックしたら、講義の導入やAVルームを飛ばして
    // 「本が開く演出→全画面でワーク」に直接つなげる
    const handleSevenFBookSelect = (l) => {
        const w = l.workshops && l.workshops[0];
        if (!w) return;
        setActiveLecture(l);
        setIsIntroFinished(true);
        setSkipToWorkshopHallway(true);
        setTransitioningWorkshop({ ...w, color: 'var(--floor-7)' });

        setTimeout(() => {
            setActiveWorkshop(w);
            setFormAnswers({});
            setViewMode('FORM');
            setCurrentQuestionIndex(0);
            setTransitioningWorkshop(null);
        }, 2500);
    };

    // Consistent colors for workshops
    const workshopColors = [
        '#9ae6b4', // Mint green
        '#fbd38d', // Warm yellow/orange
        '#e9d8fd', // Soft purple
        '#fed7d7', // Light red/pink
        '#bbf7d0', // Very light green
        '#bfdbfe'  // Soft blue
    ];

    const getWorkshopColor = (id) => {
        // Use a simple hash of the string to pick a predictable color index
        if (!id) return workshopColors[0];
        let hash = 0;
        const str = id.toString();
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        const index = Math.abs(hash) % workshopColors.length;
        return workshopColors[index];
    };

    const handleWorkshopSelect = (w, color) => {
        setTransitioningWorkshop({ ...w, color });

        // Let the book fully open (and show its content) before handing off to the full-page book view —
        // matches BookTransitionOverlay's own 2.5s animation so it doesn't get cut off mid-flip
        setTimeout(() => {
            setActiveWorkshop(w);
            setFormAnswers({}); // Reset form
            setViewMode('FORM');
            setCurrentQuestionIndex(0);
            setTransitioningWorkshop(null);
        }, 2500);
    };

    const handleCloseWorkshop = () => {
        if (skipToWorkshopHallway) {
            // 本から直行した場合は、講義の中間画面ではなくフロアの廊下まで戻す
            handleBackToHallway();
        } else {
            setActiveWorkshop(null);
        }
    };

    const handlSubmit = (e) => {
        e.preventDefault();
        // Validate: At least one answer?
        const hasAnswer = Object.values(formAnswers).some(a => a.trim().length > 0);
        if (!hasAnswer) {
            alert('少なくとも1つの質問に回答してください');
            return;
        }

        const newResponse = {
            id: Date.now(),
            workshopId: activeWorkshop.id,
            userId: null,
            name: formAnswers.name || '匿名',
            answers: formAnswers,
            timestamp: Date.now(),
            floorId: currentFloorId
        };

        const updated = [newResponse, ...responses];
        setResponses(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

        setViewMode('WALL');
        alert('回答を提出しました。ウォールに共有されました。');
    };

    const openCinema = (e, url, title) => {
        if (e) e.preventDefault();
        setCinemaData({ isOpen: true, url, title });
    };

    const openClassroomModal = (e, url, title) => {
        if (e) e.preventDefault();
        setClassroomModalData({ isOpen: true, url, title });
    };

    const startResourceTransition = (e, link, isRecorded, isRealtime, isExternal) => {
        e.preventDefault();
        if (isExternal) {
            window.open(link.url, '_blank');
            return;
        }

        setTransitioningResource({ link, isRecorded, isRealtime });

        // Wait mid-animation to show the actual Modal
        setTimeout(() => {
            if (isRecorded) {
                openCinema(null, link.url, link.title);
            } else if (isRealtime) {
                openClassroomModal(null, link.url, link.title);
            }
        }, 2000);

        // Hide overlay slightly faster after opening
        setTimeout(() => {
            setTransitioningResource(null);
        }, 3200);
    };

    const activeResponses = responses.filter(r =>
        (!activeWorkshop || r.workshopId === activeWorkshop.id) &&
        r.floorId === currentFloorId
    );

    // --- HALLWAY VIEW ---
    if (!activeLecture) {
        return (
            <div style={{ position: 'relative', width: '100%', marginTop: '20px' }}>

                <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 120px)', borderRadius: '20px', overflow: 'hidden' }}>

{/* Doors (Lectures) */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 5, padding: '100px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignContent: 'center' }}>
                    {floorLectures.length === 0 ? null : (
                        floorLectures.map((l, index) => (
                            l.floorId === '7F' ? null : (
                            <motion.div
                                key={l.id}
                                whileHover={{ scale: 1.05, y: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleLectureSelect(l)}
                                style={{
                                    height: '300px',
                                    backgroundImage: `url(${lectureBg})`,
                                    backgroundSize: 'cover',
                                    backgroundPosition: 'center',
                                    border: '1px solid rgba(255,255,255,0.2)',
                                    borderRadius: '8px 8px 0 0',
                                    borderBottom: '4px solid var(--floor-4)',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: 'pointer',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                                    padding: '20px',
                                    textAlign: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}
                            >
                                {/* Background Overlay for Text Readability */}
                                <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)' }} />

                                {/* Door Glow Effect on Hover */}
                                <div className="door-glow" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top, rgba(143,211,244,0.3) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.3s' }} />

                                <BookOpen size={32} color="var(--floor-4)" style={{ marginBottom: '16px', filter: 'drop-shadow(0 0 10px rgba(143,211,244,0.5))', position: 'relative', zIndex: 1 }} />
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)', position: 'relative', zIndex: 1 }}>
                                    {l.title}
                                </h4>
                                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>ルームへ入る</p>

                                <style>{`.door-glow:hover { opacity: 1 !important; }`}</style>
                            </motion.div>
                            )
                        ))
                    )}
                </div>
                </div>

                {/* 7F: 2枚目の背景（円卓・演台の間）が表示されている間だけ、本を浮かび上がらせる */}
                {currentFloorId === '7F' && floorLectures.length > 0 && (
                    <motion.div
                        whileHover={{ scale: 1.05, y: -6 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleSevenFBookSelect(floorLectures[0])}
                        style={{
                            position: 'fixed', left: '44%', top: '68%', transform: 'translate(-50%, -50%)',
                            zIndex: 6, opacity: room7RevealOpacity ?? 0,
                            pointerEvents: room7RevealOpacity ? 'auto' : 'none',
                            width: '110px', aspectRatio: '3 / 4',
                            borderRadius: '4px',
                            border: '1px solid rgba(212,175,55,0.5)',
                            background: 'linear-gradient(160deg, #223324 0%, #10190f 100%)',
                            boxShadow: '0 14px 30px rgba(0,0,0,0.6)',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            gap: '10px', padding: '12px', cursor: 'pointer',
                        }}
                    >
                        <div style={{ position: 'absolute', inset: '7px', border: '1px solid rgba(212,175,55,0.4)' }} />
                        <BookOpen size={20} color="#d4af37" style={{ filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.5))' }} />
                        <span style={{
                            color: '#d4af37', fontFamily: 'var(--font-jp)', fontSize: '0.7rem',
                            fontWeight: 'bold', textAlign: 'center', lineHeight: 1.4, wordBreak: 'keep-all',
                        }}>
                            {floorLectures[0].title}
                        </span>
                    </motion.div>
                )}
            </div>
        );
    }

    if (activeLecture && !isIntroFinished) {
        return <LectureIntroSequence lecture={activeLecture} onComplete={() => setIsIntroFinished(true)} onBack={handleBackToHallway} />;
    }

    // --- LECTURE ROOM VIEW ---
    return (
        <div style={{ marginTop: '20px' }}>
            <div className="glass-panel" style={{ padding: isMobile ? '16px 12px' : '24px', borderRadius: '20px', marginBottom: '24px', position: 'relative' }}>
                <button
                    onClick={handleBackToHallway}
                    style={{ position: 'absolute', top: '-10px', left: '20px', padding: '8px 16px', borderRadius: '20px', background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', zIndex: 10 }}
                >
                    <ArrowLeft size={14} /> 廊下へ戻る
                </button>

                <h2 style={{ margin: '20px 0 16px', display: 'flex', alignItems: 'center', gap: '12px', fontSize: isMobile ? '1.15rem' : undefined }}>
                    <BookOpen size={24} color="var(--floor-4)" style={{ flexShrink: 0 }} />
                    {activeLecture.title}
                </h2>

                {/* Links / Audio-Visual Room Section */}
                {activeLecture.links && activeLecture.links.length > 0 && (() => {
                    const recordedLinks = [];
                    const realtimeLinks = [];
                    const externalLinks = [];

                    activeLecture.links.forEach(link => {
                        const isRealtime = link.type === 'realtime';
                        const isRecorded = link.type === 'recorded' || (!link.type && (link.url.includes('youtube.com') || link.url.includes('youtu.be') || link.url.includes('vimeo')));
                        if (isRealtime) realtimeLinks.push(link);
                        else if (isRecorded) recordedLinks.push(link);
                        else externalLinks.push(link);
                    });

                    // Combine realtime and external for the sofa area, or keep external separate.
                    const sofaLinks = [...realtimeLinks, ...externalLinks];

                    return (
                        <div style={{ 
                            marginTop: '24px', 
                            position: 'relative',
                            width: '100%',
                            aspectRatio: isMobile ? '4/3' : '16/10', // roughly matches the room photo（スマホではボタンが入るよう少し縦長に）
                            backgroundImage: `url(${avRoomBg})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            borderRadius: '16px',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                            overflow: 'hidden'
                        }}>
                            {/* Wall Area (Recorded Videos) */}
                            {recordedLinks.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: isMobile ? '26%' : '32%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: isMobile ? '88%' : '70%',
                                    height: isMobile ? '28%' : '25%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: isMobile ? '10px' : '20px',
                                    zIndex: 5
                                }}>
                                    {recordedLinks.map((link, idx) => (
                                        <motion.div
                                            key={`rec-${idx}`}
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={(e) => startResourceTransition(e, link, true, false, false)}
                                            style={{
                                                flex: 1,
                                                maxWidth: '280px',
                                                height: '100%',
                                                backgroundImage: `url(${imgCinema})`,
                                                backgroundSize: 'cover',
                                                backgroundPosition: 'center',
                                                borderRadius: '8px',
                                                border: '2px solid #333',
                                                boxShadow: '0 10px 20px rgba(0,0,0,0.6)',
                                                cursor: 'pointer',
                                                display: 'flex',
                                                alignItems: 'flex-end',
                                                padding: isMobile ? '6px 8px' : '12px',
                                                minWidth: 0,
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />
                                            <div style={{ position: 'relative', zIndex: 1, color: 'white', width: '100%', minWidth: 0 }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.62rem' : '0.8rem', marginBottom: isMobile ? '2px' : '4px', whiteSpace: 'nowrap' }}>
                                                    <PlayCircle size={14} /> シアター室へ
                                                </div>
                                                <div style={{ fontWeight: 'bold', fontSize: isMobile ? '0.75rem' : '0.95rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {link.title}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Sofa Area (Zoom/Realtime/External Links) */}
                            {sofaLinks.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: isMobile ? '62%' : '68%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: isMobile ? '92%' : '80%',
                                    height: isMobile ? '28%' : '22%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    gap: isMobile ? '10px' : '30px',
                                    zIndex: 5
                                }}>
                                    {sofaLinks.map((link, idx) => {
                                        const isExternal = link.type !== 'realtime' && link.type !== 'recorded' && !link.url.includes('youtube') && !link.url.includes('vimeo');
                                        return (
                                            <motion.div
                                                key={`sofa-${idx}`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={(e) => startResourceTransition(e, link, false, !isExternal, isExternal)}
                                                style={{
                                                    flex: 1,
                                                    maxWidth: '240px',
                                                    height: '100%',
                                                    backgroundImage: isExternal ? 'none' : `url(${imgClassroom})`,
                                                    backgroundColor: isExternal ? '#2d3748' : 'transparent',
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    borderRadius: '8px',
                                                    border: '2px solid #555',
                                                    boxShadow: '0 10px 20px rgba(0,0,0,0.6)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'flex-end',
                                                    padding: isMobile ? '6px 8px' : '12px',
                                                    minWidth: 0,
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {!isExternal && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />}
                                                <div style={{ position: 'relative', zIndex: 1, color: 'white', width: '100%', minWidth: 0 }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: isMobile ? '0.6rem' : '0.75rem', marginBottom: isMobile ? '2px' : '4px', whiteSpace: 'nowrap' }}>
                                                        {isExternal ? <ExternalLink size={12} /> : <User size={12} />}
                                                        {isExternal ? '外部リンク' : 'オンライン講義室へ'}
                                                    </div>
                                                    <div style={{ fontWeight: 'bold', fontSize: isMobile ? '0.72rem' : '0.85rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                        {link.title}
                                                    </div>
                                                </div>
                                            </motion.div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    );
                })()}

                {/* Workshop Library (Scroll to advance deeper and select workshops) */}
                <WorkshopLibrary
                    workshops={activeLecture.workshops}
                    activeWorkshop={activeWorkshop}
                    onWorkshopSelect={handleWorkshopSelect}
                    getWorkshopColor={getWorkshopColor}
                />
            </div>

            {/* 本を開いたあとは、部屋から独立した全画面の「本の中」ページとして表示 */}
            <AnimatePresence>
                {activeWorkshop && (
                    <motion.div
                        key="workshop-page"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.5 }}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 500,
                            background: '#f8f9fa',
                            overflowY: 'auto',
                        }}
                    >
                        {/* 右端の写真: 左側を背景に溶け込ませる。画面が狭いときはフォームと重なるので出さない */}
                        <img
                            className="workshop-side-photo"
                            src={WORKSHOP_SIDE_PHOTOS[Math.max(0, activeLecture.workshops.findIndex(w => w.id === activeWorkshop.id)) % WORKSHOP_SIDE_PHOTOS.length]}
                            alt=""
                            draggable={false}
                            style={{
                                position: 'fixed', right: 0, top: '4vh', zIndex: 0,
                                height: 'min(82vh, 760px)', width: 'auto', maxWidth: '34vw',
                                objectFit: 'contain', objectPosition: 'right top',
                                pointerEvents: 'none', userSelect: 'none',
                                maskImage: 'linear-gradient(to right, transparent 0%, black 38%)',
                                WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 38%)',
                            }}
                        />
                        <style>{`@media (max-width: 1099px) { .workshop-side-photo { display: none; } }`}</style>
                        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', margin: '0 auto', padding: '32px 24px 100px' }}>
                            <button
                                onClick={handleCloseWorkshop}
                                style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 16px', borderRadius: '20px', background: '#ffffff', border: '1px solid #dee2e6', color: '#1a202c', cursor: 'pointer', fontSize: '0.85rem', marginBottom: '24px' }}
                            >
                                <ArrowLeft size={14} /> 本棚に戻る
                            </button>

                            {/* Tabs */}
                            <div style={{ display: 'flex', gap: '4px', marginBottom: '20px' }}>
                                <button
                                    onClick={() => setViewMode('FORM')}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                        background: viewMode === 'FORM' ? '#ffffff' : 'transparent',
                                        border: viewMode === 'FORM' ? '1px solid var(--floor-3)' : '1px solid transparent',
                                        color: viewMode === 'FORM' ? '#1a202c' : '#718096',
                                        fontWeight: viewMode === 'FORM' ? 'bold' : 'normal'
                                    }}
                                >
                                    回答する (Input)
                                </button>
                                <button
                                    onClick={() => setViewMode('WALL')}
                                    style={{
                                        flex: 1, padding: '12px', borderRadius: '8px', cursor: 'pointer',
                                        background: viewMode === 'WALL' ? '#ffffff' : 'transparent',
                                        border: viewMode === 'WALL' ? '1px solid var(--floor-4)' : '1px solid transparent',
                                        color: viewMode === 'WALL' ? '#1a202c' : '#718096',
                                        fontWeight: viewMode === 'WALL' ? 'bold' : 'normal'
                                    }}
                                >
                                    みんなの回答 (Wall)
                                </button>
                            </div>

                            <AnimatePresence mode="wait">
                                {viewMode === 'FORM' ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div style={{ marginBottom: '24px', borderLeft: '4px solid var(--floor-3)', paddingLeft: '16px' }}>
                                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1a202c', fontFamily: 'var(--font-jp)' }}>{activeWorkshop.title}</h4>
                                            <p style={{ margin: '4px 0 0', color: '#4a5568' }}>{activeWorkshop.description}</p>
                                        </div>

                                        <form onSubmit={handlSubmit}>
                                            <div style={{ marginBottom: '24px' }}>
                                                <label style={{ display: 'block', fontSize: '0.9rem', color: '#4a5568', marginBottom: '8px' }}>
                                                    表示名 (任意)
                                                </label>
                                                <input
                                                    type="text"
                                                    placeholder="ニックネーム"
                                                    value={formAnswers.name || ''}
                                                    onChange={e => setFormAnswers({ ...formAnswers, name: e.target.value })}
                                                    style={{
                                                        width: '100%', padding: '12px', borderRadius: '8px',
                                                        background: '#ffffff',
                                                        border: '1px solid #dee2e6',
                                                        color: '#1a202c',
                                                        cursor: 'text'
                                                    }}
                                                />
                                            </div>

                                            {(() => {
                                                const questions = activeWorkshop.questions;
                                                const q = questions[currentQuestionIndex];
                                                const isFirst = currentQuestionIndex === 0;
                                                const isLast = currentQuestionIndex === questions.length - 1;
                                                const isAnswered = (formAnswers[q.id] || '').trim().length > 0;

                                                return (
                                                    <>
                                                        {/* 進捗 */}
                                                        <div style={{ fontSize: '0.8rem', color: '#718096', marginBottom: '8px' }}>
                                                            Q{currentQuestionIndex + 1} / {questions.length}
                                                        </div>
                                                        <div style={{ height: '4px', borderRadius: '2px', background: '#e2e8f0', marginBottom: '28px', overflow: 'hidden' }}>
                                                            <div style={{ height: '100%', width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, background: 'var(--floor-3)', transition: 'width 0.3s ease' }} />
                                                        </div>

                                                        {/* 1問ずつ表示 */}
                                                        <AnimatePresence mode="wait">
                                                            <motion.div
                                                                key={q.id}
                                                                initial={{ opacity: 0, x: 20 }}
                                                                animate={{ opacity: 1, x: 0 }}
                                                                exit={{ opacity: 0, x: -20 }}
                                                                transition={{ duration: 0.3 }}
                                                                style={{ marginBottom: '32px' }}
                                                            >
                                                                <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', lineHeight: 1.5, color: '#1a202c' }}>
                                                                    <span style={{ color: 'var(--floor-3)', marginRight: '8px' }}>Q{currentQuestionIndex + 1}.</span>
                                                                    {q.text}
                                                                </label>
                                                                <textarea
                                                                    rows={4}
                                                                    placeholder="ここに入力..."
                                                                    value={formAnswers[q.id] || ''}
                                                                    onChange={e => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                                                                    style={{ width: '100%', padding: '16px', borderRadius: '8px', background: '#ffffff', border: '1px solid #dee2e6', color: '#1a202c', fontFamily: 'inherit', resize: 'vertical' }}
                                                                    autoFocus
                                                                />
                                                            </motion.div>
                                                        </AnimatePresence>

                                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                                                            <button
                                                                type="button"
                                                                onClick={() => setCurrentQuestionIndex(i => Math.max(0, i - 1))}
                                                                disabled={isFirst}
                                                                style={{ padding: '12px 24px', borderRadius: '30px', background: 'transparent', border: '1px solid #cbd5e0', color: isFirst ? '#cbd5e0' : '#4a5568', cursor: isFirst ? 'default' : 'pointer', fontSize: '0.9rem' }}
                                                            >
                                                                ← 前の質問
                                                            </button>

                                                            {isLast ? (
                                                                <button
                                                                    type="submit"
                                                                    disabled={!isAnswered}
                                                                    style={{ padding: '14px 40px', borderRadius: '30px', background: isAnswered ? 'var(--floor-3)' : '#e2e8f0', color: isAnswered ? '#000' : '#a0aec0', fontWeight: 'bold', fontSize: '1rem', cursor: isAnswered ? 'pointer' : 'default', border: 'none' }}
                                                                >
                                                                    回答を提出して共有
                                                                </button>
                                                            ) : (
                                                                <button
                                                                    type="button"
                                                                    onClick={() => isAnswered && setCurrentQuestionIndex(i => Math.min(questions.length - 1, i + 1))}
                                                                    disabled={!isAnswered}
                                                                    style={{ padding: '14px 40px', borderRadius: '30px', background: isAnswered ? 'var(--floor-3)' : '#e2e8f0', color: isAnswered ? '#000' : '#a0aec0', fontWeight: 'bold', fontSize: '1rem', cursor: isAnswered ? 'pointer' : 'default', border: 'none' }}
                                                                >
                                                                    次へ →
                                                                </button>
                                                            )}
                                                        </div>

                                                        {!isAnswered && (
                                                            <p style={{ fontSize: '0.8rem', color: '#a0aec0', marginTop: '12px', textAlign: 'center' }}>
                                                                回答を入力すると次に進めます
                                                            </p>
                                                        )}

                                                        {isLast && isAnswered && (
                                                            <p style={{ fontSize: '0.8rem', color: '#718096', marginTop: '12px', textAlign: 'center' }}>
                                                                ※提出された回答は、同じ授業を受けている他の参加者にも公開されます。
                                                            </p>
                                                        )}
                                                    </>
                                                );
                                            })()}
                                        </form>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="wall"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                    >
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                                            {activeResponses.length === 0 ? (
                                                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: '#718096' }}>
                                                    まだ回答がありません。<br />「回答する」タブから最初の気づきを投稿しましょう。
                                                </div>
                                            ) : (
                                                activeResponses.map(r => (
                                                    <div
                                                        key={r.id}
                                                        onClick={() => setSelectedResponse(r)}
                                                        style={{ padding: '20px', borderRadius: '12px', cursor: 'pointer', transition: 'transform 0.2s', background: '#ffffff', border: '1px solid #dee2e6', borderTop: '4px solid var(--floor-4)' }}
                                                    >
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                            <User size={16} color="#718096" />
                                                            <span style={{ fontWeight: 'bold', color: '#1a202c' }}>{r.name}</span>
                                                        </div>
                                                        <p style={{ fontSize: '0.9rem', color: '#718096', marginBottom: '16px' }}>
                                                            {new Date(r.timestamp).toLocaleString('ja-JP')}
                                                        </p>
                                                        <div style={{ fontSize: '0.85rem', background: '#f8f9fa', border: '1px solid #edf2f7', padding: '10px', borderRadius: '8px', color: '#1a202c' }}>
                                                            <div style={{ marginBottom: '4px', opacity: 0.7 }}>回答の一部:</div>
                                                            <div style={{ fontStyle: 'italic', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                                "{Object.values(r.answers)[1] || Object.values(r.answers)[0] || '...'}"
                                                            </div>
                                                            <div style={{ textAlign: 'right', marginTop: '8px', color: 'var(--floor-4)', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px' }}>
                                                                全て読む <ChevronRight size={12} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Modal for Details */}
            <ResponseModal
                isOpen={!!selectedResponse}
                onClose={() => setSelectedResponse(null)}
                response={selectedResponse}
                questions={activeWorkshop?.questions || []}
            />

            {/* Cinema Video Modal (Recorded) */}
            <CinemaModal
                isOpen={cinemaData.isOpen}
                onClose={() => setCinemaData({ isOpen: false, url: '', title: '' })}
                videoUrl={cinemaData.url}
                title={cinemaData.title}
            />

            {/* Classroom Modal (Real-time) */}
            <ClassroomModal
                isOpen={classroomModalData.isOpen}
                onClose={() => setClassroomModalData({ isOpen: false, url: '', title: '' })}
                linkUrl={classroomModalData.url}
                title={classroomModalData.title}
            />

            {/* Transition Animation for Room Doors */}
            <ResourceTransitionOverlay resource={transitioningResource} />
            <BookTransitionOverlay resource={transitioningWorkshop} />
        </div>
    );
}
