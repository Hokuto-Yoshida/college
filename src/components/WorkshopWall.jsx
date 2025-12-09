import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, User, MessageCircle, Filter, Trash2 } from 'lucide-react';
import { floors } from '../data/floors';

const STORAGE_KEY = 'mind_university_responses_v1';

const seedResponses = [
    { id: 1, name: '光のスタジオ', floor: '6F', prompt: '未来の自分に聞く', answer: '呼吸を細く長くしたら、判断よりも「余白」が見えた。', timestamp: Date.now() - 3600000 },
    { id: 2, name: 'Gatekeeper', floor: '1F', prompt: '身体の小さな緊張', answer: '右肩のこわばりを見つけて手で押さえた。', timestamp: Date.now() - 7200000 },
    { id: 3, name: '問いの建築士', floor: '5F', prompt: '思考を再設計', answer: '「疑いは防御ではなく、問いの起点」と書き換えた。', timestamp: Date.now() - 100000 },
];

export function WorkshopWall({ currentFloorId }) {
    const [responses, setResponses] = useState([]);
    const [filter, setFilter] = useState('ALL');
    const [form, setForm] = useState({ name: '', answer: '' });

    // Load data
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            setResponses(JSON.parse(saved));
        } else {
            setResponses(seedResponses);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seedResponses));
        }
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.answer.trim()) return;

        const newResponse = {
            id: Date.now(),
            name: form.name.trim() || '匿名',
            floor: currentFloorId || '7F', // Default to 7F if global view
            prompt: '自由記述', // In a real app, this would come from the specific floor's active workshop
            answer: form.answer,
            timestamp: Date.now()
        };

        const updated = [newResponse, ...responses];
        setResponses(updated);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        setForm({ ...form, answer: '' });
    };

    const filteredResponses = responses.filter(r => {
        if (filter === 'ALL') return true;
        return r.floor === filter;
    });

    return (
        <div className="workshop-wall" style={{ marginTop: '40px' }}>

            {/* Input Area */}
            <div className="glass-panel" style={{ padding: '24px', borderRadius: '24px', marginBottom: '32px' }}>
                <h3 style={{ margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MessageCircle size={20} color="var(--floor-4)" />
                    ライブワーク・回答ウォール
                </h3>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                    あなたの気づきを共有してください。ここは学びの反射板です。
                </p>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: '16px' }}>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                            type="text"
                            placeholder="お名前 (任意)"
                            value={form.name}
                            onChange={e => setForm({ ...form, name: e.target.value })}
                            style={{
                                flex: 1,
                                padding: '12px',
                                borderRadius: '12px',
                                border: '1px solid var(--glass-border)',
                                background: 'rgba(0,0,0,0.2)',
                                color: 'white'
                            }}
                        />
                        <div style={{
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'rgba(255,255,255,0.05)',
                            color: 'var(--text-muted)',
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center'
                        }}>
                            {currentFloorId ? `${currentFloorId}から投稿` : '場所を選択中'}
                        </div>
                    </div>
                    <textarea
                        placeholder="今、何を感じ、何を思考しましたか？"
                        value={form.answer}
                        onChange={e => setForm({ ...form, answer: e.target.value })}
                        style={{
                            width: '100%',
                            minHeight: '100px',
                            padding: '12px',
                            borderRadius: '12px',
                            border: '1px solid var(--glass-border)',
                            background: 'rgba(0,0,0,0.2)',
                            color: 'white',
                            fontFamily: 'inherit'
                        }}
                    />
                    <div style={{ textAlign: 'right' }}>
                        <button
                            type="submit"
                            style={{
                                background: 'linear-gradient(135deg, var(--floor-4), var(--floor-5))',
                                border: 'none',
                                padding: '10px 24px',
                                borderRadius: '20px',
                                color: '#000',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '8px'
                            }}
                        >
                            <Send size={16} /> 共有する
                        </button>
                    </div>
                </form>
            </div>

            {/* Filter Tabs */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '16px', marginBottom: '8px' }}>
                <button
                    onClick={() => setFilter('ALL')}
                    style={{
                        padding: '6px 16px',
                        borderRadius: '16px',
                        border: filter === 'ALL' ? '1px solid var(--floor-7)' : '1px solid var(--glass-border)',
                        background: filter === 'ALL' ? 'rgba(255,255,255,0.1)' : 'transparent',
                        color: 'white',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                    }}
                >
                    すべて
                </button>
                {floors.map(f => (
                    <button
                        key={f.id}
                        onClick={() => setFilter(f.id)}
                        style={{
                            padding: '6px 12px',
                            borderRadius: '16px',
                            border: `1px solid ${filter === f.id ? f.color : 'var(--glass-border)'}`,
                            background: filter === f.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                            color: filter === f.id ? f.color : 'var(--text-muted)',
                            cursor: 'pointer',
                            fontSize: '0.85rem',
                            whiteSpace: 'nowrap'
                        }}
                    >
                        {f.id} {f.domain}
                    </button>
                ))}
            </div>

            {/* Responses Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                <AnimatePresence>
                    {filteredResponses.map((r) => {
                        const floorData = floors.find(f => f.id === r.floor);
                        return (
                            <motion.div
                                key={r.id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                layout
                                className="glass-panel"
                                style={{
                                    borderRadius: '16px',
                                    padding: '16px',
                                    borderTop: `3px solid ${floorData ? floorData.color : 'white'}`
                                }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                        <User size={12} /> {r.name}
                                    </span>
                                    <span style={{
                                        padding: '2px 8px',
                                        borderRadius: '8px',
                                        background: 'rgba(255,255,255,0.1)',
                                        color: floorData ? floorData.color : 'white'
                                    }}>
                                        {floorData ? `${floorData.id} ${floorData.domain}` : r.floor}
                                    </span>
                                </div>
                                {/* Prompt Display (Optional) */}
                                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '4px' }}>
                                    Topic: {r.prompt}
                                </div>
                                <div style={{ fontSize: '1rem', lineHeight: 1.6, whiteSpace: 'pre-wrap' }}>
                                    {r.answer}
                                </div>
                            </motion.div>
                        );
                    })}
                </AnimatePresence>
            </div>

            {filteredResponses.length === 0 && (
                <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                    まだ投稿がありません。最初の発見者になってください。
                </div>
            )}
        </div>
    );
}
