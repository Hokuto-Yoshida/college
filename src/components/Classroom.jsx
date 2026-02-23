import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, BookOpen, PenTool, LayoutGrid, ChevronRight, ExternalLink, PlayCircle, ArrowLeft } from 'lucide-react';

import { ResponseModal } from './ResponseModal';
import { CinemaModal } from './CinemaModal';
import { ClassroomModal } from './ClassroomModal';
import hallwayBg from '../assets/hospital_school_hallway.png'; // Updated Background

const STORAGE_KEY = 'mind_university_classroom_v1';

export function Classroom({ currentFloorId, lectures = [] }) {
    // Find applicable lectures for this floor
    const floorLectures = lectures.filter(l => l.floorId === currentFloorId);

    const [activeLecture, setActiveLecture] = useState(null);
    const [activeWorkshop, setActiveWorkshop] = useState(null);

    // Cinema Modal State
    const [cinemaData, setCinemaData] = useState({ isOpen: false, url: '', title: '' });
    // Classroom Modal State (Real-time)
    const [classroomModalData, setClassroomModalData] = useState({ isOpen: false, url: '', title: '' });

    // Auth removed
    const user = null;
    const [responses, setResponses] = useState([]);
    const [formAnswers, setFormAnswers] = useState({}); // { qId: text }
    const [viewMode, setViewMode] = useState('WALL'); // 'FORM' or 'WALL'
    const [selectedResponse, setSelectedResponse] = useState(null); // For Modal

    // Reset selection when floor changes
    useEffect(() => {
        setActiveLecture(null);
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
        setActiveWorkshop(null); // Reset workshop
    };

    const handleBackToHallway = () => {
        setActiveLecture(null);
        setActiveWorkshop(null);
    }

    const handleWorkshopSelect = (w) => {
        setActiveWorkshop(w);
        setFormAnswers({}); // Reset form
        setViewMode('FORM');
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
        e.preventDefault();
        setCinemaData({ isOpen: true, url, title });
    };

    const openClassroomModal = (e, url, title) => {
        e.preventDefault();
        setClassroomModalData({ isOpen: true, url, title });
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
                                    // Make the "door" card darker to stand out against the bright hospital hallway
                                    background: 'linear-gradient(180deg, rgba(10,20,30,0.8) 0%, rgba(0,0,0,0.95) 100%)',
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
                                {/* Door Glow Effect on Hover */}
                                <div className="door-glow" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(circle at top, rgba(143,211,244,0.3) 0%, transparent 60%)', opacity: 0, transition: 'opacity 0.3s' }} />

                                <BookOpen size={32} color="var(--floor-4)" style={{ marginBottom: '16px', filter: 'drop-shadow(0 0 10px rgba(143,211,244,0.5))' }} />
                                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: 'white', textShadow: '0 2px 4px rgba(0,0,0,0.8)' }}>
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

                {/* Links / Cinema Section */}
                {activeLecture.links && activeLecture.links.length > 0 && (
                    <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', borderLeft: '4px solid var(--floor-3)' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '0 0 12px 0', fontWeight: 'bold' }}>講義リソース (クリックでシアターを表示)</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
                            {activeLecture.links.map((link, idx) => {
                                // Determine Type: Admin 'type' field takes precedence. Fallback to basic video check for older data.
                                const isRealtime = link.type === 'realtime';
                                const isRecorded = link.type === 'recorded' || (!link.type && (link.url.includes('youtube.com') || link.url.includes('youtu.be') || link.url.includes('vimeo')));
                                const isExternal = !isRealtime && !isRecorded;

                                return (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        onClick={(e) => {
                                            if (isRecorded) {
                                                openCinema(e, link.url, link.title);
                                            } else if (isRealtime) {
                                                openClassroomModal(e, link.url, link.title);
                                            }
                                        }}
                                        target={isExternal ? "_blank" : undefined}
                                        rel={isExternal ? "noopener noreferrer" : undefined}
                                        style={{
                                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                                            padding: '10px 16px', borderRadius: '12px',
                                            background: isRecorded ? 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(0,0,0,0.3))'
                                                : isRealtime ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.2), rgba(0,0,0,0.3))'
                                                    : 'rgba(255,255,255,0.05)',
                                            border: isRecorded ? '1px solid var(--floor-3)'
                                                : isRealtime ? '1px solid var(--floor-4)'
                                                    : '1px solid var(--glass-border)',
                                            color: isRecorded ? 'white' : isRealtime ? 'var(--floor-4)' : 'var(--floor-3)',
                                            fontSize: '0.9rem',
                                            fontWeight: (isRecorded || isRealtime) ? 'bold' : 'normal',
                                            textDecoration: 'none',
                                            transition: 'all 0.2s',
                                            boxShadow: (isRecorded || isRealtime) ? '0 4px 12px rgba(0,0,0,0.2)' : 'none'
                                        }}
                                        onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                                        onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                                    >
                                        {isRecorded && <PlayCircle size={18} color="white" />}
                                        {isRealtime && <User size={18} color="var(--floor-4)" />}
                                        {isExternal && <ExternalLink size={14} />}
                                        {link.title}
                                    </a>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Workshop Select */}
                <div style={{ marginTop: '24px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px', fontWeight: 'bold' }}>ワークショップ</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {activeLecture.workshops.length === 0 ? (
                            <p style={{ color: '#666', fontSize: '0.9rem', fontStyle: 'italic', margin: 0 }}>この講座には現在ワークショップがありません。</p>
                        ) : (
                            activeLecture.workshops.map(w => (
                                <button
                                    key={w.id}
                                    onClick={() => handleWorkshopSelect(w)}
                                    style={{
                                        padding: '10px 20px',
                                        borderRadius: '20px',
                                        border: activeWorkshop?.id === w.id ? '1px solid var(--floor-5)' : '1px solid var(--glass-border)',
                                        background: activeWorkshop?.id === w.id ? 'var(--floor-5)' : 'rgba(0,0,0,0.3)',
                                        color: activeWorkshop?.id === w.id ? 'black' : 'white',
                                        fontWeight: activeWorkshop?.id === w.id ? 'bold' : 'normal',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '8px',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <PenTool size={16} /> {w.title}
                                </button>
                            ))
                        )}
                    </div>
                </div>
            </div>

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
        </div>
    );
}
