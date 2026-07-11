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

  // 6F crossfade: 6F に入った瞬間に 0 リセットし、スクロールで追跡
  const floor6Progress = useMotionValue(0);
  useEffect(() => {
    if (currentFloorId !== '6F' || showFloorIntro) {
      floor6Progress.set(0);
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
  }, [currentFloorId, showFloorIntro]);

  useEffect(() => {
    if (currentFloorId !== '6F') setCurtainPhase('idle');
  }, [currentFloorId]);

  const handleCurtainOpen = () => {
    setCurtainPhase('split');            // 幕フェードイン
    setTimeout(() => setCurtainPhase('darken'), 950);  // 幕の下を黒に
    setTimeout(() => setCurtainPhase('open'),   1500); // 幕を開く
  };

  const floor6BaseOpacity = useTransform(floor6Progress, [0.3, 0.7], [0.6, 0]);
  const floor6RevealOpacity = useTransform(floor6Progress, [0.3, 0.7], [0, 0.6]);
  const floor6RevealScale = useTransform(floor6Progress, [0.7, 1.0], [1, 4]);
  const floor6CurtainOpacity = useTransform(floor6Progress, [0.88, 1.0], [0, 1]);
  const floor6NavOpacity = useTransform(floor6Progress, [0, 0.4], [1, 0]);

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
            setShowMainIntro(false);
            window.scrollTo(0, 0);
            performTransition('door', () => {
              setCurrentFloorId(floorId);
              setShowFloorIntro(true);
            });
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
            {/* 6F crossfade: floor_bg2 → floor_6f_reveal */}
            {currentFloorId === '6F' ? (
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
              opacity: currentFloorId === '6F' ? 0 : currentFloorId ? 0.1 : 0.05,
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
                  {/* 幕の下の黒背景 */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: curtainPhase === 'darken' || curtainPhase === 'open' ? 1 : 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'fixed', inset: 0, background: '#000', zIndex: 29 }}
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
                      x: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
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
                      x: { duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] },
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
                      <div style={{ height: '40px', width: '1px', background: 'var(--glass-border)' }}></div>
                      <span style={{ fontSize: '1.2rem', letterSpacing: '0.1em', opacity: 0.8 }}>
                        {activeFloor.domain}領域
                      </span>
                    </div>

                    <h2 style={{ fontSize: '2.5rem', marginBottom: '16px' }}>
                      {activeFloor.title}
                    </h2>
                    <p style={{ fontSize: '1.4rem', color: activeFloor.color, marginBottom: '24px', fontFamily: 'var(--font-en)' }}>
                      {activeFloor.subtitle}
                    </p>

                    {/* Enhanced Classroom Component */}
                    {currentFloorId !== 'B1' && <Classroom currentFloorId={currentFloorId} lectures={lectures} />}


                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Navigation (Desktop Sticky) */}
            <motion.div className="desktop-nav" style={{ position: 'sticky', top: '80px', display: 'none', opacity: currentFloorId === '6F' ? floor6NavOpacity : 1, pointerEvents: currentFloorId === '6F' ? 'none' : 'auto' }}>
              <div className="glass-panel" style={{ borderRadius: '0 0 16px 16px', padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <SpiralNav compact floors={activeFloors} onSelectFloor={(id) => {
                  const targetIndex = activeFloors.findIndex(f => f.id === id);
                  const direction = targetIndex < effectiveActiveFloorIndex ? 'stairs-up' : 'stairs-down';
                  setTransitionTargetFloor(id);
                  performTransition(direction, () => {
                    setCurrentFloorId(id);
                    setShowFloorIntro(true);
                  });
                }} />
              </div>
            </motion.div>

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
