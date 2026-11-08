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
import { titleTextStyle } from '../data/floor0TitleStyle';
import { Floor0TitleText } from './Floor0TitleText';
import workshopSide1 from '../assets/workshop_side_1.webp';
import workshopSide2 from '../assets/workshop_side_2.webp';

// ワーク画面の右端に入れる写真（ワークごとに順番に切り替える）
const WORKSHOP_SIDE_PHOTOS = [workshopSide1, workshopSide2];
import imgCinema from '../assets/cinema_room.png';
import imgClassroom from '../assets/virtual_classroom.png';
import lectureBg from '../assets/lecture_bg2.png';
import lectureBg7F from '../assets/lecture_bg_7f.png';
import floor0ChapterCover from '../assets/floor0_chapter_cover.jpg'; // 0F の章（チャプター）の本の表紙。全章共通

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
                                    width: '110px',
                                    height: '150px',
                                    borderRadius: '4px 10px 10px 4px',
                                    border: isActive ? '3px solid white' : '1px solid rgba(0,0,0,0.2)',
                                    background: wColor,
                                    borderLeft: '10px solid rgba(0,0,0,0.4)',
                                    color: '#1a202c',
                                    fontWeight: 'bold',
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px',
                                    boxShadow: isActive ? '10px 10px 20px rgba(0,0,0,0.6), inset 2px 0 5px rgba(255,255,255,0.8)' : '5px 5px 15px rgba(0,0,0,0.5), inset 2px 0 5px rgba(255,255,255,0.4)',
                                    padding: '12px',
                                    textAlign: 'center',
                                    outline: 'none',
                                    zIndex: isActive ? 6 : 5
                                }}
                            >
                                <div style={{ position: 'absolute', top: 0, bottom: 0, right: 0, width: '3px', background: 'rgba(255,255,255,0.5)', borderRadius: '0 6px 6px 0' }} />
                                <BookOpen size={24} color="#1a202c" style={{ filter: 'drop-shadow(0 1px 2px rgba(255,255,255,0.5))' }} />
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

            <div ref={scrollRef} style={{ position: 'relative', zIndex: 2, height: '100%', overflowY: 'auto', padding: '100px 40px', scrollbarWidth: 'none' }}>
                <style>{`::-webkit-scrollbar { display: none; }`}</style>
                <div style={{ maxWidth: '800px', margin: '0 auto', color: 'white', textShadow: '0px 2px 4px rgba(0,0,0,0.9), 0px 0px 10px rgba(0,0,0,0.8), 0px 0px 20px rgba(0,0,0,0.8), 0px 0px 30px rgba(0,0,0,0.8)', fontSize: '1.2rem', lineHeight: '2.0', fontFamily: 'var(--font-jp)', fontWeight: 'bold' }}>
                    {lecture && (
                        <h2 style={{ fontSize: '2.5rem', marginBottom: '60px', textAlign: 'center', color: 'white', textShadow: '0px 4px 10px rgba(0,0,0,0.9), 0px 0px 20px rgba(0,0,0,0.9)' }}>
                            {lecture.title}
                        </h2>
                    )}
                    {introTextLines.map((text, idx) => (
                        <p key={idx} style={{ marginBottom: '32px' }}>{text}</p>
                    ))}
                    
                    <div style={{ height: '40vh' }} /> {/* Extra space to allow scrolling past text */}

                    <motion.div style={{ opacity: buttonOpacity, pointerEvents: buttonPointerEvents, display: 'flex', justifyContent: 'center', paddingBottom: '100px' }}>
                        <button onClick={onComplete} style={{ background: '#e53e3e', color: 'white', fontSize: '1.2rem', padding: '16px 48px', borderRadius: '30px', border: 'none', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.5)', fontWeight: 'bold' }}>
                            授業を受ける
                        </button>
                    </motion.div>
                </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', transform: 'translateX(-50%)', zIndex: 3, color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', pointerEvents: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
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
const FLOOR0_ZONES = ["KURU'S BOOKSHELF", 'LECTURE PICKS'];
const FLOOR0_ZONE_PATHS = [null, 'pickup']; // 各ゾーンの URL（/main/0F/pickup）。本棚ゾーンは /main/0F のまま

// 0F: 本棚と本を読む画面に出す、無断ダウンロード等へのお願い
const FLOOR0_COPY_NOTICE = '※ 本の内容の無断でのダウンロード・複製・転載はご遠慮ください。';

// 0F の本。表紙画像があれば画像、なければ無地の表紙。タイトル（と subLabel）は本に重ねず、本の下に出す
// titleStyle: 管理画面で選んだタイトルの見た目（{ titleFont, titleSize, titleRuns }。titleRuns は一部だけ変えた区切りと改行）
// onClick がなければ、押せない飾りの本として出す（章の一覧の左に置く「いま開いている本」など）
// captionTone: 本の下の文字色。暗い背景（本棚）では 'light'、明るい背景（ピックアップのテーブル）では 'dark'
function Floor0Cover({ title, coverUrl, subLabel, titleStyle, onClick, captionTone = 'light' }) {
    const titleCss = titleTextStyle(titleStyle);
    const Tag = onClick ? motion.button : motion.div;
    const captionColor = captionTone === 'dark'
        ? { color: '#3b2f22' }
        : { color: 'white', textShadow: '0 1px 6px rgba(0,0,0,0.9), 0 0 2px rgba(0,0,0,0.8)' };
    return (
        <Tag
            onClick={onClick}
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
            }}>
                {!coverUrl && <div style={{ position: 'absolute', inset: '8px', border: '1px solid rgba(212,175,55,0.4)' }} />}
            </div>
            <div style={{
                ...captionColor, fontFamily: 'var(--font-jp)', textAlign: 'center', lineHeight: 1.5,
                wordBreak: 'keep-all', overflowWrap: 'anywhere', // 長いタイトルは本の幅の中で折り返す（本が横に広がらないように）
            }}>
                <div style={{ ...titleCss, fontWeight: 'bold', whiteSpace: 'pre-line' /* 管理画面で入れた改行 */ }}>
                    <Floor0TitleText item={titleStyle} fallback={title} />
                </div>
                {subLabel && <div style={{ fontSize: '0.7rem', opacity: 0.8, marginTop: '2px' }}>{subLabel}</div>}
            </div>
        </Tag>
    );
}

// 0F テーブルゾーンの背景画像（2309×1299）。テーブルの上の、表紙(左)・章(右)を置く位置（画像に対する%）
// 縦長の画面では画像の左右が切れて見えなくなるので、テーブルの中央に上下に並べる
const FLOOR0_TABLE_ASPECT = 2309 / 1299;
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

// 0F テーブルゾーンのテーブルの上に、今週のピックアップの本と章を置く。
// 背景（App 側、画面全体に cover で表示）とぴったり重なるよう、画面に固定して同じ大きさ・同じ横スクロールで動かす
function Floor0PickupTable({ zoneProgress, pickupSeries, pickupChapter, pickupChapterSeries, onOpenSeries, onOpenChapter }) {
    const fallbackProgress = useMotionValue(0);
    // テーブルゾーンの背景は本棚ゾーンの右隣（+100vw）にあり、スクロールに合わせて 0 まで流れてくる
    const x = useTransform(zoneProgress || fallbackProgress, [0, 1], ['100vw', '0vw']);
    if (!pickupSeries && !pickupChapter) return null;

    const items = [
        pickupSeries && {
            key: 'series', label: '今週の本',
            cover: <Floor0Cover title={pickupSeries.title} coverUrl={pickupSeries.coverUrl} titleStyle={pickupSeries} subLabel={`全${pickupSeries.chapters.length}章`} onClick={onOpenSeries} captionTone="dark" />,
        },
        pickupChapter && {
            key: 'chapter', label: '今週の章',
            cover: <Floor0Cover title={pickupChapter.title} coverUrl={floor0ChapterCover} titleStyle={pickupChapter} subLabel={pickupChapterSeries?.title} onClick={onOpenChapter} captionTone="dark" />,
        },
    ].filter(Boolean);

    return createPortal(
        <motion.div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5, x }}>
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

// 0F: 本の中の章を1行に並べ、横スライド（スワイプ・横スクロール・左右の矢印・下のスライダー）で送るスライダー。
// 何もしていないときは自動で1章ずつ送り、最後まで行ったら最初に戻る
const FLOOR0_SLIDER_STEPS = 1000; // 下のスライダーの細かさ
const FLOOR0_AUTO_SLIDE_MS = 3500; // 自動で次の章へ送る間隔
const FLOOR0_AUTO_RESUME_MS = 6000; // 手で動かしたあと、自動送りを再開するまでの時間
const FLOOR0_SLIDER_CSS = `
.floor0-chapter-track::-webkit-scrollbar { display: none; }
.floor0-chapter-range { -webkit-appearance: none; appearance: none; width: 100%; height: 20px; background: transparent; cursor: pointer; margin: 0; }
.floor0-chapter-range::-webkit-slider-runnable-track { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.35); box-shadow: 0 1px 3px rgba(0,0,0,0.5); }
.floor0-chapter-range::-moz-range-track { height: 4px; border-radius: 2px; background: rgba(255,255,255,0.35); box-shadow: 0 1px 3px rgba(0,0,0,0.5); }
.floor0-chapter-range::-webkit-slider-thumb { -webkit-appearance: none; width: 48px; height: 10px; margin-top: -3px; border-radius: 5px; background: #d4af37; box-shadow: 0 1px 4px rgba(0,0,0,0.6); }
.floor0-chapter-range::-moz-range-thumb { width: 48px; height: 10px; border: none; border-radius: 5px; background: #d4af37; box-shadow: 0 1px 4px rgba(0,0,0,0.6); }
`;

// rows: 段数（1 = 横1列）。2 以上なら本棚のように左から右へ1段ずつ並べ、rows 段に収まらない分は右へ伸ばす
// visible: 1段に見せる冊数の目安
// autoSlide: 何もしていないときに自動で送るか
function Floor0ChapterSlider({ children, rows = 1, visible = null, autoSlide = true, label = '章' }) {
    const trackRef = useRef(null);
    const [canPrev, setCanPrev] = useState(false);
    const [canNext, setCanNext] = useState(false);
    const [position, setPosition] = useState(0); // 下のスライダーの位置（0〜FLOOR0_SLIDER_STEPS）
    // 複数段のときの列数: 少なくとも visible 列。rows 段に入りきらなければ列を増やす（＝横にスライド）
    const columns = Math.max(visible || 1, Math.ceil(React.Children.count(children) / rows));
    const hoveringRef = useRef(false); // マウスが乗っている間は自動送りを止める
    const lastManualRef = useRef(0); // 最後に手で動かした時刻
    const markManual = () => { lastManualRef.current = Date.now(); };

    // 左右にまだ送れるかで矢印を出し分け、下のスライダーの位置も合わせる
    const updateArrows = () => {
        const el = trackRef.current;
        if (!el) return;
        const max = el.scrollWidth - el.clientWidth;
        setCanPrev(el.scrollLeft > 4);
        setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
        setPosition(max > 0 ? Math.round((el.scrollLeft / max) * FLOOR0_SLIDER_STEPS) : 0);
    };

    // 下のスライダーを動かしたら、章の列もその位置まで送る
    const handleSliderChange = (e) => {
        const el = trackRef.current;
        if (!el) return;
        const value = Number(e.target.value);
        markManual();
        setPosition(value);
        el.scrollLeft = (value / FLOOR0_SLIDER_STEPS) * (el.scrollWidth - el.clientWidth);
    };
    useEffect(() => {
        const el = trackRef.current;
        if (!el) return;
        const observer = new ResizeObserver(updateArrows);
        observer.observe(el);
        return () => observer.disconnect();
    }, []);

    const slide = (direction) => {
        const el = trackRef.current;
        markManual();
        if (el) el.scrollBy({ left: direction * el.clientWidth * 0.8, behavior: 'smooth' });
    };

    // 自動送り: 一定間隔で1章ぶん進め、端まで来たら最初に戻る。
    // マウスが乗っている間・手で動かした直後・タブが裏にあるとき・「動きを減らす」設定のときは送らない
    useEffect(() => {
        if (!autoSlide || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
        const timer = setInterval(() => {
            const el = trackRef.current;
            if (!el || document.hidden || hoveringRef.current) return;
            if (Date.now() - lastManualRef.current < FLOOR0_AUTO_RESUME_MS) return;
            if (el.scrollWidth - el.clientWidth <= 4) return; // 全部入りきっていれば送らない
            if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 4) {
                el.scrollTo({ left: 0, behavior: 'smooth' });
                return;
            }
            const card = el.querySelector(':scope > div');
            const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
            el.scrollBy({ left: card ? card.offsetWidth + gap : el.clientWidth * 0.8, behavior: 'smooth' });
        }, FLOOR0_AUTO_SLIDE_MS);
        return () => clearInterval(timer);
    }, [autoSlide]);

    const arrowStyle = (side) => ({
        position: 'absolute', top: '50%', [side]: '4px', transform: 'translateY(-50%)', zIndex: 2, // 枠の外に出すと隣のゾーンにはみ出して見える
        width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.3)', color: 'white', cursor: 'pointer',
        backdropFilter: 'blur(8px)',
    });

    return (
        <div
            style={{ margin: '10px 0 40px' }}
            onPointerEnter={(e) => { if (e.pointerType === 'mouse') hoveringRef.current = true; }}
            onPointerLeave={(e) => { if (e.pointerType === 'mouse') hoveringRef.current = false; }}
        >
        <div style={{ position: 'relative' }}>
            {canPrev && (
                <button onClick={() => slide(-1)} style={arrowStyle('left')} aria-label={`前の${label}へ`}>
                    <ChevronRight size={20} style={{ transform: 'rotate(180deg)' }} />
                </button>
            )}
            <div
                ref={trackRef}
                onScroll={updateArrows}
                onPointerDown={markManual}
                onTouchStart={markManual}
                onWheel={markManual}
                className="floor0-chapter-track"
                style={{
                    ...(rows > 1
                        ? {
                            // 1段に visible 冊ほど見える幅にする（狭い画面では 96px より細くしない）
                            display: 'grid',
                            gridTemplateColumns: `repeat(${columns}, ${visible ? `clamp(96px, calc((100% - ${visible - 1} * 20px) / ${visible}), 180px)` : '150px'})`,
                            alignItems: 'start', columnGap: '20px', rowGap: '22px',
                        }
                        : { display: 'flex', alignItems: 'flex-start', gap: '28px' }),
                    overflowX: 'auto', overflowY: 'hidden', padding: '10px 4px',
                    scrollSnapType: 'x proximity', scrollbarWidth: 'none',
                    overscrollBehaviorX: 'contain', // 端まで送っても、本棚ゾーン/テーブルゾーンの切り替えにつながらないようにする
                }}
            >
                <style>{FLOOR0_SLIDER_CSS}</style>
                {children}
            </div>
            {canNext && (
                <button onClick={() => slide(1)} style={arrowStyle('right')} aria-label={`次の${label}へ`}>
                    <ChevronRight size={20} />
                </button>
            )}
        </div>
            {/* 章が画面に入りきらないときだけ、下にスライダーを出す */}
            {(canPrev || canNext) && (
                <div style={{ padding: '8px 4px 0' }}>
                    <input
                        type="range"
                        className="floor0-chapter-range"
                        min={0}
                        max={FLOOR0_SLIDER_STEPS}
                        value={position}
                        onChange={handleSliderChange}
                        aria-label={`${label}の一覧を横に送る`}
                    />
                </div>
            )}
        </div>
    );
}

// 0F 本棚の検索用に、タイトルの表記ゆれ（全角/半角・大文字/小文字・ひらがな/カタカナ・空白や改行）をそろえる
function normalizeForSearch(text) {
    return String(text || '').normalize('NFKC').toLowerCase().replace(/\s+/g, '')
        .replace(/[\u3041-\u3096]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) + 0x60));
}

// 0F: 地下ホールの書庫。まず本（表紙）を選び、その本の章（PDF）を本のようにめくって読める。
// zone / onZoneChange: 見ているゾーンの URL 名（null = 本棚ゾーン, 'pickup'）。App が URL と合わせる
function Floor0Library({ books = [], series = [], pickup = {}, zoneProgress, zone = null, onZoneChange }) {
    const [activeBook, setActiveBook] = useState(null);
    const [transitioningBook, setTransitioningBook] = useState(null);
    const [openSeriesId, setOpenSeriesId] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    // 本棚に並べる本: 章が1つ以上ある本と、どの本にも入っていない章をまとめた「未分類」
    const seriesIds = new Set(series.map(s => s.id));
    const unsorted = books.filter(b => !b.seriesId || !seriesIds.has(b.seriesId));
    const shelf = [
        ...series
            .map(s => ({ ...s, chapters: books.filter(b => b.seriesId === s.id) }))
            .filter(s => s.chapters.length > 0),
        ...(unsorted.length > 0 ? [{ id: FLOOR0_UNSORTED_ID, title: series.length > 0 ? '未分類' : '書庫', coverUrl: null, chapters: unsorted }] : []),
    ];
    // 開いている本が消えた（章がなくなった・削除された）場合は null になり、表紙の一覧に戻る
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

    // 「スクロールして本棚へ」の案内は、少しスクロールしたら消す
    const { scrollY } = useScroll();
    const scrollHintOpacity = useTransform(scrollY, [0, 160], [1, 0]);

    // ピックアップの URL（/main/0F/pickup）で開いたときは、導入の余白を飛ばしてゾーンまでスクロールしておく
    const zonesTopRef = useRef(null);
    useEffect(() => {
        if (zoneIndex > 0) zonesTopRef.current?.scrollIntoView({ block: 'start', behavior: 'instant' });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 今週のピックアップ（設定画面で選んだ本1冊・章1つ）。消された本・章は置かない
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
            {/* 入った直後は本棚全体の背景を見せる余白。下へスクロールすると背景がアップになり、本棚の中身が出てくる */}
            <div style={{
                height: 'calc(100vh - 220px)', minHeight: '240px',
                display: 'flex', alignItems: 'flex-end', justifyContent: 'center', paddingBottom: '24px',
            }}>
                <motion.div
                    animate={{ y: [0, 8, 0] }}
                    transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                        color: 'white', fontFamily: 'var(--font-jp)', fontSize: '0.85rem', letterSpacing: '0.1em',
                        textShadow: '0 2px 8px rgba(0,0,0,0.8)', opacity: scrollHintOpacity,
                    }}
                >
                    スクロールして本棚へ
                    <ChevronRight size={20} style={{ transform: 'rotate(90deg)' }} />
                </motion.div>
            </div>

            {/* ゾーン切り替えのタブ（横スクロール・スワイプでも切り替わる） */}
            <div ref={zonesTopRef} style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '12px', scrollMarginTop: '90px' }}>
                {FLOOR0_ZONES.map((zone, i) => (
                    <button
                        key={zone}
                        onClick={() => scrollToZone(i)}
                        style={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            padding: '8px 18px', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer',
                            fontFamily: 'var(--font-jp)', color: 'white', backdropFilter: 'blur(8px)',
                            background: activeZone === i ? 'rgba(79,195,176,0.35)' : 'rgba(0,0,0,0.45)',
                            border: activeZone === i ? '1px solid var(--floor-0)' : '1px solid rgba(255,255,255,0.2)',
                        }}
                    >
                        {i < activeZone && <ChevronRight size={14} style={{ transform: 'rotate(180deg)' }} />}
                        {zone}
                        {i > activeZone && <ChevronRight size={14} />}
                    </button>
                ))}
            </div>

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
            <div style={{ flex: '0 0 100%', minWidth: 0, scrollSnapAlign: 'start', marginTop: '20px' }}>
                <div style={{
                    marginBottom: '20px', color: 'white', fontFamily: 'var(--font-jp)',
                    textAlign: 'center', textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                }}>
                    {openSeries && (
                        <button
                            onClick={() => setOpenSeriesId(null)}
                            style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px', marginBottom: '14px',
                                padding: '8px 18px', borderRadius: '20px', background: 'rgba(0,0,0,0.45)',
                                border: '1px solid rgba(255,255,255,0.2)', color: 'white', cursor: 'pointer', fontSize: '0.8rem',
                            }}
                        >
                            <ArrowLeft size={14} /> 本の一覧に戻る
                        </button>
                    )}
                    <h3 style={{ margin: '0 0 8px', fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--floor-0)' }}>
                        {openSeries ? openSeries.title : '地下書庫'}
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.75 }}>
                        {openSeries ? '読みたい章を選んでください' : '読みたい本を選んでください'}
                    </p>
                    <p style={{ margin: '10px 0 0', fontSize: '0.75rem', opacity: 0.6 }}>
                        {FLOOR0_COPY_NOTICE}
                    </p>
                </div>
                {openSeries ? (
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'clamp(14px, 3vw, 28px)' }}>
                        {/* いま開いている本の表紙（どの本の章かが分かるように、章の列の左に置く） */}
                        <div style={{
                            flex: '0 0 auto', width: 'clamp(100px, 24vw, 170px)', paddingTop: '20px',
                            paddingRight: 'clamp(14px, 3vw, 28px)', borderRight: '1px solid rgba(212,175,55,0.45)',
                        }}>
                            <Floor0Cover
                                title={openSeries.title}
                                coverUrl={openSeries.coverUrl}
                                titleStyle={openSeries}
                                subLabel={`全${openSeries.chapters.length}章`}
                            />
                        </div>
                        <div style={{ flex: '1 1 auto', minWidth: 0 }}>
                            <Floor0ChapterSlider key={openSeries.id}>
                                {openSeries.chapters.map((b) => (
                                    <div key={b.id} style={{ flex: '0 0 150px', width: '150px', minWidth: 0, scrollSnapAlign: 'start' }}>
                                        <Floor0Cover title={b.title} coverUrl={floor0ChapterCover} titleStyle={b} onClick={() => handleSelectBook(b)} />
                                    </div>
                                ))}
                            </Floor0ChapterSlider>
                        </div>
                    </div>
                ) : (
                    <>
                    {/* タイトル検索 */}
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '0 4px', marginBottom: '8px' }}>
                        <div style={{
                            position: 'relative', width: '100%', maxWidth: '360px',
                        }}>
                            <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.7)', pointerEvents: 'none' }} />
                            <input
                                type="search"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="タイトルで検索"
                                aria-label="本をタイトルで検索"
                                className="floor0-search"
                                style={{
                                    width: '100%', boxSizing: 'border-box', padding: '10px 38px 10px 38px',
                                    borderRadius: '20px', border: '1px solid rgba(255,255,255,0.25)',
                                    background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)',
                                    color: 'white', fontSize: '0.9rem', fontFamily: 'var(--font-jp)', outline: 'none',
                                }}
                            />
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
                    </div>
                    <style>{`
                        .floor0-search::placeholder { color: rgba(255,255,255,0.55); }
                        .floor0-search::-webkit-search-cancel-button { display: none; }
                        .floor0-search:focus { border-color: var(--floor-0); }
                    `}</style>
                    {visibleShelf.length === 0 && (
                        <p style={{
                            textAlign: 'center', color: 'white', fontFamily: 'var(--font-jp)', fontSize: '0.9rem',
                            textShadow: '0 2px 8px rgba(0,0,0,0.8)', margin: '24px 0 40px',
                        }}>
                            「{searchQuery.trim()}」に当てはまる本は見つかりませんでした
                        </p>
                    )}
                    {/* 3段の横スライダー（1段に5冊ほど）。入りきらない分は横に送る */}
                    {visibleShelf.length > 0 && (
                        <Floor0ChapterSlider key={normalizedQuery} rows={3} visible={5} autoSlide={false} label="本">
                            {visibleShelf.map((s) => (
                                <div key={s.id} style={{ minWidth: 0, scrollSnapAlign: 'start' }}>
                                    <Floor0Cover
                                        title={s.title}
                                        coverUrl={s.coverUrl}
                                        titleStyle={s}
                                        subLabel={`全${s.chapters.length}章`}
                                        onClick={() => setOpenSeriesId(s.id)}
                                    />
                                </div>
                            ))}
                        </Floor0ChapterSlider>
                    )}
                    </>
                )}
            </div>

            {/* テーブルゾーン（背景は App 側で本棚ゾーンの右隣に並べている。ピックアップは下の Floor0PickupTable がテーブルの上に置く） */}
            <div style={{ flex: '0 0 100%', minWidth: 0, scrollSnapAlign: 'start', marginTop: '20px', minHeight: '60vh' }}>
                {/* 白いテーブル・壁の上でも読めるよう、文字の後ろに暗めの板を敷く。
                    ピックアップがあるときは本と章が「今週の本/今週の章」の札付きでテーブルに置かれ、見出しと重なるので出さない */}
                {!pickupSeries && !pickupChapter && (
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        display: 'inline-block', padding: '12px 28px', borderRadius: '14px',
                        background: 'rgba(20,16,12,0.6)', backdropFilter: 'blur(6px)',
                        color: 'white', fontFamily: 'var(--font-jp)',
                    }}>
                        <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'var(--floor-0)' }}>
                            今週のピックアップ
                        </h3>
                        <p style={{ margin: '6px 0 0', fontSize: '0.85rem', opacity: 0.85 }}>今週のピックアップは準備中です</p>
                    </div>
                </div>
                )}
            </div>
            </div>

            <Floor0PickupTable
                zoneProgress={zoneProgress}
                pickupSeries={pickupSeries}
                pickupChapter={pickupChapter}
                pickupChapterSeries={pickupChapterSeries}
                onOpenSeries={openPickupSeries}
                onOpenChapter={() => handleSelectBook(pickupChapter)}
            />

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

export function Classroom({ currentFloorId, lectures = [], sixFRoomEntered = false, sevenFRoomEntered = false, fiveFRoomEntered = false, fourFRoomEntered = false, threeFRoomEntered = false, twoFRoomEntered = false, floor0Books = [], floor0Series = [], floor0Pickup, floor0ZoneProgress, floor0Zone = null, onFloor0ZoneChange, room7RevealOpacity }) {
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
    if (currentFloorId === '0F') return <Floor0Library books={floor0Books} series={floor0Series} pickup={floor0Pickup} zoneProgress={floor0ZoneProgress} zone={floor0Zone} onZoneChange={onFloor0ZoneChange} />;

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
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '20px', marginBottom: '24px', position: 'relative' }}>
                <button
                    onClick={handleBackToHallway}
                    style={{ position: 'absolute', top: '-10px', left: '20px', padding: '8px 16px', borderRadius: '20px', background: 'var(--glass-surface)', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', zIndex: 10 }}
                >
                    <ArrowLeft size={14} /> 廊下へ戻る
                </button>

                <h2 style={{ margin: '20px 0 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BookOpen size={24} color="var(--floor-4)" />
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
                            aspectRatio: '16/10', // roughly matches the room photo
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
                                    top: '32%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '70%',
                                    height: '25%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'center',
                                    gap: '20px',
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
                                                padding: '12px',
                                                position: 'relative',
                                                overflow: 'hidden'
                                            }}
                                        >
                                            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />
                                            <div style={{ position: 'relative', zIndex: 1, color: 'white', width: '100%' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', marginBottom: '4px' }}>
                                                    <PlayCircle size={14} /> シアター室へ
                                                </div>
                                                <div style={{ fontWeight: 'bold', fontSize: '0.95rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
                                    top: '68%',
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    width: '80%',
                                    height: '22%',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    alignItems: 'flex-end',
                                    gap: '30px',
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
                                                    padding: '12px',
                                                    position: 'relative',
                                                    overflow: 'hidden'
                                                }}
                                            >
                                                {!isExternal && <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 100%)' }} />}
                                                <div style={{ position: 'relative', zIndex: 1, color: 'white', width: '100%' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', marginBottom: '4px' }}>
                                                        {isExternal ? <ExternalLink size={12} /> : <User size={12} />}
                                                        {isExternal ? '外部リンク' : 'オンライン講義室へ'}
                                                    </div>
                                                    <div style={{ fontWeight: 'bold', fontSize: '0.85rem', textShadow: '0 2px 4px rgba(0,0,0,0.8)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
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
