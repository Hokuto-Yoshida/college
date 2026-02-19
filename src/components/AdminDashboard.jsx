
import React, { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Edit3, ArrowLeft, Link as LinkIcon, ExternalLink, FileText, X } from 'lucide-react';
import { buildings } from '../data/buildings';

export function AdminDashboard({ lectures, addLecture, updateLecture, addWorkshop, updateWorkshop, deleteWorkshop, onClose }) {
    const [selectedBuildingId, setSelectedBuildingId] = useState('main');
    const [selectedFloorId, setSelectedFloorId] = useState('1F');
    const [editingLecture, setEditingLecture] = useState(null); // Lecture object to edit
    const [editingWorkshop, setEditingWorkshop] = useState(null); // Workshop object to edit
    const [selectedLectureForWorkshop, setSelectedLectureForWorkshop] = useState(null); // Parent lecture for workshop editing

    // Ensure we have a valid building/floor selection
    const currentBuilding = buildings.find(b => b.id === selectedBuildingId) || buildings[0];
    const currentFloors = currentBuilding.floors || [];

    // Filter lectures for current view
    const filteredLectures = lectures.filter(l =>
        l.floorId === selectedFloorId &&
        (l.buildingId === selectedBuildingId || (!l.buildingId && selectedBuildingId === 'main'))
    );

    // --- Handlers ---

    const handleCreateLecture = () => {
        const title = prompt('新しい講座のタイトルを入力してください:');
        if (!title) return;
        addLecture(selectedBuildingId, selectedFloorId, title);
    };

    const handleSaveLecture = (updatedLecture) => {
        if (!updatedLecture || !updatedLecture.id) return;
        updateLecture(updatedLecture.id, updatedLecture);
        setEditingLecture(null);
    };

    const handleCreateWorkshop = (lecture) => {
        const newWorkshop = {
            title: '新規ワークショップ',
            description: '',
            questions: [{ id: `q-${Date.now()}`, text: '' }]
        };
        setSelectedLectureForWorkshop(lecture);
        setEditingWorkshop({ ...newWorkshop, isNew: true });
    };

    const handleEditWorkshop = (lecture, workshop) => {
        setSelectedLectureForWorkshop(lecture);
        setEditingWorkshop({ ...workshop, isNew: false });
    };

    const handleSaveWorkshop = (workshopData) => {
        if (!selectedLectureForWorkshop) return;

        if (workshopData.isNew) {
            const { isNew, ...rest } = workshopData;
            addWorkshop(selectedLectureForWorkshop.id, rest);
        } else {
            updateWorkshop(selectedLectureForWorkshop.id, workshopData);
        }
        setEditingWorkshop(null);
        setSelectedLectureForWorkshop(null);
    };

    const handleDeleteWorkshop = (lectureId, workshopId) => {
        if (window.confirm('このワークショップを削除しますか？')) {
            deleteWorkshop(lectureId, workshopId);
        }
    };

    // --- Responsive Check ---
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // --- Render ---

    return (
        <div style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'var(--bg-deep)', display: 'flex', flexDirection: isMobile ? 'column' : 'row', color: 'white' }}>

            {/* Sidebar / Topbar */}
            <div style={{
                width: isMobile ? '100%' : '260px',
                height: isMobile ? 'auto' : '100%',
                borderRight: isMobile ? 'none' : '1px solid rgba(255,255,255,0.1)',
                borderBottom: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                flexShrink: 0,
                background: isMobile ? 'rgba(5, 10, 20, 0.95)' : 'transparent'
            }}>
                <div style={{ padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: isMobile ? 'none' : '1px solid rgba(255,255,255,0.1)' }}>
                    <h3 style={{ margin: 0, fontSize: '1.1rem' }}>管理画面</h3>
                    {isMobile && <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#ccc' }}><X size={24} /></button>}
                </div>

                <div style={{ padding: '0 16px 16px 16px' }}>
                    {/* Building Tabs */}
                    <div style={{ display: 'flex', gap: '4px', background: 'rgba(0,0,0,0.3)', padding: '4px', borderRadius: '8px', overflowX: 'auto' }}>
                        {buildings.map(b => (
                            <button
                                key={b.id}
                                type="button"
                                onClick={() => {
                                    setSelectedBuildingId(b.id);
                                    setSelectedFloorId(b.floors[0]?.id || '1F');
                                    setEditingLecture(null);
                                    setEditingWorkshop(null);
                                }}
                                style={{
                                    flex: 1,
                                    padding: '6px 4px',
                                    borderRadius: '6px',
                                    border: 'none',
                                    background: selectedBuildingId === b.id ? 'var(--floor-4, #4facfe)' : 'transparent',
                                    color: selectedBuildingId === b.id ? 'black' : '#888',
                                    fontWeight: 'bold',
                                    fontSize: '0.75rem',
                                    cursor: 'pointer',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                {b.name.split(' ')[0]}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Floor Selection - Horizontal scroll on mobile, Vertical list on desktop */}
                <div style={{
                    flex: isMobile ? 'none' : 1,
                    overflowY: isMobile ? 'hidden' : 'auto',
                    overflowX: isMobile ? 'auto' : 'hidden',
                    padding: '0 16px 16px 16px',
                    display: 'flex',
                    flexDirection: isMobile ? 'row' : 'column',
                    gap: isMobile ? '8px' : '0'
                }}>
                    {!isMobile && <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '8px', paddingLeft: '10px' }}>
                        {currentBuilding.name} フロア
                    </div>}

                    {currentFloors.map(f => (
                        <button
                            key={f.id}
                            type="button"
                            onClick={() => {
                                setSelectedFloorId(f.id);
                                setEditingLecture(null);
                                setEditingWorkshop(null);
                            }}
                            style={{
                                display: 'block',
                                width: isMobile ? 'auto' : '100%',
                                minWidth: isMobile ? '60px' : 'auto',
                                textAlign: isMobile ? 'center' : 'left',
                                padding: '10px 16px',
                                marginBottom: isMobile ? '0' : '4px',
                                borderRadius: '8px',
                                background: selectedFloorId === f.id ? 'rgba(255,255,255,0.1)' : 'transparent',
                                color: selectedFloorId === f.id ? 'white' : '#888',
                                border: isMobile ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                whiteSpace: 'nowrap'
                            }}
                        >
                            <span style={{ fontWeight: 'bold' }}>{f.id}</span>
                            {!isMobile && <span style={{ fontSize: '0.8rem', marginLeft: '8px', opacity: 0.7 }}>{f.domain}</span>}
                        </button>
                    ))}
                </div>

                {!isMobile && <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <button
                        type="button"
                        onClick={onClose}
                        style={{ width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.2)', background: 'transparent', color: '#ccc', cursor: 'pointer' }}
                    >
                        閉じる
                    </button>
                </div>}
            </div>

            {/* Main Area */}
            <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '20px' : '40px', background: 'radial-gradient(circle at top right, #1e293b, #0f172a)' }}>

                {editingLecture ? (
                    <LectureEditor
                        lecture={editingLecture}
                        onSave={handleSaveLecture}
                        onCancel={() => setEditingLecture(null)}
                    />
                ) : editingWorkshop ? (
                    <WorkshopEditor
                        workshop={editingWorkshop}
                        onSave={handleSaveWorkshop}
                        onCancel={() => setEditingWorkshop(null)}
                    />
                ) : (
                    // List View
                    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
                            <div>
                                <h2 style={{ margin: 0, fontSize: '2rem' }}>{selectedFloorId} 講座一覧</h2>
                                <p style={{ color: '#888', marginTop: '8px' }}>{currentBuilding.name}</p>
                            </div>
                            <button
                                type="button"
                                onClick={handleCreateLecture}
                                style={{
                                    display: 'flex', alignItems: 'center', gap: '8px',
                                    padding: '10px 24px', borderRadius: '24px',
                                    background: 'var(--floor-4, #4facfe)', color: 'black',
                                    border: 'none', fontWeight: 'bold', cursor: 'pointer',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                                }}
                            >
                                <Plus size={20} /> 新規講座
                            </button>
                        </div>

                        <div style={{ display: 'grid', gap: '24px' }}>
                            {filteredLectures.length === 0 && (
                                <div style={{ padding: '40px', textAlign: 'center', color: '#666', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '16px' }}>
                                    講座が登録されていません
                                </div>
                            )}

                            {filteredLectures.map(lecture => (
                                <LectureItem
                                    key={lecture.id}
                                    lecture={lecture}
                                    onEdit={() => setEditingLecture(lecture)}
                                    onAddWorkshop={() => handleCreateWorkshop(lecture)}
                                    onEditWorkshop={(w) => handleEditWorkshop(lecture, w)}
                                    onDeleteWorkshop={(wId) => handleDeleteWorkshop(lecture.id, wId)}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// --- Sub Components ---

function LectureItem({ lecture, onEdit, onAddWorkshop, onEditWorkshop, onDeleteWorkshop }) {
    return (
        <div className="glass-panel" style={{ padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                    <h3 style={{ margin: '0 0 8px 0', fontSize: '1.4rem' }}>{lecture.title}</h3>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                        {lecture.links && lecture.links.map((link, i) => (
                            <a key={i} href={link.url} target="_blank" rel="noreferrer" style={{ fontSize: '0.85rem', color: 'var(--floor-3, #a0ced9)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                                <LinkIcon size={12} /> {link.title}
                            </a>
                        ))}
                    </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={onEdit} style={{ padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <Edit3 size={16} /> 編集
                    </button>
                </div>
            </div>

            <div style={{ padding: '16px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#888' }}>ワークショップ ({lecture.workshops.length})</h4>
                    <button type="button" onClick={onAddWorkshop} style={{ padding: '4px 8px', fontSize: '0.8rem', background: 'transparent', color: 'var(--floor-5, #888)', border: '1px solid var(--floor-5, #555)', borderRadius: '4px', cursor: 'pointer' }}>
                        + 追加
                    </button>
                </div>
                {lecture.workshops.length === 0 && <p style={{ fontSize: '0.9rem', color: '#666', textAlign: 'center', padding: '10px' }}>ワークショップはありません</p>}
                <div style={{ display: 'grid', gap: '8px' }}>
                    {lecture.workshops.map(w => (
                        <div key={w.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <FileText size={16} color="#888" />
                                <span>{w.title}</span>
                            </div>
                            <div style={{ display: 'flex', gap: '4px' }}>
                                <button type="button" onClick={() => onEditWorkshop(w)} style={{ padding: '6px', background: 'transparent', border: 'none', color: '#ccc', cursor: 'pointer' }}><Edit3 size={16} /></button>
                                <button type="button" onClick={() => onDeleteWorkshop(w.id)} style={{ padding: '6px', background: 'transparent', border: 'none', color: '#ff6b6b', cursor: 'pointer' }}><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

// Sub-component for editing Lecture (Title & Links)
function LectureEditor({ lecture, onSave, onCancel }) {
    const [title, setTitle] = useState(lecture.title);
    // Initialize links with at least one empty slot if empty, or just the existing links
    const [links, setLinks] = useState(Array.isArray(lecture.links) ? lecture.links : []);

    const handleChangeLink = (idx, field, value) => {
        const newLinks = [...links];
        newLinks[idx] = { ...newLinks[idx], [field]: value };
        setLinks(newLinks);
    };

    const addLinkSlot = () => {
        setLinks([...links, { title: '', url: '' }]);
    };

    const removeLinkSlot = (idx) => {
        setLinks(links.filter((_, i) => i !== idx));
    };

    const handleSave = () => {
        // Filter out empty links before saving
        const validLinks = links.filter(l => l.title.trim() || l.url.trim());

        console.log('Saving lecture:', { ...lecture, title, links: validLinks });

        onSave({
            ...lecture,
            title,
            links: validLinks
        });
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ArrowLeft /></button>
                <h2 style={{ margin: 0 }}>講座の編集</h2>
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ marginBottom: '24px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#888' }}>講座タイトル</label>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ width: '100%', padding: '12px', fontSize: '1.2rem', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' }}
                    />
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', color: '#ccc' }}>
                        <LinkIcon size={18} /> 関連リンク
                    </h4>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {links.map((link, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        value={link.title}
                                        onChange={(e) => handleChangeLink(idx, 'title', e.target.value)}
                                        placeholder="リンクタイトル"
                                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <input
                                        value={link.url}
                                        onChange={(e) => handleChangeLink(idx, 'url', e.target.value)}
                                        placeholder="https://..."
                                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeLinkSlot(idx)}
                                    style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', border: 'none', borderRadius: '6px', color: '#ff6b6b', cursor: 'pointer' }}
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addLinkSlot}
                        style={{ marginTop: '16px', background: 'none', border: '1px dashed #666', color: '#aaa', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem' }}
                    >
                        <Plus size={14} /> リンクを追加
                    </button>
                </div>

                <div style={{ textAlign: 'right' }}>
                    <button
                        type="button"
                        onClick={handleSave}
                        style={{ padding: '12px 32px', borderRadius: '24px', background: 'var(--floor-4, #4facfe)', color: 'black', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                    >
                        <Save size={18} /> 保存する
                    </button>
                </div>
            </div>
        </div>
    );
}

function WorkshopEditor({ workshop, onSave, onCancel }) {
    const [data, setData] = useState({ ...workshop });

    const updateQuestion = (idx, val) => {
        const newQ = [...data.questions];
        newQ[idx].text = val;
        setData({ ...data, questions: newQ });
    };

    const addQuestion = () => {
        setData({ ...data, questions: [...data.questions, { id: `q - ${Date.now()} `, text: '' }] });
    };

    const removeQuestion = (idx) => {
        setData({ ...data, questions: data.questions.filter((_, i) => i !== idx) });
    };

    return (
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '32px' }}>
                <button type="button" onClick={onCancel} style={{ background: 'none', border: 'none', color: 'white', cursor: 'pointer' }}><ArrowLeft /></button>
                <h2 style={{ margin: 0 }}>ワークショップ編集</h2>
            </div>

            <div className="glass-panel" style={{ padding: '32px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', borderTop: '4px solid var(--floor-5, #ccc)' }}>
                <input
                    value={data.title}
                    onChange={(e) => setData({ ...data, title: e.target.value })}
                    placeholder="ワークショップタイトル"
                    style={{ display: 'block', width: '100%', padding: '10px 0', fontSize: '1.8rem', background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.2)', color: 'white', marginBottom: '16px' }}
                />
                <textarea
                    value={data.description}
                    onChange={(e) => setData({ ...data, description: e.target.value })}
                    placeholder="説明文..."
                    style={{ width: '100%', background: 'transparent', border: 'none', color: '#ccc', resize: 'none', outline: 'none' }}
                />
            </div>

            <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {data.questions.map((q, i) => (
                    <div key={q.id} style={{ padding: '24px', background: 'rgba(0,0,0,0.2)', borderRadius: '12px', display: 'flex', gap: '16px' }}>
                        <span style={{ color: 'var(--floor-3, #a0ced9)', fontWeight: 'bold' }}>Q{i + 1}</span>
                        <input
                            value={q.text}
                            onChange={(e) => updateQuestion(i, e.target.value)}
                            placeholder="質問内容"
                            style={{ flex: 1, background: 'transparent', border: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '1.1rem' }}
                        />
                        <button type="button" onClick={() => removeQuestion(i)} style={{ background: 'none', border: 'none', color: '#666', cursor: 'pointer' }}><Trash2 size={16} /></button>
                    </div>
                ))}
            </div>

            <div style={{ textAlign: 'center', margin: '32px 0' }}>
                <button type="button" onClick={addQuestion} style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', cursor: 'pointer' }}><Plus /></button>
            </div>

            <div style={{ textAlign: 'right', paddingBottom: '60px' }}>
                <button type="button" onClick={() => onSave(data)} style={{ padding: '12px 32px', borderRadius: '24px', background: 'var(--floor-4, #4facfe)', color: 'black', border: 'none', fontSize: '1rem', fontWeight: 'bold', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <Save size={18} /> 保存して完了
                </button>
            </div>
        </div>
    );
}

