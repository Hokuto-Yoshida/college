import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { Send, User, BookOpen, PenTool, LayoutGrid, ChevronRight, ExternalLink, PlayCircle, ArrowLeft } from 'lucide-react';

import { ResponseModal } from './ResponseModal';
import { CinemaModal } from './CinemaModal';
import { ClassroomModal } from './ClassroomModal';
import hallwayBg from '../assets/library_bg.jpg'; // All floors library background
import avRoomBg from '../assets/av_room_bg.jpg';
import workshopLibraryBg from '../assets/workshop_library_bg.jpg';
import imgCinema from '../assets/cinema_room.png';
import imgClassroom from '../assets/virtual_classroom.png';
import lectureBg from '../assets/lecture_bg.jpg';

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

const BookTransitionOverlay = ({ resource }) => {
    if (!resource) return null;

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
                    {/* Back Cover (Pages) */}
                    <div style={{
                        position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%',
                        background: '#f8f9fa',
                        border: '1px solid #dee2e6',
                        borderRadius: '4px 12px 12px 4px',
                        boxShadow: '10px 10px 30px rgba(0,0,0,0.5)',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        padding: '20px'
                    }}>
                        <div style={{ width: '80%', height: '2px', background: '#e9ecef', marginBottom: '10px' }} />
                        <div style={{ width: '80%', height: '2px', background: '#e9ecef', marginBottom: '10px' }} />
                        <div style={{ width: '60%', height: '2px', background: '#e9ecef' }} />
                    </div>

                    {/* Front Cover */}
                    <motion.div
                        animate={{ rotateY: [0, 0, -150] }}
                        transition={{ duration: 2.5, times: [0, 0.4, 1], ease: "easeInOut" }}
                        style={{
                            position: 'absolute', top: 0, bottom: 0, left: 0, width: '100%',
                            background: `linear-gradient(135deg, ${resource.color || 'var(--floor-6)'} 0%, #151e32 100%)`,
                            border: '2px solid #111',
                            borderRadius: '4px 12px 12px 4px',
                            transformOrigin: 'left center',
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '24px', textAlign: 'center',
                            boxShadow: 'inset 4px 0 10px rgba(0,0,0,0.5), 5px 0 15px rgba(0,0,0,0.5)'
                        }}
                    >
                        <div style={{ border: '2px solid rgba(255,255,255,0.2)', position: 'absolute', inset: '12px', borderRadius: '8px' }} />
                        <BookOpen size={48} color="white" style={{ marginBottom: '20px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))' }} />
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

    return (
        <div style={{ position: 'relative', marginTop: '20px', height: 'calc(100vh - 120px)', borderRadius: '20px', overflow: 'hidden' }}>
            <motion.div
                style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${lectureBg})`,
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

export function Classroom({ currentFloorId, lectures = [] }) {
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

    const workshopsRef = useRef(null);

    const scrollToWorkshops = () => {
        if (workshopsRef.current) {
            // Header height + some padding
            const offset = 80;
            const elementPosition = workshopsRef.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - offset;
            
            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    };

    // Auth removed
    const user = null;
    const [responses, setResponses] = useState([]);
    const [formAnswers, setFormAnswers] = useState({}); // { qId: text }
    const [viewMode, setViewMode] = useState('WALL'); // 'FORM' or 'WALL'
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
        window.scrollTo(0, 0);
    }

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

        // After book opens and fills screen, reveal the workshop content
        setTimeout(() => {
            setActiveWorkshop(w);
            setFormAnswers({}); // Reset form
            setViewMode('FORM');
            setTransitioningWorkshop(null);

            // Scroll down so the workshop is in view
            setTimeout(() => {
                window.scrollBy({ top: 400, behavior: 'smooth' });
            }, 100);
        }, 2000); // Wait 2s for book animation
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
            <div style={{ position: 'relative', width: '100%', height: 'calc(100vh - 120px)', borderRadius: '20px', overflow: 'hidden', marginTop: '20px', background: '#000' }}>
                {/* Background Image */}
                <div style={{
                    position: 'absolute', inset: 0,
                    backgroundImage: `url(${hallwayBg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: 0.9 // Brighter for hospital feel
                }} />

                {/* Header */}
                <div style={{ position: 'absolute', top: '20px', left: '20px', right: '20px', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div className="glass-panel" style={{ padding: '12px 24px', borderRadius: '30px', display: 'flex', alignItems: 'center', gap: '8px', background: 'rgba(0,0,0,0.5)' }}>
                        <BookOpen size={20} color="var(--floor-7)" />
                        <span style={{ fontWeight: 'bold', color: 'white' }}>{currentFloorId} Hallway</span>
                    </div>
                </div>

                {/* Doors (Lectures) */}
                <div style={{ position: 'absolute', inset: 0, zIndex: 5, padding: '100px 40px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', alignContent: 'center', backgroundColor: 'rgba(0,0,0,0.1)' }}>
                    {floorLectures.length === 0 ? (
                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'black', background: 'rgba(255,255,255,0.7)', padding: '20px', borderRadius: '10px', backdropFilter: 'blur(5px)' }}>
                            <p style={{ fontSize: '1.2rem', margin: 0 }}>このフロアにはまだ開講中の講座（部屋）がありません</p>
                        </div>
                    ) : (
                        floorLectures.map((l, index) => (
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
                        ))
                    )}
                </div>
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
                    onWorkshopSelect={(w, color) => {
                        handleWorkshopSelect(w, color);
                        scrollToWorkshops();
                    }}
                    getWorkshopColor={getWorkshopColor} 
                />
            </div>

            <div ref={workshopsRef}>
            {activeWorkshop ? (
                <>
                    {/* 2. Main Area: Tabs */}
                    <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                        <button
                            onClick={() => setViewMode('FORM')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                                background: viewMode === 'FORM' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)',
                                border: viewMode === 'FORM' ? '1px solid var(--floor-3)' : '1px solid transparent',
                                color: 'white'
                            }}
                        >
                            回答する (Input)
                        </button>
                        <button
                            onClick={() => setViewMode('WALL')}
                            style={{
                                flex: 1, padding: '12px', borderRadius: '12px', cursor: 'pointer',
                                background: viewMode === 'WALL' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.2)',
                                border: viewMode === 'WALL' ? '1px solid var(--floor-4)' : '1px solid transparent',
                                color: 'white'
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
                                className="glass-panel"
                                style={{ padding: '24px', borderRadius: '24px' }}
                            >
                                <div style={{ marginBottom: '24px', borderLeft: '4px solid var(--floor-3)', paddingLeft: '16px' }}>
                                    <h4 style={{ margin: 0, fontSize: '1.1rem' }}>{activeWorkshop.title}</h4>
                                    <p style={{ margin: '4px 0 0', color: 'var(--text-muted)' }}>{activeWorkshop.description}</p>
                                </div>

                                <form onSubmit={handlSubmit}>
                                    <div style={{ marginBottom: '24px' }}>
                                        <label style={{ display: 'block', fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                                            表示名 (任意)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="ニックネーム"
                                            value={formAnswers.name || ''}
                                            onChange={e => setFormAnswers({ ...formAnswers, name: e.target.value })}
                                            style={{
                                                width: '100%', padding: '12px', borderRadius: '12px',
                                                background: 'rgba(0,0,0,0.5)',
                                                border: '1px solid var(--glass-border)',
                                                color: 'white',
                                                cursor: 'text'
                                            }}
                                        />
                                    </div>

                                    {activeWorkshop.questions.map((q, idx) => (
                                        <div key={q.id} style={{ marginBottom: '32px' }}>
                                            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '500', lineHeight: 1.5 }}>
                                                <span style={{ color: 'var(--floor-3)', marginRight: '8px' }}>Q{idx + 1}.</span>
                                                {q.text}
                                            </label>
                                            <textarea
                                                rows={3}
                                                placeholder="ここに入力..."
                                                value={formAnswers[q.id] || ''}
                                                onChange={e => setFormAnswers({ ...formAnswers, [q.id]: e.target.value })}
                                                style={{ width: '100%', padding: '16px', borderRadius: '16px', background: 'rgba(0,0,0,0.5)', border: '1px solid var(--glass-border)', color: 'white', fontFamily: 'inherit', resize: 'vertical' }}
                                            />
                                        </div>
                                    ))}

                                    <div style={{ textAlign: 'center' }}>
                                        <button type="submit" className="glass-panel" style={{ padding: '14px 40px', borderRadius: '30px', background: 'var(--floor-3)', color: '#000', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', border: 'none' }}>
                                            回答を提出して共有
                                        </button>
                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '12px' }}>
                                            ※提出された回答は、同じ授業を受けている他の参加者にも公開されます。
                                        </p>
                                    </div>
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
                                        <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                                            まだ回答がありません。<br />「回答する」タブから最初の気づきを投稿しましょう。
                                        </div>
                                    ) : (
                                        activeResponses.map(r => (
                                            <div
                                                key={r.id}
                                                onClick={() => setSelectedResponse(r)}
                                                className="glass-panel"
                                                style={{ padding: '20px', borderRadius: '20px', cursor: 'pointer', transition: 'transform 0.2s', borderTop: '4px solid var(--floor-4)' }}
                                            >
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                                                    <User size={16} color="var(--text-muted)" />
                                                    <span style={{ fontWeight: 'bold' }}>{r.name}</span>
                                                </div>
                                                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                                                    {new Date(r.timestamp).toLocaleString('ja-JP')}
                                                </p>
                                                <div style={{ fontSize: '0.85rem', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '10px' }}>
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
                </>
            ) : (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)', border: '2px dashed var(--glass-border)', borderRadius: '24px' }}>
                    <LayoutGrid size={48} style={{ opacity: 0.3, marginBottom: '16px' }} />
                    <p>受講するワークショップを選択してください</p>
                </div>
            )}
            </div>

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
