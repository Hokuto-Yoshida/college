import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Save, Trash2, Edit3, ArrowLeft, MoreVertical, FileText, Check } from 'lucide-react';
import { floors } from '../data/floors';

export function AdminDashboard({ lectures, addLecture, addWorkshop, updateWorkshop, deleteWorkshop, onClose }) {
    const [selectedFloorId, setSelectedFloorId] = useState('7F');
    const [selectedLecture, setSelectedLecture] = useState(null);
    const [editingWorkshop, setEditingWorkshop] = useState(null); // null = list view, object = edit view

    // Filtering
    const floorLectures = lectures.filter(l => l.floorId === selectedFloorId);

    const handleCreateLecture = () => {
        const title = prompt('講座名を入力してください');
        if (title) addLecture(selectedFloorId, title);
    };

    const handleCreateWorkshop = () => {
        if (!selectedLecture) return;
        const newWorkshop = {
            title: '無題のワークショップ',
            description: '説明を入力してください',
            questions: [{ id: `q-${Date.now()}`, text: '質問を入力してください' }]
        };
        // We add it immediately or "draft" it? Let's add immediately then edit.
        // Actually better to have "New" state.
        // Simplified: Just pass a template to the editor.
        setEditingWorkshop({ ...newWorkshop, isNew: true });
    };

    const handleSaveWorkshop = (workshop) => {
        if (workshop.isNew) {
            const { isNew, ...data } = workshop;
            addWorkshop(selectedLecture.id, data);
        } else {
            updateWorkshop(selectedLecture.id, workshop);
        }
        setEditingWorkshop(null);
    };

    const handleDeleteWorkshop = (wId) => {
        if (confirm('本当に削除しますか？')) {
            deleteWorkshop(selectedLecture.id, wId);
        }
    };

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--bg-deep)', display: 'flex' }}>
            {/* Sidebar: Floors */}
            <div style={{ width: '240px', borderRight: '1px solid var(--glass-border)', padding: '20px', overflowY: 'auto' }}>
                <h3 style={{ marginBottom: '20px', color: 'var(--text-muted)' }}>管理ダッシュボード</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {floors.map(f => (
                        <button
                            key={f.id}
                            onClick={() => { setSelectedFloorId(f.id); setSelectedLecture(null); setEditingWorkshop(null); }}
                            style={{
                                textAlign: 'left',
                                padding: '12px',
                                borderRadius: '8px',
                                background: selectedFloorId === f.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: selectedFloorId === f.id ? 'white' : 'var(--text-muted)',
                                border: 'none',
                                cursor: 'pointer',
                                display: 'flex', justifyContent: 'space-between'
                            }}
                        >
                            <span>{f.id} {f.domain}</span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>{f.title}</span>
                        </button>
                    ))}
                </div>
                <button onClick={onClose} style={{ marginTop: 'auto', padding: '12px', width: '100%', border: '1px solid var(--glass-border)', background: 'transparent', color: 'var(--text-muted)', borderRadius: '8px', cursor: 'pointer' }}>
                    閉じる
                </button>
            </div>

            {/* Main Content */}
            <div style={{ flex: 1, padding: '40px', overflowY: 'auto', background: 'radial-gradient(circle at top right, #1e293b, #0f172a)' }}>

                {editingWorkshop ? (
                    <WorkshopEditor
                        initialData={editingWorkshop}
                        onSave={handleSaveWorkshop}
                        onCancel={() => setEditingWorkshop(null)}
                    />
                ) : (
                    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                        <h2 style={{ fontSize: '2rem', marginBottom: '8px' }}>{selectedFloorId} の講座管理</h2>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '32px' }}>講義やワークショップの追加・編集を行えます。</p>

                        <div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h3 style={{ margin: 0 }}>講座一覧</h3>
                            <button
                                onClick={handleCreateLecture}
                                style={{ padding: '8px 16px', borderRadius: '20px', background: 'var(--floor-4)', color: 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <Plus size={18} /> 新規講座
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '24px' }}>
                            {floorLectures.length === 0 && <p style={{ color: 'var(--text-muted)' }}>まだ講座がありません。</p>}

                            {floorLectures.map(l => (
                                <div key={l.id} className="glass-panel" style={{ padding: '24px', borderRadius: '16px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px' }}>
                                        <h4 style={{ margin: 0, fontSize: '1.2rem' }}>{l.title}</h4>
                                        <button
                                            onClick={() => { setSelectedLecture(l); handleCreateWorkshop(); }}
                                            style={{ background: 'none', border: 'none', color: 'var(--floor-5)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                        >
                                            <Plus size={16} /> ワーク追加
                                        </button>
                                    </div>

                                    <div style={{ display: 'grid', gap: '12px' }}>
                                        {l.workshops.length === 0 && <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>ワークショップがありません</span>}
                                        {l.workshops.map(w => (
                                            <div key={w.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <FileText size={18} color="var(--text-muted)" />
                                                    <div>
                                                        <div style={{ fontWeight: 'bold' }}>{w.title}</div>
                                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{w.questions.length}問</div>
                                                    </div>
                                                </div>
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={() => { setSelectedLecture(l); setEditingWorkshop(w); }}
                                                        style={{ padding: '6px', background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}
                                                    >
                                                        <Edit3 size={18} />
                                                    </button>
                                                    <button
                                                        onClick={() => { setSelectedLecture(l); handleDeleteWorkshop(w.id); }}
                                                        style={{ padding: '6px', background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// Sub-component for editing a single workshop (Google Forms style)
function WorkshopEditor({ initialData, onSave, onCancel }) {
    const [data, setData] = useState(initialData);

    const updateQuestion = (idx, field, value) => {
        const newQuestions = [...data.questions];
        newQuestions[idx] = { ...newQuestions[idx], [field]: value };
        setData({ ...data, questions: newQuestions });
    };

    const addQuestion = () => {
        setData({
            ...data,
            questions: [...data.questions, { id: `q-${Date.now()}`, text: '' }]
        });
    };

    const removeQuestion = (idx) => {
        const newQuestions = data.questions.filter((_, i) => i !== idx);
        setData({ ...data, questions: newQuestions });
    };

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '24px' }}>
                <button onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ArrowLeft /></button>
                <h2 style={{ margin: 0 }}>ワークショップ編集</h2>
                <div style={{ marginLeft: 'auto' }}>
                    <button
                        onClick={() => onSave(data)}
                        style={{ padding: '10px 24px', borderRadius: '24px', background: 'var(--floor-4)', color: 'black', border: 'none', cursor: 'pointer', fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Save size={18} /> 保存して公開
                    </button>
                </div>
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', marginBottom: '24px', borderTop: '8px solid var(--floor-5)' }}>
                <input
                    value={data.title}
                    onChange={e => setData({ ...data, title: e.target.value })}
                    placeholder="ワークショップのタイトル"
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', fontSize: '2rem', color: 'white', padding: '8px 0', marginBottom: '16px' }}
                />
                <textarea
                    value={data.description}
                    onChange={e => setData({ ...data, description: e.target.value })}
                    placeholder="説明文"
                    style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid var(--glass-border)', fontSize: '1rem', color: 'var(--text-muted)', resize: 'none', padding: '8px 0' }}
                />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.questions.map((q, idx) => (
                    <div key={q.id} className="glass-panel" style={{ padding: '24px', borderRadius: '12px', position: 'relative' }}>
                        <div style={{ position: 'absolute', left: '-40px', top: '50%', transform: 'translateY(-50%)', width: '30px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--floor-3)', color: 'black', borderRadius: '50%', fontWeight: 'bold' }}>
                            {idx + 1}
                        </div>
                        <input
                            value={q.text}
                            onChange={e => updateQuestion(idx, 'text', e.target.value)}
                            placeholder="質問内容を入力..."
                            style={{ width: '100%', padding: '16px', borderRadius: '8px', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', color: 'white', fontSize: '1.1rem', marginBottom: '12px' }}
                        />
                        <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid var(--glass-border)' }}>
                            <button
                                onClick={() => removeQuestion(idx)}
                                style={{ padding: '8px', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                                title="削除"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', marginTop: '32px', paddingBottom: '60px' }}>
                <button
                    onClick={addQuestion}
                    style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                >
                    <Plus size={24} />
                </button>
            </div>

        </div>
    );
}
