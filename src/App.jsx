import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import { Layers, Activity, ChevronDown, MapPin, Menu, X, ArrowUpCircle, ArrowDownCircle, Settings, User } from 'lucide-react';
import './index.css';
import { buildings } from './data/buildings';
import { CampusMap } from './components/CampusMap';
import { TransitionOverlay } from './components/TransitionOverlay';
import { SpiralNav } from './components/SpiralNav';
import { Classroom } from './components/Classroom';
import { AdminDashboard } from './components/AdminDashboard';
import { IntroSequence } from './components/IntroSequence';
import { MainBuildingIntro } from './components/MainBuildingIntro';
import { FloorIntro } from './components/FloorIntro';
import { Floor4Intro } from './components/Floor4Intro';
import { Floor5Intro } from './components/Floor5Intro';
import { Floor6Intro } from './components/Floor6Intro';
import { Floor7Intro } from './components/Floor7Intro';
import { useLectures } from './hooks/useLectures';

// Assets
import imgExterior from './assets/exterior.png';
import imgAnnex from './assets/annex_exterior.png';
import imgLab from './assets/lab.png';
import imgStairsSky from './assets/stairs_sky.jpg';
import imgStairsBg from './assets/stairs_bg.png';
import viewLow from './assets/view_low.png'; // 1F
import view2F from './assets/view_2f.png';   // 2F
import viewMid from './assets/view_mid.png'; // 3F
import view4F from './assets/view_4f.png';   // 4F
import viewHigh from './assets/view_high.png'; // 5F
import view6F from './assets/view_6f.png';   // 6F
import viewRoof from './assets/view_roof.png'; // 7F
import imgLibrary from './assets/library_bg.jpg'; // All floors
import imgFloorBgB1 from './assets/floor_bg_B1.png';
import imgFloorBg from './assets/floor_bg2.png'; // 各階背景
import imgFloorBg6F from './assets/floor_bg.png'; // 6F背景
import imgFloor6Reveal from './assets/floor_6f_reveal.png'; // 6F reveal背景
import imgCurtainLeft from './assets/floor_curtain_left.png';
import imgCurtainRight from './assets/floor_curtain_right.png';
import imgFloor7Reveal from './assets/floor_7f_reveal.png'; // 7F reveal背景
import imgDoor7Left from './assets/floor7_door_left.png'; // 7F 本棚ドア（左）
import imgDoor7Right from './assets/floor7_door_right.png'; // 7F 本棚ドア（右）
import imgFloor6Room from './assets/floor_6f_room.png'; // 6F 部屋に入ったあとの背景
import imgFloor7Room from './assets/floor_7f_room.png'; // 7F 部屋に入ったあとの背景（スクロール後）
import imgFloor7RoomEntry from './assets/floor_7f_room_entry.png'; // 7F 部屋に入った直後の背景（スクロール前）
import lobbyMain from './assets/lobby_main.png';
import lobbyAnnex from './assets/lobby_annex.png';

const LoadingScreen = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: '#000' }}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
      style={{ width: 50, height: 50, border: '2px solid rgba(255,255,255,0.1)', borderTopColor: '#81e6d9', borderRadius: '50%' }}
    />
    <p style={{ marginTop: 24, fontSize: 14, color: '#81e6d9', letterSpacing: '0.2em' }}>MIND UNIVERSITY LOADING</p>
  </div>
);

function App() {
  const [loading, setLoading] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [showMainIntro, setShowMainIntro] = useState(false);
  const [showFloorIntro, setShowFloorIntro] = useState(false);
  const [curtainPhase, setCurtainPhase] = useState('idle'); // 'idle' | 'split' | 'open'
  const [sixFRoomEntered, setSixFRoomEntered] = useState(false);
  const [doorPhase7, setDoorPhase7] = useState('idle'); // 'idle' | 'split' | 'darken' | 'open'
  const [sevenFRoomEntered, setSevenFRoomEntered] = useState(false);
  const [showFloorElevator, setShowFloorElevator] = useState(false);
  const [currentBuildingId, setCurrentBuildingId] = useState(null); // Start at Map (null)
  const [currentFloorId, setCurrentFloorId] = useState(null); // null = Hero View
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(false);

  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('door');
  const [transitionTargetFloor, setTransitionTargetFloor] = useState(null);

  // Data Hook
  const { lectures, addLecture, updateLecture, addWorkshop, updateWorkshop, deleteWorkshop } = useLectures();

  // 6F crossfade: 6F に入った瞬間に 0 リセットし、スクロールで追跡。部屋に入ったら最終状態で固定
  const floor6Progress = useMotionValue(0);
  useEffect(() => {
    if (currentFloorId !== '6F' || showFloorIntro) {
      floor6Progress.set(0);
      return;
    }
    if (sixFRoomEntered) {
      floor6Progress.set(1);
      return;
    }
    floor6Progress.set(0);
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      floor6Progress.set(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [currentFloorId, showFloorIntro, sixFRoomEntered]);

  // 7F crossfade: 7F に入った瞬間に 0 リセットし、スクロールで追跡。部屋に入ったら最終状態で固定
  const floor7Progress = useMotionValue(0);
  useEffect(() => {
    if (currentFloorId !== '7F' || showFloorIntro) {
      floor7Progress.set(0);
      return;
    }
    if (sevenFRoomEntered) {
      floor7Progress.set(1);
      return;
    }
    floor7Progress.set(0);
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      floor7Progress.set(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [currentFloorId, showFloorIntro, sevenFRoomEntered]);

  // 7F 部屋の中: 入った直後の背景から、スクロールでじわっと別の背景へクロスフェード
  const room7Progress = useMotionValue(0);
  useEffect(() => {
    if (currentFloorId !== '7F' || !sevenFRoomEntered) {
      room7Progress.set(0);
      return;
    }
    room7Progress.set(0);
    const update = () => {
      const max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      room7Progress.set(Math.min(1, Math.max(0, window.scrollY / max)));
    };
    window.addEventListener('scroll', update, { passive: true });
    update();
    return () => window.removeEventListener('scroll', update);
  }, [currentFloorId, sevenFRoomEntered]);

  // showFloorIntro が再度 true になった（＝その階へ改めて入り直した）タイミングで、
  // 幕/扉の状態を確実に初期化する（同じ階を選び直した場合は currentFloorId が変化しないため）
  useEffect(() => {
    if (currentFloorId !== '6F' || showFloorIntro) {
      setCurtainPhase('idle');
      setSixFRoomEntered(false);
    }
    if (currentFloorId !== '7F' || showFloorIntro) {
      setDoorPhase7('idle');
      setSevenFRoomEntered(false);
    }
  }, [currentFloorId, showFloorIntro]);

  useEffect(() => {
    setShowFloorElevator(false);
  }, [currentFloorId]);

  const handleCurtainOpen = () => {
    setCurtainPhase('split');            // 幕フェードイン
    setTimeout(() => setCurtainPhase('darken'), 950);  // 幕の下を黒に
    setTimeout(() => setCurtainPhase('open'),   1500); // 幕を開く
  };

  const handleDoor7Open = () => {
    setDoorPhase7('split');              // 扉フェードイン
    setTimeout(() => setDoorPhase7('darken'), 950);   // 扉の下を黒に
    setTimeout(() => setDoorPhase7('open'),   1500);  // 扉を開く
  };

  const floor6BaseOpacity = useTransform(floor6Progress, [0.3, 0.7], [0.6, 0]);
  const floor6RevealOpacity = useTransform(floor6Progress, [0.3, 0.7], [0, 0.6]);
  const floor6RevealScale = useTransform(floor6Progress, [0.7, 1.0], [1, 4]);
  const floor6CurtainOpacity = useTransform(floor6Progress, [0.88, 1.0], [0, 1]);
  const floor6NavOpacity = useTransform(floor6Progress, [0, 0.4], [1, 0]);

  const floor7BaseOpacity = useTransform(floor7Progress, [0.3, 0.7], [0.6, 0]);
  const floor7RevealOpacity = useTransform(floor7Progress, [0.3, 0.7], [0, 0.6]);
  const floor7RevealScale = useTransform(floor7Progress, [0.7, 1.0], [1, 2.6]);
  const floor7DoorButtonOpacity = useTransform(floor7Progress, [0.88, 1.0], [0, 1]);
  const floor7NavOpacity = useTransform(floor7Progress, [0, 0.4], [1, 0]);

  const room7EntryOpacity = useTransform(room7Progress, [0.2, 0.85], [0.6, 0]);
  const room7RevealOpacity = useTransform(room7Progress, [0.2, 0.85], [0, 0.6]);
  const room7RevealScale = useTransform(room7Progress, [0.2, 0.85], [1, 1.2]);
  // 見えている間だけクリック可能（透明時はクリックを透過）
  const floor6NavPointer = useTransform(floor6Progress, (p) => (p < 0.3 ? 'auto' : 'none'));
  const floor7NavPointer = useTransform(floor7Progress, (p) => (p < 0.3 ? 'auto' : 'none'));

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Safe fallback for building data
  const safeBuildings = (Array.isArray(buildings) && buildings.length > 0) ? buildings : [{ id: 'main', name: 'Loading...', floors: [], color: '#fff', description: '' }];
  const activeBuilding = safeBuildings.find(b => b.id === currentBuildingId) || safeBuildings[0];
  const activeFloors = Array.isArray(activeBuilding.floors) ? activeBuilding.floors : [];
  const activeFloor = activeFloors.find(f => f.id === currentFloorId);
  const activeFloorIndex = activeFloors.findIndex(f => f.id === currentFloorId);
  
  // エントランス（null）の場合は「1F」として方向を計算する
  const effectiveCurrentFloorId = currentFloorId || '1F';
  const effectiveActiveFloorIndex = activeFloors.findIndex(f => f.id === effectiveCurrentFloorId);

  // Navigation with Transitions
  const performTransition = (type, updateStateFn) => {
    setTransitionType(type);
    setIsTransitioning(true);

    const isDoor = type === 'door';
    const halfTime = isDoor ? 2000 : 3500; // time to swap DOM (middle of stairs or door animation)
    const fullTime = isDoor ? 2500 : 7000; // total duration of overlay for auto-close

    setTimeout(() => {
      updateStateFn();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, halfTime);

    // Only auto-close for doors. Stairs wait for user to click button.
    if (isDoor) {
      setTimeout(() => {
        setIsTransitioning(false);
      }, fullTime);
    }
  };

  const handleOverlayComplete = () => {
    setIsTransitioning(false);
  };

  const handleNextFloor = () => {
    if (activeFloorIndex > 0) {
      const targetId = activeFloors[activeFloorIndex - 1].id;
      setTransitionTargetFloor(targetId);
      performTransition('stairs-up', () => {
        setCurrentFloorId(targetId);
        setShowFloorIntro(true);
      });
    }
  };

  const handlePrevFloor = () => {
    if (activeFloorIndex < activeFloors.length - 1) {
      const targetId = activeFloors[activeFloorIndex + 1].id;
      setTransitionTargetFloor(targetId);
      performTransition('stairs-down', () => {
        setCurrentFloorId(targetId);
        setShowFloorIntro(true);
      });
    }
  };

  const handleEnterFloor = () => {
    const defaultEntrance = activeFloors.find(f => f.id === '1F') || activeFloors[activeFloors.length - 1];
    const targetFloorId = defaultEntrance.id;
    setTransitionTargetFloor(targetFloorId);
    performTransition('stairs-up', () => {
      setCurrentFloorId(targetFloorId);
      setShowFloorIntro(true);
    });
  };

  const handleBackToMap = () => {
    performTransition('door', () => {
      setCurrentBuildingId(null);
      setCurrentFloorId(null);
      setShowMainIntro(false);
    });
  };

  const handleEnterBuilding = (buildingId) => {
    performTransition('door', () => {
      setCurrentBuildingId(buildingId);
      if (buildingId === 'main') {
        setShowMainIntro(true);
      }
    });
  };

  if (loading) return <LoadingScreen />;


  const buildingImages = {
    main: lobbyMain,
    annex: lobbyAnnex
  };

  // Images for Transitions
  const transitionImages = {
    'door': imgExterior, // Entering building
    'stairs-up': imgStairsBg,
    'stairs-down': imgStairsBg
  };

  // Background Logic
  const getBgImage = (fid) => {
    if (!fid) return buildingImages[currentBuildingId] || imgExterior;
    const map = {
      '1F': viewLow,
      '2F': view2F,
      '3F': viewMid,
      '4F': view4F,
      '5F': viewHigh,
      '6F': imgFloorBg,
      '7F': viewRoof,
      '0F': imgLibrary,
      'B1': imgFloorBgB1,
    };
    return map[fid] ?? imgFloorBg;
  };

  if (showIntro) {
    const introImages = [imgExterior, viewRoof, imgStairsSky, viewHigh, imgLab];
    return (
      <IntroSequence
        images={introImages}
        onEnter={() => {
          setShowIntro(false);
          window.scrollTo(0, 0);
        }}
      />
    );
  }

  return (
    <div className="app-container" style={{ position: 'relative', minHeight: '100vh' }}>

      <TransitionOverlay isVisible={isTransitioning} type={transitionType} images={transitionImages} targetFloorId={transitionTargetFloor} onComplete={handleOverlayComplete} />

      {/* Admin Dashboard Overlay */}
      {isAdminMode && (
        <AdminDashboard
          lectures={lectures}
          addLecture={addLecture}
          updateLecture={updateLecture}
          addWorkshop={addWorkshop}
          updateWorkshop={updateWorkshop}
          deleteWorkshop={deleteWorkshop}
          onClose={() => setIsAdminMode(false)}
        />
      )}

      {/* VIEW CONTENT */}
      {showMainIntro && currentBuildingId === 'main' ? (
        <MainBuildingIntro
          onEnter={() => {
            setShowMainIntro(false);
            window.scrollTo(0, 0);
          }}
          floors={activeFloors}
          onSelectFloor={(floorId) => {
            setTransitionTargetFloor(floorId);
            performTransition('stairs-up', () => {
              setShowMainIntro(false);
              setCurrentFloorId(floorId);
              setShowFloorIntro(true);
            });
          }}
        />
      ) : showFloorIntro && activeFloor && activeFloor.id === '7F' ? (
        <Floor7Intro
          onEnter={() => {
            setShowFloorIntro(false);
            window.scrollTo(0, 0);
          }}
        />
      ) : showFloorIntro && activeFloor && activeFloor.id === '6F' ? (
        <Floor6Intro
          onEnter={() => {
            setShowFloorIntro(false);
            window.scrollTo(0, 0);
          }}
        />
      ) : showFloorIntro && activeFloor && activeFloor.id === '5F' ? (
        <Floor5Intro
          onEnter={() => {
            setShowFloorIntro(false);
            window.scrollTo(0, 0);
          }}
        />
      ) : showFloorIntro && activeFloor && activeFloor.id === '4F' ? (
        <Floor4Intro
          onEnter={() => {
            setShowFloorIntro(false);
            window.scrollTo(0, 0);
          }}
        />
      ) : showFloorIntro && activeFloor ? (
        <FloorIntro
          floor={activeFloor}
          onEnter={() => {
            setShowFloorIntro(false);
            window.scrollTo(0, 0);
          }}
        />
      ) : !currentBuildingId ? (
        /* CAMPUS MAP VIEW */
        <CampusMap onSelectBuilding={handleEnterBuilding} />
      ) : (
        /* BUILDING VIEW (Hero or Floor) */
        <>
          {/* Dynamic Background */}
          <div style={{ position: 'fixed', inset: 0, zIndex: -1, transition: 'all 1s ease' }}>
            {/* 部屋に入ったあとは専用の背景に切り替え */}
            {currentFloorId === '6F' && sixFRoomEntered ? (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${imgFloor6Room})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.6,
              }} />
            ) : currentFloorId === '7F' && sevenFRoomEntered ? (
              /* 7F 部屋の中: 入った直後の背景 → スクロールでじわっと別の背景へ */
              <>
                <motion.div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${imgFloor7RoomEntry})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: room7EntryOpacity,
                }} />
                <motion.div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${imgFloor7Room})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: room7RevealOpacity,
                  scale: room7RevealScale,
                  transformOrigin: '50% 50%',
                }} />
              </>
            ) : currentFloorId === '6F' ? (
              /* 6F crossfade: floor_bg2 → floor_6f_reveal */
              <>
                <motion.div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${imgFloorBg})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: floor6BaseOpacity,
                }} />
                <motion.div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${imgFloor6Reveal})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: floor6RevealOpacity,
                  scale: floor6RevealScale,
                  transformOrigin: '50% 42%',
                }} />
              </>
            ) : currentFloorId === '7F' ? (
              /* 7F crossfade: view_roof → floor_7f_reveal */
              <>
                <motion.div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${viewRoof})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: floor7BaseOpacity,
                }} />
                <motion.div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url(${imgFloor7Reveal})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  opacity: floor7RevealOpacity,
                  scale: floor7RevealScale,
                  transformOrigin: '50% 90%',
                }} />
              </>
            ) : (
              <div style={{
                position: 'absolute', inset: 0,
                backgroundImage: `url(${getBgImage(currentFloorId)})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                opacity: 0.6,
                filter: 'blur(0px)',
                transition: 'background-image 1s ease-in-out'
              }} />
            )}
            <div style={{
              position: 'absolute', inset: 0,
              background: activeFloor ? activeFloor.bgCurrent : 'radial-gradient(circle at 50% 50%, rgba(11,16,36,0.5), #0b1024)',
              mixBlendMode: 'overlay',
              transition: 'background 1s ease'
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${imgStairsSky})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: (currentFloorId === '6F' || currentFloorId === '7F') ? 0 : currentFloorId ? 0.1 : 0.05,
              mixBlendMode: 'screen',
              pointerEvents: 'none'
            }} />
          </div>

          {/* 6F カーテン演出 */}
          {currentFloorId === '6F' && (
            <>
              {/* Phase 0: ボタンのみ（スクロール底で表示） */}
              {curtainPhase === 'idle' && (
                <motion.div style={{
                  position: 'fixed', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: floor6CurtainOpacity,
                  zIndex: 16,
                  pointerEvents: 'none',
                }}>
                  <motion.button
                    style={{
                      pointerEvents: 'auto',
                      padding: '16px 48px',
                      borderRadius: '40px',
                      background: 'rgba(255,255,255,0.12)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-jp)',
                      letterSpacing: '0.2em',
                      cursor: 'pointer',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                    }}
                    whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleCurtainOpen}
                  >
                    幕を開ける
                  </motion.button>
                </motion.div>
              )}

              {/* Phase 1-3: 幕フェードイン → 黒 → 開く */}
              {curtainPhase !== 'idle' && (
                <>
                  {/* 幕の下の黒背景（部屋に入ったらフェードアウトして中身を見せる） */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: sixFRoomEntered ? 0 : (curtainPhase === 'darken' || curtainPhase === 'open' ? 1 : 0) }}
                    transition={{ duration: sixFRoomEntered ? 0.8 : 0.5 }}
                    style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 29, pointerEvents: sixFRoomEntered ? 'none' : 'auto' }}
                  />
                  {/* 左幕 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      x: curtainPhase === 'open' ? '-100%' : '0%',
                    }}
                    transition={{
                      opacity: { duration: 0.8 },
                      x: { duration: 2.2, ease: [0.33, 0.0, 0.2, 1.0] },
                    }}
                    style={{
                      position: 'fixed', top: 0, left: 0,
                      width: '50vw', height: '100vh',
                      backgroundImage: `url(${imgCurtainLeft})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'right center',
                      zIndex: 30,
                    }}
                  />
                  {/* 右幕 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      x: curtainPhase === 'open' ? '100%' : '0%',
                    }}
                    transition={{
                      opacity: { duration: 0.8 },
                      x: { duration: 2.2, ease: [0.33, 0.0, 0.2, 1.0] },
                    }}
                    style={{
                      position: 'fixed', top: 0, right: 0,
                      width: '50vw', height: '100vh',
                      backgroundImage: `url(${imgCurtainRight})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'left center',
                      zIndex: 30,
                    }}
                  />
                </>
              )}

              {/* Phase 3: 幕が開いた後、部屋に入るボタンの前にフロア紹介文を表示 */}
              {curtainPhase === 'open' && !sixFRoomEntered && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 2.2 }}
                    style={{
                      position: 'fixed', top: '6vh', left: '5vw', right: '5vw', bottom: '22vh', zIndex: 31,
                      overflowY: 'auto',
                      display: 'flex', justifyContent: 'center',
                    }}
                  >
                    <div style={{
                      maxWidth: '700px', width: '100%',
                      margin: 'auto 0',
                      color: 'white',
                      fontFamily: 'var(--font-jp)',
                      lineHeight: 2.6,
                      textAlign: 'center',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    }}>
                      <h3 style={{ margin: '0 0 20px', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--floor-6)' }}>
                        人が育ち、組織が育ち、未来が育つ。
                      </h3>
                      <p style={{ margin: '0 0 16px' }}>
                        皆さま、ようこそ。<br />
                        マインドデザイン研究所が体系化した「心の階層」、第6フロアへ。
                      </p>
                      <p style={{ margin: '0 0 20px' }}>
                        ここまでのプロセスでは、自分自身を整え、周囲へ良い影響を与える力を育んできました。しかし、この「プロセス6」では、その影響力をさらに広げ、"未来へ残す価値"という新たな視点を育てていきます。この講義では、以下の3つのステップで、未来を創造するリーダーシップを身につけます。
                      </p>

                      <div style={{ marginBottom: '18px' }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>1. 「成果」ではなく「未来」を設計する</p>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)' }}>
                          成果は、その瞬間で終わります。しかし理念や文化は、人から人へ受け継がれ、時代を超えて生き続けます。目の前の結果だけを追いかけるのではなく、「この選択は未来に何を残すのか。」そんな時間軸で物事を捉えることで、リーダーとしての視座は飛躍的に高まります。
                        </p>
                      </div>

                      <div style={{ marginBottom: '18px' }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>2. 人を動かすのではなく、人が育つ環境を創る</p>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)' }}>
                          優れたリーダーは、人を管理しません。人が自ら考え、自ら成長し、自ら挑戦したくなる環境を設計します。一人の能力で組織を動かす時代から、一人ひとりの可能性が自然に開花する組織へ。あなた自身が「人を育てる存在」へと進化していきます。
                        </p>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>3. 未来へ受け継がれる価値を創造する</p>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)' }}>
                          人生は、自分一人で完結するものではありません。あなたの想いは、仲間へ。仲間の想いは、組織へ。組織の価値は、社会へ。そして未来へ。
                        </p>
                      </div>

                      <p style={{ margin: '0 0 16px' }}>
                        プロセス6では、自分の人生を超えて続いていく「価値の循環」を設計し、持続可能な組織と社会を創造するマインドを育てていきます。
                      </p>

                      <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>
                        あなたが今日つくる"在り方"が、未来の誰かの希望になる。<br />
                        組織を育て、人を育て、文化を育てる。
                      </p>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>
                        その循環を生み出すことこそ、真のリーダーシップです。<br />
                        未来へと受け継がれる価値を創造する、マインドプロセス6の扉を開きましょう。
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.2 }}
                    style={{
                      position: 'fixed', bottom: '10vh', left: 0, right: 0,
                      display: 'flex', justifyContent: 'center', zIndex: 31,
                    }}
                  >
                    <motion.button
                      style={{
                        padding: '16px 48px',
                        borderRadius: '40px',
                        background: 'rgba(255,255,255,0.12)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.35)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-jp)',
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                      }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'instant' });
                        setSixFRoomEntered(true);
                      }}
                    >
                      部屋に入る
                    </motion.button>
                  </motion.div>
                </>
              )}
            </>
          )}

          {/* 7F 本棚ドア演出 */}
          {currentFloorId === '7F' && (
            <>
              {/* Phase 0: ボタンのみ（スクロール底で表示） */}
              {doorPhase7 === 'idle' && (
                <motion.div style={{
                  position: 'fixed', inset: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: floor7DoorButtonOpacity,
                  zIndex: 16,
                  pointerEvents: 'none',
                }}>
                  <motion.button
                    style={{
                      pointerEvents: 'auto',
                      padding: '16px 48px',
                      borderRadius: '40px',
                      background: 'rgba(255,255,255,0.12)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.3)',
                      fontSize: '1.1rem',
                      fontFamily: 'var(--font-jp)',
                      letterSpacing: '0.2em',
                      cursor: 'pointer',
                      backdropFilter: 'blur(16px)',
                      WebkitBackdropFilter: 'blur(16px)',
                      boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                    }}
                    whileHover={{ scale: 1.05, background: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.97 }}
                    onClick={handleDoor7Open}
                  >
                    扉を開ける
                  </motion.button>
                </motion.div>
              )}

              {/* Phase 1-3: 扉フェードイン → 黒 → 開く */}
              {doorPhase7 !== 'idle' && (
                <>
                  {/* 扉の下の黒背景（部屋に入ったらフェードアウトして中身を見せる） */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: sevenFRoomEntered ? 0 : (doorPhase7 === 'darken' || doorPhase7 === 'open' ? 1 : 0) }}
                    transition={{ duration: sevenFRoomEntered ? 0.8 : 0.5 }}
                    style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 29, pointerEvents: sevenFRoomEntered ? 'none' : 'auto' }}
                  />
                  {/* 左ドア（本棚） */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      x: doorPhase7 === 'open' ? '-100%' : '0%',
                    }}
                    transition={{
                      opacity: { duration: 0.8 },
                      x: { duration: 2.2, ease: [0.33, 0.0, 0.2, 1.0] },
                    }}
                    style={{
                      position: 'fixed', top: 0, left: 0,
                      width: '50vw', height: '100vh',
                      backgroundImage: `url(${imgDoor7Left})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'right center',
                      zIndex: 30,
                    }}
                  />
                  {/* 右ドア（本棚） */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: 1,
                      x: doorPhase7 === 'open' ? '100%' : '0%',
                    }}
                    transition={{
                      opacity: { duration: 0.8 },
                      x: { duration: 2.2, ease: [0.33, 0.0, 0.2, 1.0] },
                    }}
                    style={{
                      position: 'fixed', top: 0, right: 0,
                      width: '50vw', height: '100vh',
                      backgroundImage: `url(${imgDoor7Right})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'left center',
                      zIndex: 30,
                    }}
                  />
                </>
              )}

              {/* Phase 3: 扉が開いた後、部屋に入るボタンの前にフロア紹介文を表示 */}
              {doorPhase7 === 'open' && !sevenFRoomEntered && (
                <>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 2.2 }}
                    style={{
                      position: 'fixed', top: '6vh', left: '5vw', right: '5vw', bottom: '22vh', zIndex: 31,
                      overflowY: 'auto',
                      display: 'flex', justifyContent: 'center',
                    }}
                  >
                    <div style={{
                      maxWidth: '700px', width: '100%',
                      margin: 'auto 0',
                      color: 'white',
                      fontFamily: 'var(--font-jp)',
                      lineHeight: 2.6,
                      textAlign: 'center',
                      textShadow: '0 2px 8px rgba(0,0,0,0.8)',
                    }}>
                      <h3 style={{ margin: '0 0 20px', fontSize: '1.3rem', fontWeight: 'bold', color: 'var(--floor-7)' }}>
                        潜在意識を最大化し、地球規模の「価値」を創出する
                      </h3>
                      <p style={{ margin: '0 0 16px' }}>
                        皆さま、ようこそ。<br />
                        マインドデザイン研究所が体系化した「心の階層」のゴール、第7フロアへ。
                      </p>
                      <p style={{ margin: '0 0 16px' }}>
                        これまでのプロセスでは、自分のマインドを整え、周囲に影響を与える「技術」を磨いてきました。しかし、この最高階層である「プロセス7」では、これまでの常識を一度手放していただきます。
                      </p>
                      <p style={{ margin: '0 0 20px' }}>
                        この講義では、以下の3つのステップで「心の在り方」を書き換えていきます。
                      </p>

                      <div style={{ marginBottom: '18px' }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>1. 「心の視座」を宇宙の高さまで引き上げる</p>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)' }}>
                          日常の忙しさやストレスという「重力」から離れ、もっとも高い視点から自分を俯瞰（ふかん）してみましょう。時間軸を広げ、宇宙のような大きな視座を持つことで、目先の不安は消え、あなたがこの世に存在する「真の理由」が見えてきます。
                        </p>
                      </div>

                      <div style={{ marginBottom: '18px' }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>2. 究極の自分軸「在（Being）」を体得する</p>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)' }}>
                          「何かをしなければ（Doing）」という執着を捨て、ただ「自分として在る（Being）」ことに集中します。「何もない＝無」の状態は、実はあらゆる可能性が詰まった「満たされている」状態です。言葉や論理を超えた「感じる世界」の感度を高めることで、しなやかで揺るぎない自分軸が完成します。
                        </p>
                      </div>

                      <div style={{ marginBottom: '20px' }}>
                        <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>3. 「共生」によるサステナブルな繁栄</p>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.85)' }}>
                          一人のリーダーがこの高い視座に立つことは、社会に計り知れない価値をもたらします。「自分のため」という枠を超え、「企業が繁栄することで、国が栄え、世界、そして地球全体が良くなる」という循環（共生）を、透明な設計図として描き出します。
                        </p>
                      </div>

                      <p style={{ margin: '0 0 8px', fontWeight: 'bold' }}>
                        あなたの心の変革が、地球の未来を創り出す。
                      </p>
                      <p style={{ margin: 0, fontWeight: 'bold' }}>
                        人類の可能性を解き放つ、究極のメンタルトレーニングを始めましょう。
                      </p>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 2.2 }}
                    style={{
                      position: 'fixed', bottom: '10vh', left: 0, right: 0,
                      display: 'flex', justifyContent: 'center', zIndex: 31,
                    }}
                  >
                    <motion.button
                      style={{
                        padding: '16px 48px',
                        borderRadius: '40px',
                        background: 'rgba(255,255,255,0.12)',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.35)',
                        fontSize: '1.1rem',
                        fontWeight: 'bold',
                        fontFamily: 'var(--font-jp)',
                        letterSpacing: '0.1em',
                        cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 24px rgba(0,0,0,0.2)',
                      }}
                      whileHover={{ scale: 1.05, boxShadow: '0 0 20px rgba(255,255,255,0.3)' }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => {
                        window.scrollTo({ top: 0, behavior: 'instant' });
                        setSevenFRoomEntered(true);
                      }}
                    >
                      部屋に入る
                    </motion.button>
                  </motion.div>
                </>
              )}
            </>
          )}

          <header style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
            <div />

            <div style={{ display: 'flex', gap: '8px', pointerEvents: 'auto' }}>
              {/* Back to Map Button */}
              <div className="glass-panel" style={{ padding: '4px', borderRadius: '30px' }}>
                <button
                  onClick={handleBackToMap}
                  style={{
                    background: 'transparent', border: '1px solid var(--glass-border)',
                    color: 'white', padding: '8px 16px', borderRadius: '20px', cursor: 'pointer',
                    fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px'
                  }}
                >
                  <MapPin size={16} /> Map
                </button>
              </div>

              {/* Admin Toggle Button */}
              <div className="glass-panel" style={{ padding: '8px', borderRadius: '30px' }}>
                <button
                  onClick={() => setIsAdminMode(!isAdminMode)}
                  style={{
                    background: isAdminMode ? 'var(--floor-7)' : 'rgba(255,255,255,0.1)',
                    border: 'none', color: isAdminMode ? 'black' : 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyItems: 'center'
                  }}
                  title="管理モード切り替え"
                >
                  <Settings size={20} />
                </button>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="glass-panel mobile-menu-btn" style={{ padding: '8px', borderRadius: '30px' }}>
                <button
                  onClick={() => setMobileMenuOpen(true)}
                  style={{
                    background: 'rgba(255,255,255,0.1)',
                    border: 'none', color: 'white', padding: '10px', borderRadius: '50%', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyItems: 'center'
                  }}
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </header>

          {/* Mobile Navigation Overlay */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, x: '100%' }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                style={{
                  position: 'fixed', inset: 0, zIndex: 200,
                  background: 'rgba(5, 10, 20, 0.95)', backdropFilter: 'blur(12px)',
                  padding: '0', display: 'flex', flexDirection: 'column'
                }}
              >
                  <SpiralNav floors={activeFloors} onSelectFloor={(id) => {
                    setMobileMenuOpen(false);
                    const targetIndex = activeFloors.findIndex(f => f.id === id);
                    const direction = targetIndex < effectiveActiveFloorIndex ? 'stairs-up' : 'stairs-down';
                    setTransitionTargetFloor(id);
                    performTransition(direction, () => {
                      setCurrentFloorId(id);
                      setShowFloorIntro(true);
                    });
                  }} />
              </motion.div>
            )}
          </AnimatePresence>

          <main style={{ minHeight: '100vh', paddingTop: '100px', paddingBottom: '60px', paddingLeft: '20px', paddingRight: '20px', maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 340px', gap: '40px', alignItems: 'start' }}>

            {/* Left Column: Content */}
            <div>
              <AnimatePresence mode="wait">
                {!currentFloorId ? (
                  /* Hero View */
                  <motion.div
                    key="hero"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginTop: '5vh' }}
                  >
                    <h1 style={{ fontSize: 'clamp(2.5rem, 6vw, 5rem)', lineHeight: 1.1, marginBottom: '24px' }}>
                      {activeBuilding.name}<br /><span className="text-gradient">Entrance</span>
                    </h1>
                    <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', maxWidth: '600px', marginBottom: '40px' }}>
                      {activeBuilding.description}
                    </p>

                    {/* Building Selector (Bottom) - buttons */}
                    <div style={{ marginBottom: '40px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                      <button
                        onClick={handleBackToMap}
                        className="glass-panel"
                        style={{
                          padding: '12px 24px',
                          borderRadius: '40px',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          background: 'rgba(0,0,0,0.3)',
                          border: '1px solid var(--glass-border)',
                          color: 'var(--text-muted)'
                        }}
                      >
                        <MapPin size={16} /> マップへ戻る
                      </button>

                      <button
                        onClick={handleEnterFloor}
                        className="glass-panel"
                        style={{
                          padding: '16px 32px',
                          borderRadius: '40px',
                          color: 'white',
                          fontSize: '1.1rem',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '12px',
                          background: 'rgba(255,255,255,0.12)',
                          border: '1px solid rgba(255,255,255,0.35)',
                          backdropFilter: 'blur(10px)',
                          textShadow: 'none'
                        }}
                      >
                        {activeBuilding.name}に入る <ChevronDown />
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  /* Floor View */
                  <motion.div
                    key={currentFloorId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                      <span style={{ fontSize: '3rem', fontWeight: 'bold', color: activeFloor.color, lineHeight: 1 }}>
                        {activeFloor.id}
                      </span>
                    </div>

                    {/* Enhanced Classroom Component */}
                    {currentFloorId !== 'B1' && <Classroom currentFloorId={currentFloorId} lectures={lectures} sixFRoomEntered={sixFRoomEntered} sevenFRoomEntered={sevenFRoomEntered} />}

                    {/* 7F 部屋の中の背景クロスフェード用に、スクロールできる余地を確保 */}
                    {currentFloorId === '7F' && sevenFRoomEntered && (
                      <div style={{ height: '150vh' }} />
                    )}


                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: エレベーター（Desktop） */}
            <div className="desktop-nav" style={{ display: 'none' }}>
              {/* エレベーターに入るボタン（幕/扉が開いている間は表示しない。部屋に入ったら再表示） */}
              {!showFloorElevator && (curtainPhase === 'idle' || sixFRoomEntered) && (doorPhase7 === 'idle' || sevenFRoomEntered) && (
                <motion.div
                  key={`elev-btn-${currentFloorId ?? 'entrance'}`}
                  style={{
                    position: 'fixed', bottom: '6vh', left: 0, right: 0,
                    display: 'flex', justifyContent: 'center', zIndex: 120,
                    opacity: currentFloorId === '6F' ? (sixFRoomEntered ? 1 : floor6NavOpacity) : currentFloorId === '7F' ? (sevenFRoomEntered ? 1 : floor7NavOpacity) : 1,
                    pointerEvents: currentFloorId === '6F' ? (sixFRoomEntered ? 'auto' : floor6NavPointer) : currentFloorId === '7F' ? (sevenFRoomEntered ? 'auto' : floor7NavPointer) : 'auto',
                  }}>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowFloorElevator(true)}
                    style={{
                      padding: '14px 44px',
                      borderRadius: '40px',
                      background: 'rgba(255,255,255,0.15)',
                      color: '#fff',
                      border: '1px solid rgba(255,255,255,0.4)',
                      fontSize: '1rem',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      backdropFilter: 'blur(8px)',
                      letterSpacing: '0.15em',
                      fontFamily: 'var(--font-jp)',
                    }}
                  >
                    エレベーターに入る
                  </motion.button>
                </motion.div>
              )}

              {/* エレベーターパネル（右からスライドイン） */}
              <AnimatePresence>
                {showFloorElevator && (
                  <motion.div
                    initial={{ x: '100%' }}
                    animate={{ x: '0%' }}
                    exit={{ x: '100%' }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                    style={{
                      position: 'fixed', top: 0, right: 0, bottom: 0,
                      width: 'min(500px, 90vw)', zIndex: 150,
                      background: 'rgba(255,255,255,0.08)',
                      borderLeft: '1px solid rgba(255,255,255,0.2)',
                      backdropFilter: 'blur(24px)',
                      WebkitBackdropFilter: 'blur(24px)',
                      overflow: 'hidden',
                    }}
                  >
                    <SpiralNav floors={activeFloors} onSelectFloor={(id) => {
                      setShowFloorElevator(false);
                      const targetIndex = activeFloors.findIndex(f => f.id === id);
                      const direction = targetIndex < effectiveActiveFloorIndex ? 'stairs-up' : 'stairs-down';
                      setTransitionTargetFloor(id);
                      performTransition(direction, () => {
                        setCurrentFloorId(id);
                        setShowFloorIntro(true);
                      });
                    }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <style>{`
          @media (min-width: 900px) {
            .desktop-nav { display: block !important; }
            .mobile-menu-btn { display: none !important; }
          }
          @media (max-width: 899px) {
             main { grid-template-columns: 1fr !important; }
             .desktop-nav { display: none !important; }
          }
        `}</style>
          </main>
        </>
      )}
    </div>
  );
}

export default App;
