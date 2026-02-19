import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, BookOpen, PenTool, LayoutGrid, ChevronRight, ExternalLink } from 'lucide-react';

import { ResponseModal } from './ResponseModal';

const STORAGE_KEY = 'mind_university_classroom_v1';

export function Classroom({ currentFloorId, lectures = [] }) {
    // Find applicable lectures for this floor
    const floorLectures = lectures.filter(l => l.floorId === currentFloorId);

    const [activeLecture, setActiveLecture] = useState(null);
    const [activeWorkshop, setActiveWorkshop] = useState(null);

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
    }, [currentFloorId]);

    // ... (useEffect for loading responses remains same)
    // Load responses
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setResponses(JSON.parse(saved));
        }
    }, []);


    const handleLectureSelect = (l) => {
        setActiveLecture(l);
        setActiveWorkshop(null); // Reset workshop
    };

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

    const activeResponses = responses.filter(r =>
        (!activeWorkshop || r.workshopId === activeWorkshop.id) &&
        r.floorId === currentFloorId
    );

    return (
        <div style={{ marginTop: '20px' }}>

            {/* 1. Header & Navigation */}
            <div className="glass-panel" style={{ padding: '20px', borderRadius: '20px', marginBottom: '24px' }}>
                <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <BookOpen size={20} color="var(--floor-7)" />
                    {currentFloorId} Classroom
                </h3>

                {floorLectures.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)' }}>現在この階層で開講中の講座はありません。</p>
                ) : (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {/* Lecture Select */}
                        {floorLectures.map(l => (
                            <button
                                key={l.id}
                                onClick={() => handleLectureSelect(l)}
                                style={{
                                    padding: '8px 16px',
                                    borderRadius: '12px',
                                    border: activeLecture?.id === l.id ? '1px solid var(--floor-5)' : '1px solid var(--glass-border)',
                                    background: activeLecture?.id === l.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                    color: activeLecture?.id === l.id ? 'white' : 'var(--text-muted)',
                                    cursor: 'pointer'
                                }}
                            >
                                {l.title}
                            </button>
                        ))}
                    </div>
                )}

                {/* Links Section */}
                {activeLecture && activeLecture.links && activeLecture.links.length > 0 && (
                    <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>関連リソース:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {activeLecture.links.map((link, idx) => (
                                <a
                                    key={idx}
                                    href={link.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        display: 'inline-flex', alignItems: 'center', gap: '6px',
                                        padding: '6px 12px', borderRadius: '12px',
                                        background: 'rgba(255,255,255,0.05)',
                                        border: '1px solid var(--glass-border)',
                                        color: 'var(--floor-3)',
                                        fontSize: '0.85rem',
                                        textDecoration: 'none',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
                                    onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
                                >
                                    <ExternalLink size={12} /> {link.title}
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Workshop Select */}
                {activeLecture && (
                    <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--glass-border)' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>ワークショップを選択:</p>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {activeLecture.workshops.map(w => (
                                <button
                                    key={w.id}
                                    onClick={() => handleWorkshopSelect(w)}
                                    style={{
                                        padding: '8px 16px',
                                        borderRadius: '12px',
                                        border: activeWorkshop?.id === w.id ? '1px solid var(--floor-3)' : '1px solid var(--glass-border)',
                                        background: activeWorkshop?.id === w.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                        color: activeWorkshop?.id === w.id ? 'white' : 'var(--text-muted)',
                                        cursor: 'pointer',
                                        display: 'flex', alignItems: 'center', gap: '6px'
                                    }}
                                >
                                    <PenTool size={14} /> {w.title}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
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
        </div>
    );
}
