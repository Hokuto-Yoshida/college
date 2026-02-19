import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Activity, ChevronDown, MapPin, Menu, X, ArrowUpCircle, ArrowDownCircle, Settings, User } from 'lucide-react';
import './index.css';
import { buildings } from './data/buildings';
import { CampusMap } from './components/CampusMap';
import { TransitionOverlay } from './components/TransitionOverlay';
import { SpiralNav } from './components/SpiralNav';
import { Classroom } from './components/Classroom';
import { AdminDashboard } from './components/AdminDashboard';
import { useLectures } from './hooks/useLectures';

// Assets
import imgExterior from './assets/exterior.png';
import imgAnnex from './assets/annex_exterior.png';
import imgLab from './assets/lab.png';
import imgSpiral from './assets/spiral.png';
import viewLow from './assets/view_low.png'; // 1F
import view2F from './assets/view_2f.png';   // 2F
import viewMid from './assets/view_mid.png'; // 3F
import view4F from './assets/view_4f.png';   // 4F
import viewHigh from './assets/view_high.png'; // 5F
import view6F from './assets/view_6f.png';   // 6F
import viewRoof from './assets/view_roof.png'; // 7F

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
  const [currentBuildingId, setCurrentBuildingId] = useState(null); // Start at Map (null)
  const [currentFloorId, setCurrentFloorId] = useState(null); // null = Hero View
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [isAdminMode, setIsAdminMode] = useState(false);

  // Transition State
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [transitionType, setTransitionType] = useState('door');

  // Data Hook
  const { lectures, addLecture, updateLecture, addWorkshop, updateWorkshop, deleteWorkshop } = useLectures();

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

  // Navigation with Transitions
  const performTransition = (type, updateStateFn) => {
    setTransitionType(type);
    setIsTransitioning(true);

    setTimeout(() => {
      updateStateFn();
      window.scrollTo({ top: 0, behavior: 'instant' });
    }, 1000);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 2000);
  };

  const handleNextFloor = () => {
    if (activeFloorIndex > 0) {
      performTransition('stairs-up', () => {
        setCurrentFloorId(activeFloors[activeFloorIndex - 1].id);
      });
    }
  };

  const handlePrevFloor = () => {
    if (activeFloorIndex < activeFloors.length - 1) {
      performTransition('stairs-down', () => {
        setCurrentFloorId(activeFloors[activeFloorIndex + 1].id);
      });
    }
  };

  const handleEnterFloor = () => {
    // Enter from Hero -> Bottom Floor
    performTransition('stairs-up', () => {
      setCurrentFloorId(activeFloors[activeFloors.length - 1].id);
    });
  };

  const handleBackToMap = () => {
    performTransition('door', () => {
      setCurrentBuildingId(null);
      setCurrentFloorId(null);
    });
  };

  const handleEnterBuilding = (buildingId) => {
    performTransition('door', () => {
      setCurrentBuildingId(buildingId);
    });
  };

  if (loading) return <LoadingScreen />;


  const buildingImages = {
    main: imgExterior,
    annex: imgAnnex
  };

  // Images for Transitions
  const transitionImages = {
    'door': imgExterior, // Entering building
    'stairs-up': imgSpiral,
    'stairs-down': imgSpiral
  };

  // Background Logic
  const getBgImage = (fid) => {
    if (!fid) {
      // Return active building's image
      return buildingImages[currentBuildingId] || imgExterior;
    }
    switch (fid) {
      case '7F': return viewRoof;
      case '6F': return view6F;
      case '5F': return viewHigh;
      case '4F': return view4F;
      case '3F': return viewMid;
      case '2F': return view2F;
      case '1F': return viewLow;
      case 'B1': return imgLab;
      default: return imgExterior;
    }
  };

  return (
    <div className="app-container" style={{ position: 'relative', minHeight: '100vh' }}>

      <TransitionOverlay isVisible={isTransitioning} type={transitionType} images={transitionImages} />

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
      {!currentBuildingId ? (
        /* CAMPUS MAP VIEW */
        <CampusMap onSelectBuilding={handleEnterBuilding} />
      ) : (
        /* BUILDING VIEW (Hero or Floor) */
        <>
          {/* Dynamic Background */}
          <div style={{ position: 'fixed', inset: 0, zIndex: -1, transition: 'all 1s ease' }}>
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${getBgImage(currentFloorId)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.6,
              filter: 'blur(0px)',
              transition: 'background-image 1s ease-in-out'
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              background: activeFloor ? activeFloor.bgCurrent : 'radial-gradient(circle at 50% 50%, rgba(11,16,36,0.5), #0b1024)',
              mixBlendMode: 'overlay',
              transition: 'background 1s ease'
            }} />
            <div style={{
              position: 'absolute', inset: 0,
              backgroundImage: `url(${imgSpiral})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: currentFloorId ? 0.1 : 0.05,
              mixBlendMode: 'screen',
              pointerEvents: 'none'
            }} />
          </div>

          <header style={{ position: 'fixed', top: 0, left: 0, right: 0, padding: '20px', zIndex: 100, display: 'flex', justifyContent: 'space-between', alignItems: 'center', pointerEvents: 'none' }}>
            <div className="glass-panel"
              style={{ padding: '10px 20px', borderRadius: '30px', pointerEvents: 'auto', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}
              onClick={() => {
                if (currentFloorId) {
                  setCurrentFloorId(null);
                } else {
                  handleBackToMap();
                }
              }}
            >
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--floor-4)', boxShadow: '0 0 10px var(--floor-4)' }}></div>
              <span className="en-title" style={{ fontSize: 14, fontWeight: 700 }}>Mind University</span>
            </div>

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
                  padding: '24px', display: 'flex', flexDirection: 'column'
                }}
              >
                <div style={{ alignSelf: 'flex-end', marginBottom: '20px' }}>
                  <button onClick={() => setMobileMenuOpen(false)} style={{ background: 'none', border: 'none', color: 'white', padding: '8px' }}>
                    <X size={32} />
                  </button>
                </div>
                <h2 style={{ color: 'var(--text-muted)', marginBottom: '24px', fontSize: '1.2rem' }}>Floor Guide</h2>
                <div style={{ overflowY: 'auto', flex: 1 }}>
                  <SpiralNav floors={activeFloors} onSelectFloor={(id) => {
                    setMobileMenuOpen(false);
                    performTransition('stairs-up', () => setCurrentFloorId(id));
                  }} />
                </div>
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
                    <div className="badge" style={{
                      display: 'inline-block', padding: '6px 12px', borderRadius: '20px',
                      border: `1px solid ${activeBuilding.color}`, color: activeBuilding.color,
                      marginBottom: '20px', fontSize: '0.8rem'
                    }}>
                      Mind University
                    </div>
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
                          background: activeBuilding.color,
                          border: 'none',
                          textShadow: '0 1px 2px rgba(0,0,0,0.3)'
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
                    <p style={{ fontSize: '1.1rem', lineHeight: 2, color: 'var(--text-main)', maxWidth: '650px', background: 'rgba(0,0,0,0.2)', padding: '20px', borderRadius: '16px', borderLeft: `4px solid ${activeFloor.color}` }}>
                      {activeFloor.description}
                      <br /><br />
                      この階層では、その瞬間のマインドに応じたワークが即興で生まれます。<br />
                      答えを見つけるのではなく、向き合うことで階層が引き上がります。
                    </p>

                    {/* Enhanced Classroom Component */}
                    <Classroom currentFloorId={currentFloorId} lectures={lectures} />

                    {/* Bottom Navigation Buttons */}
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '60px', paddingTop: '20px', borderTop: '1px solid var(--glass-border)' }}>
                      {activeFloorIndex < activeFloors.length - 1 && (
                        <button
                          onClick={handlePrevFloor}
                          className="glass-panel"
                          style={{ padding: '12px 24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'var(--text-muted)' }}
                        >
                          <ArrowDownCircle size={20} /> 下の階 ({activeFloors[activeFloorIndex + 1].id})
                        </button>
                      )}

                      {activeFloorIndex > 0 && (
                        <button
                          onClick={handleNextFloor}
                          className="glass-panel"
                          style={{ padding: '12px 24px', borderRadius: '24px', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', color: 'white', border: `1px solid ${activeFloors[activeFloorIndex - 1].color}` }}
                        >
                          上の階 ({activeFloors[activeFloorIndex - 1].id}) <ArrowUpCircle size={20} />
                        </button>
                      )}
                    </div>

                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Column: Navigation (Desktop Sticky) */}
            <div className="desktop-nav" style={{ position: 'sticky', top: '100px', display: 'none', '@media(min-width: 900px)': { display: 'block' } }}>
              <div className="glass-panel" style={{ borderRadius: '24px', padding: '16px' }}>
                <SpiralNav floors={activeFloors} onSelectFloor={(id) => {
                  performTransition('stairs-up', () => setCurrentFloorId(id));
                }} />
              </div>

              <div className="glass-panel" style={{ marginTop: '20px', borderRadius: '24px', padding: '20px', textAlign: 'center' }}>
                <MapPin size={24} style={{ marginBottom: '8px', opacity: 0.7 }} />
                <p style={{ fontSize: '0.9rem', margin: 0 }}>
                  {currentFloorId ? `現在地: ${currentFloorId}` : '大学エントランス'}
                </p>
              </div>
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
