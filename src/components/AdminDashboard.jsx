
import React, { useState, useEffect, useMemo } from 'react';
import { Plus, Save, Trash2, Edit3, ArrowLeft, Link as LinkIcon, ExternalLink, FileText, X, Upload, BookOpen, ArrowUp, ArrowDown } from 'lucide-react';
import { buildings } from '../data/buildings';

export function AdminDashboard({ lectures, addLecture, updateLecture, addWorkshop, updateWorkshop, deleteWorkshop, floor0Books, onClose }) {
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
                ) : (selectedBuildingId === 'main' && selectedFloorId === '0F') ? (
                    // 0F: 講座ではなく「本（PDF）」の管理パネル
                    <Floor0BooksPanel floor0Books={floor0Books} />
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

// 0F: 「本」（表紙）と、その中の「章」（PDF）を管理するパネル
// 本棚ではまず本の表紙が並び、表紙をクリックするとその本の章が並ぶ
function Floor0BooksPanel({ floor0Books }) {
    const {
        rawBooks = [], series = [],
        uploadBook, deleteBook, reorderBooks, assignChapter,
        createSeries, updateSeries, deleteSeries, reorderSeries,
    } = floor0Books || {};
    const [message, setMessage] = useState('');
    const [busy, setBusy] = useState(false);

    // 処理中は他の操作を止め、失敗したらメッセージを出す
    const run = async (task, successMessage = '') => {
        if (busy) return false;
        setBusy(true);
        setMessage('');
        try {
            await task();
            if (successMessage) setMessage(successMessage);
            return true;
        } catch (e) {
            console.error(e);
            setMessage(e.message || '処理に失敗しました');
            return false;
        } finally {
            setBusy(false);
        }
    };

    // 本を追加
    const [newSeriesTitle, setNewSeriesTitle] = useState('');
    const [newSeriesCover, setNewSeriesCover] = useState(null);
    const [seriesInputKey, setSeriesInputKey] = useState(0);
    const handleCreateSeries = async () => {
        if (!newSeriesTitle.trim()) {
            setMessage('本のタイトルを入力してください');
            return;
        }
        const ok = await run(() => createSeries(newSeriesTitle.trim(), newSeriesCover), '本を追加しました。');
        if (ok) {
            setNewSeriesTitle('');
            setNewSeriesCover(null);
            setSeriesInputKey((k) => k + 1);
        }
    };

    // 章（PDF）を追加
    const [selectedFile, setSelectedFile] = useState(null);
    const [titleInput, setTitleInput] = useState('');
    const [uploadSeriesId, setUploadSeriesId] = useState('');
    const [fileInputKey, setFileInputKey] = useState(0);
    const handleFileChange = (e) => {
        const file = e.target.files && e.target.files[0];
        if (!file) return;
        if (file.type !== 'application/pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
            setMessage('PDFファイルを選択してください');
            return;
        }
        setSelectedFile(file);
        setMessage('');
    };
    const handleUpload = async () => {
        if (!selectedFile) {
            setMessage('先にPDFファイルを選択してください');
            return;
        }
        const ok = await run(() => uploadBook(selectedFile, titleInput, uploadSeriesId), 'アップロードしました。0階の本棚に追加されます。');
        if (ok) {
            setSelectedFile(null);
            setTitleInput('');
            setFileInputKey((k) => k + 1); // ファイル入力欄の表示をリセット
        }
    };

    // リストの中で1つ上/下へ動かした id の並びを返す
    const moved = (items, index, delta) => {
        const ids = items.map((x) => x.id);
        [ids[index], ids[index + delta]] = [ids[index + delta], ids[index]];
        return ids;
    };

    const seriesIds = new Set(series.map((s) => s.id));
    const chapterCount = (seriesId) => rawBooks.filter((b) => b.seriesId === seriesId).length;

    const panelStyle = { padding: '24px', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '24px' };
    const rowStyle = { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', gap: '12px' };
    const inputStyle = { width: '100%', padding: '12px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: 'white' };
    const labelStyle = { display: 'block', marginBottom: '8px', color: '#888' };
    const primaryButtonStyle = {
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '12px 32px', borderRadius: '24px',
        background: busy ? '#555' : 'var(--floor-4, #4facfe)', color: 'black',
        border: 'none', fontWeight: 'bold', cursor: busy ? 'default' : 'pointer'
    };
    const smallButtonStyle = { flexShrink: 0, display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: busy ? 'default' : 'pointer', fontSize: '0.85rem' };
    const deleteButtonStyle = { ...smallButtonStyle, background: 'rgba(255,107,107,0.1)', color: '#ff6b6b' };

    return (
        <div style={{ maxWidth: '760px', margin: '0 auto' }}>
            <div style={{ marginBottom: '32px' }}>
                <h2 style={{ margin: 0, fontSize: '2rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <BookOpen size={28} /> 0階の本棚（PDF）
                </h2>
                <p style={{ color: '#888', marginTop: '8px' }}>
                    本棚にはまず「本」の表紙が並び、表紙を選ぶとその本の「章」（PDF）が並びます。<br />
                    先に本（タイトル・表紙）を作り、PDFは章としてどの本に入れるかを選んでアップロードしてください。
                </p>
                {message && <div style={{ marginTop: '12px', fontSize: '0.9rem', color: '#9ae6b4' }}>{message}</div>}
            </div>

            {/* 本（表紙）の一覧 */}
            <div className="glass-panel" style={panelStyle}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '12px' }}>
                    本（{series.length}冊）※ 矢印で本棚に並ぶ順番を変更できます
                </div>
                {series.length === 0 ? (
                    <div style={{ color: '#ccc' }}>まだ本がありません。下の「本を追加する」から作成してください。</div>
                ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {series.map((s, i) => (
                            <SeriesRow
                                key={s.id}
                                series={s}
                                chapterCount={chapterCount(s.id)}
                                busy={busy}
                                rowStyle={rowStyle}
                                inputStyle={inputStyle}
                                smallButtonStyle={smallButtonStyle}
                                deleteButtonStyle={deleteButtonStyle}
                                moveButtons={<MoveButtons index={i} length={series.length} busy={busy} onMove={(d) => run(() => reorderSeries(moved(series, i, d)))} />}
                                onRename={(title) => run(() => updateSeries(s.id, { title }), 'タイトルを変更しました。')}
                                onChangeCover={(file) => run(() => updateSeries(s.id, { coverFile: file }), '表紙を変更しました。')}
                                onRemoveCover={() => run(() => updateSeries(s.id, { removeCover: true }), '表紙を外しました。')}
                                onDelete={() => {
                                    if (!window.confirm(`本「${s.title}」を削除しますか？\n（中の章（PDF）は削除されず「未分類」に移ります）`)) return;
                                    run(() => deleteSeries(s.id), '本を削除しました。');
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* 本を追加 */}
            <div className="glass-panel" style={{ ...panelStyle, padding: '32px' }}>
                <h4 style={{ margin: '0 0 20px', color: '#ccc' }}>本を追加する</h4>
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>本のタイトル</label>
                    <input value={newSeriesTitle} onChange={(e) => setNewSeriesTitle(e.target.value)} placeholder="例: マインドの法則" style={inputStyle} />
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>表紙の画像（任意・あとから変更できます）</label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        <CoverThumb file={newSeriesCover} />
                        <input
                            key={seriesInputKey}
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewSeriesCover((e.target.files && e.target.files[0]) || null)}
                            style={{ ...inputStyle, padding: '10px' }}
                        />
                    </div>
                </div>
                <button type="button" onClick={handleCreateSeries} disabled={busy} style={primaryButtonStyle}>
                    <Plus size={18} /> 本を追加
                </button>
            </div>

            {/* 章（PDF）の一覧 */}
            <div className="glass-panel" style={panelStyle}>
                <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '12px' }}>
                    章（PDF・{rawBooks.length}件）※ 右のプルダウンでどの本の章かを変更できます。矢印で本の中の章の順番を変更できます
                </div>
                {rawBooks.length === 0 ? (
                    <div style={{ color: '#ccc' }}>まだ章が登録されていません。現在はデフォルトのサンプルPDFが1冊表示されています。</div>
                ) : (
                    <div style={{ display: 'grid', gap: '10px' }}>
                        {rawBooks.map((b, i) => (
                            <div key={b.id} style={rowStyle}>
                                <MoveButtons index={i} length={rawBooks.length} busy={busy} onMove={(d) => run(() => reorderBooks(moved(rawBooks, i, d)))} />
                                <div style={{ minWidth: 0, flex: 1 }}>
                                    <div style={{ color: 'white', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.title}</div>
                                    <div style={{ color: '#888', fontSize: '0.8rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{b.name}</div>
                                </div>
                                <select
                                    value={b.seriesId && seriesIds.has(b.seriesId) ? b.seriesId : ''}
                                    onChange={(e) => run(() => assignChapter(b.id, e.target.value))}
                                    disabled={busy}
                                    style={{ flexShrink: 0, maxWidth: '180px', padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', color: 'white' }}
                                >
                                    <option value="">未分類</option>
                                    {series.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                                </select>
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!window.confirm(`「${b.title}」を削除しますか？`)) return;
                                        run(() => deleteBook(b.id));
                                    }}
                                    disabled={busy}
                                    style={deleteButtonStyle}
                                >
                                    <Trash2 size={14} /> 削除
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 章を追加 */}
            <div className="glass-panel" style={{ ...panelStyle, padding: '32px' }}>
                <h4 style={{ margin: '0 0 20px', color: '#ccc' }}>章（PDF）を追加する</h4>
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>どの本の章か</label>
                    <select value={uploadSeriesId} onChange={(e) => setUploadSeriesId(e.target.value)} style={inputStyle}>
                        <option value="">未分類</option>
                        {series.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                    </select>
                </div>
                <div style={{ marginBottom: '20px' }}>
                    <label style={labelStyle}>PDFファイル</label>
                    <input
                        key={fileInputKey}
                        type="file"
                        accept="application/pdf,.pdf"
                        onChange={handleFileChange}
                        style={{ ...inputStyle, padding: '10px' }}
                    />
                    {selectedFile && (
                        <div style={{ marginTop: '8px', fontSize: '0.85rem', color: '#aaa' }}>
                            選択中: {selectedFile.name}
                        </div>
                    )}
                </div>
                <div style={{ marginBottom: '24px' }}>
                    <label style={labelStyle}>章のタイトル（任意）</label>
                    <input
                        value={titleInput}
                        onChange={(e) => setTitleInput(e.target.value)}
                        placeholder="未入力の場合はファイル名を使用します（例: 第1章 心の視点）"
                        style={inputStyle}
                    />
                </div>
                <button type="button" onClick={handleUpload} disabled={busy} style={primaryButtonStyle}>
                    <Upload size={18} /> {busy ? '処理中…' : '章を追加'}
                </button>
            </div>
        </div>
    );
}

// 上へ/下へボタン
function MoveButtons({ index, length, busy, onMove }) {
    return (
        <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[[-1, <ArrowUp size={14} />, '上へ'], [1, <ArrowDown size={14} />, '下へ']].map(([delta, icon, label]) => {
                const disabled = busy || index + delta < 0 || index + delta >= length;
                return (
                    <button
                        key={delta}
                        type="button"
                        onClick={() => onMove(delta)}
                        disabled={disabled}
                        title={label}
                        style={{ display: 'flex', padding: '4px 8px', borderRadius: '6px', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', cursor: disabled ? 'default' : 'pointer', opacity: disabled ? 0.3 : 1 }}
                    >
                        {icon}
                    </button>
                );
            })}
        </div>
    );
}

// 表紙のサムネイル。url（保存済みの表紙）か file（選択中の画像）を表示する
function CoverThumb({ url, file }) {
    const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
    useEffect(() => () => {
        if (previewUrl) URL.revokeObjectURL(previewUrl);
    }, [previewUrl]);
    const src = previewUrl || url;
    return (
        <div style={{
            flexShrink: 0, width: '54px', aspectRatio: '3 / 4', borderRadius: '4px',
            border: '1px solid rgba(212,175,55,0.4)',
            background: src ? `center / cover no-repeat url(${src})` : 'linear-gradient(160deg, #223324 0%, #10190f 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
            {!src && <BookOpen size={18} color="#d4af37" />}
        </div>
    );
}

// 本（表紙）1冊分の行。タイトルの変更・表紙の変更/削除・本の削除ができる
function SeriesRow({ series, chapterCount, busy, rowStyle, inputStyle, smallButtonStyle, deleteButtonStyle, moveButtons, onRename, onChangeCover, onRemoveCover, onDelete }) {
    const [isEditing, setIsEditing] = useState(false);
    const [title, setTitle] = useState(series.title);
    const [coverInputKey, setCoverInputKey] = useState(0);

    const saveTitle = async () => {
        if (!title.trim() || title.trim() === series.title) {
            setIsEditing(false);
            return;
        }
        if (await onRename(title.trim())) setIsEditing(false);
    };

    return (
        <div style={{ ...rowStyle, flexWrap: 'wrap' }}>
            {moveButtons}
            <CoverThumb url={series.coverUrl} />
            <div style={{ minWidth: '140px', flex: 1 }}>
                {isEditing ? (
                    <div style={{ display: 'flex', gap: '6px' }}>
                        <input value={title} onChange={(e) => setTitle(e.target.value)} style={{ ...inputStyle, padding: '8px' }} autoFocus />
                        <button type="button" onClick={saveTitle} disabled={busy} style={smallButtonStyle}><Save size={14} /></button>
                        <button type="button" onClick={() => { setTitle(series.title); setIsEditing(false); }} style={smallButtonStyle}><X size={14} /></button>
                    </div>
                ) : (
                    <>
                        <div style={{ color: 'white', fontWeight: 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{series.title}</div>
                        <div style={{ color: '#888', fontSize: '0.8rem' }}>
                            全{chapterCount}章{chapterCount === 0 ? '（章がない本は本棚に表示されません）' : ''}
                        </div>
                    </>
                )}
            </div>
            {!isEditing && (
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <button type="button" onClick={() => setIsEditing(true)} disabled={busy} style={smallButtonStyle}><Edit3 size={14} /> 名前</button>
                    <label style={{ ...smallButtonStyle, opacity: busy ? 0.5 : 1 }}>
                        <Upload size={14} /> 表紙
                        <input
                            key={coverInputKey}
                            type="file"
                            accept="image/*"
                            disabled={busy}
                            onChange={(e) => {
                                const file = e.target.files && e.target.files[0];
                                if (file) onChangeCover(file);
                                setCoverInputKey((k) => k + 1);
                            }}
                            style={{ display: 'none' }}
                        />
                    </label>
                    {series.coverUrl && (
                        <button type="button" onClick={onRemoveCover} disabled={busy} style={smallButtonStyle}><X size={14} /> 表紙を外す</button>
                    )}
                    <button type="button" onClick={onDelete} disabled={busy} style={deleteButtonStyle}><Trash2 size={14} /> 削除</button>
                </div>
            )}
        </div>
    );
}

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
                    <div style={{ marginBottom: '16px' }}>
                        <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '0 0 8px 0', color: '#ccc' }}>
                            <LinkIcon size={18} /> 関連リンク
                        </h4>
                        <p style={{ margin: 0, fontSize: '0.8rem', color: '#888' }}>
                            ※「録画(シネマ)」で直接再生可能なURL: YouTube, Vimeo, MP4直接リンク (.mp4)<br />
                            ※Zoom録画などを指定した場合は、別タブで開くボタンが表示されます。
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {links.map((link, idx) => (
                            <div key={idx} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                                <div style={{ flex: 1 }}>
                                    <input
                                        value={link.title}
                                        onChange={(e) => handleChangeLink(idx, 'title', e.target.value)}
                                        placeholder="リンクタイトル (例: 第1回講義録画)"
                                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                                <div style={{ flex: 2 }}>
                                    <input
                                        value={link.url}
                                        onChange={(e) => handleChangeLink(idx, 'url', e.target.value)}
                                        placeholder="URL (https://...)"
                                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <select
                                        value={link.type || 'recorded'}
                                        onChange={(e) => handleChangeLink(idx, 'type', e.target.value)}
                                        style={{ width: '100%', padding: '10px', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', cursor: 'pointer' }}
                                    >
                                        <option value="recorded" style={{ color: 'black' }}>録画 (シネマ)</option>
                                        <option value="realtime" style={{ color: 'black' }}>リアルタイム (教室)</option>
                                    </select>
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

