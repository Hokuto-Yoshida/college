import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function TransitionOverlay({ isVisible, type = 'door', images = {}, targetFloorId, onComplete }) {
    // Default fallback visuals (CSS) if no image provided
    const getVisual = () => {
        const imgSrc = images[type];

        if (imgSrc) {
            if (type === 'door') {
                return (
                    <motion.div
                        initial={{ backgroundColor: 'rgba(0,0,0,1)' }}
                        animate={{ backgroundColor: ['rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,1)', 'rgba(0,0,0,0)'] }}
                        transition={{ duration: 3.2, times: [0, 0.4, 0.9, 1] }}
                        style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden',
                            position: 'relative',
                            perspective: '1200px'
                        }}
                    >
                        {/* Door Container */}
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
                );
            } else {
                // クロスフェードでトランジション画面を出す
                let initial = { opacity: 0 };
                let animate = { opacity: 1 };
                let exit = { opacity: 0 };

                // 画像の移動方向（逆にしてほしいとのご要望に合わせて反転）
                // 上がる時: 画像は上から下へ（カメラが上に登る感覚）
                // 下がる時: 画像は下から上へ（カメラが下に降りる感覚）
                // 3D回転時の見切れ（黒い背景の露出）を防ぐため、描画範囲に大きなゆとりを持たせる（height: 300%）
                const imgInitialY = type === 'stairs-up' ? '-33.33%' : '0%';
                const imgAnimateY = type === 'stairs-up' ? '0%' : '-33.33%';

                // 画面に平行な軸（Y軸）での回転：らせん階段のカーブに沿って回る3D演出
                const imgInitialRotateY = type === 'stairs-up' ? -25 : 25;
                const imgAnimateRotateY = type === 'stairs-up' ? 25 : -25;

                return (
                    <motion.div
                        initial={initial}
                        animate={animate}
                        exit={exit}
                        transition={{ duration: 1.0, ease: "easeInOut" }}
                        style={{
                            width: '100%', height: '100%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#000',
                            overflow: 'hidden',
                            position: 'relative',
                            perspective: '1200px' // 3D回転のための奥行きを設定
                        }}
                    >
                        {/* Background Spiral Image Panning & 3D Rotating */}
                        <motion.img
                            src={imgSrc}
                            style={{ position: 'absolute', width: '150%', height: '300%', objectFit: 'cover', top: '-50%', left: '-25%', filter: 'brightness(0.7)' }}
                            initial={{ y: imgInitialY, rotateY: imgInitialRotateY }}
                            animate={{ y: imgAnimateY, rotateY: imgAnimateRotateY }}
                            transition={{ duration: 8, ease: "easeInOut" }}
                        />

                        {/* Text Overlay Sequence */}
                        <div style={{ position: 'relative', zIndex: 10, width: '90%', maxWidth: '900px', display: 'flex', flexDirection: 'column', gap: '30px', alignItems: 'center', textAlign: 'center' }}>
                            {['1F', '2F', '3F', '4F', '5F', '6F', '7F'].includes(String(targetFloorId)) ? (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 2, delay: 0.5 }}
                                        style={{ color: 'white', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                                    >
                                        人は、「何を見るか」によって人生が変わります。<br />
                                        そしてそれは、視界ではなく心の視点の高さによって決まります。<br />
                                        マインド大学が扱うのは、知識でも、スキルでもありません。<br />
                                        私たちが扱うのは心の視点そのものです。
                                    </motion.div>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 2, delay: 3.5 }}
                                        style={{ color: 'white', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                                    >
                                        人間の目が上にあるように、人は本来、より高い視点から世界を見ることができます。<br />
                                        その視点を取り戻すための最もベーシックなマインドセットが『マインドの法則』です。<br />
                                        私たちはこの法則を基盤に、人の心の成長を体系化した<br />
                                        「マインドプロセスデザイン（MPD）」という独自の理論と実践体系を構築してきました
                                    </motion.div>

                                    {/* Principles 1-7 Dynamic Rendering */}
                                    {String(targetFloorId) === '1F' && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, delay: 6.5 }} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '8px' }}>第1原理</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '16px' }}>心の視点が現実を決める</div>
                                            人の現実は出来事によって決まるのではありません。<br />
                                            それをどの視点から捉えるかによって決まります。<br />
                                            視点が上がると可能性が見え始めます。
                                        </motion.div>
                                    )}
                                    {String(targetFloorId) === '2F' && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, delay: 6.5 }} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '8px' }}>第2原理</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '16px' }}>問いが可能性を開く</div>
                                            答えは思考を終わらせます。<br />
                                            しかし問いは思考を拡張します。<br />
                                            問いを持つとき潜在意識が動き始めます。<br />
                                            問いこそが人の可能性を引き出す鍵です。
                                        </motion.div>
                                    )}
                                    {String(targetFloorId) === '3F' && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, delay: 6.5 }} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '8px' }}>第3原理</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '16px' }}>潜在意識が未来を生み出す</div>
                                            人の可能性の大部分は顕在意識ではなく<br />
                                            潜在意識にあります。<br />
                                            まだ言葉になっていない直感まだ形になっていない未来。<br />
                                            それらはすべて潜在意識から生まれます。
                                        </motion.div>
                                    )}
                                    {String(targetFloorId) === '4F' && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, delay: 6.5 }} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '8px' }}>第4原理</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '16px' }}>心には成長のプロセスがある</div>
                                            人の意識は段階的に成長します。<br />
                                            気づき、理解し、視点を高め、可能性を開いていく。<br />
                                            この心の成長の流れがマインドプロセスです。
                                        </motion.div>
                                    )}
                                    {String(targetFloorId) === '5F' && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, delay: 6.5 }} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '8px' }}>第5原理</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '16px' }}>場と関係が意識を変える</div>
                                            人の意識は環境によって大きく変わります。<br />
                                            人間関係組織文化空間それらはすべて意識の質を変えます。<br />
                                            「マインドプロセスデザイン（MPD）」は<br />
                                            心の導線を設計する思想でもあります。
                                        </motion.div>
                                    )}
                                    {String(targetFloorId) === '6F' && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, delay: 6.5 }} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '8px' }}>第6原理</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '16px' }}>時間の質が未来を変える</div>
                                            時間は単なる時計の流れではありません。<br />
                                            意識が変わると時間の密度が変わります。<br />
                                            気づきの瞬間未来が見える瞬間人生が変わる瞬間。<br />
                                            「マインドプロセスデザイン（MPD）」は時間の質を変える思想でもあります。
                                        </motion.div>
                                    )}
                                    {String(targetFloorId) === '7F' && (
                                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 2, delay: 6.5 }} style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '8px' }}>第7原理</div>
                                            <div style={{ fontWeight: 'bold', fontSize: '1.4rem', marginBottom: '16px' }}>心の進化は世界を変える</div>
                                            一人の心の変化は個人にとどまりません。<br />
                                            それは人間関係組織社会世界へと広がっていきます。<br />
                                            つまり<span style={{fontWeight: 'bold'}}>世界は人の心の集合体</span>なのです。
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                <>
                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
                                        transition={{ duration: 3, times: [0, 0.2, 0.8, 1], delay: 0.5 }}
                                        style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.1em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                                    >
                                        問いを立て、構造を描く。
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
                                        transition={{ duration: 3, times: [0, 0.2, 0.8, 1], delay: 2 }}
                                        style={{ color: 'white', fontSize: '1.5rem', fontWeight: 'bold', letterSpacing: '0.1em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                                    >
                                        マインドプロセスデザインで思考を整える。
                                    </motion.div>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: [0, 1, 1, 0], y: [20, 0, 0, -20] }}
                                        transition={{ duration: 3.5, times: [0, 0.2, 0.9, 1], delay: 3.5 }}
                                        style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, letterSpacing: '0.05em', textShadow: '0 2px 10px rgba(0,0,0,0.8)' }}
                                    >
                                        この階層では、その瞬間のマインドに応じたワークが即興で生まれます。<br />
                                        答えを見つけるのではなく、向き合うことで階層が引き上がります。
                                    </motion.div>
                                </>
                            )}

                            {/* Enter Floor Button */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 1, delay: ['1F', '2F', '3F', '4F', '5F', '6F', '7F'].includes(String(targetFloorId)) ? 9.5 : 6.5 }}
                                style={{ pointerEvents: 'auto', marginTop: ['1F', '2F', '3F', '4F', '5F', '6F', '7F'].includes(String(targetFloorId)) ? '20px' : '0' }}
                            >
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (onComplete) onComplete();
                                    }}
                                    className="glass-panel"
                                    style={{
                                        padding: '16px 40px',
                                        borderRadius: '40px',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '12px',
                                        background: 'rgba(255,255,255,0.2)',
                                        border: '1px solid white',
                                        textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                        boxShadow: `0 0 20px rgba(255,255,255,0.2)`
                                    }}
                                >
                                    フロアに入る
                                </button>
                            </motion.div>
                        </div>
                    </motion.div>
                );
            }
        }

        // Fallback CSS shapes
        switch (type) {
            case 'door':
                return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000', perspective: '1200px' }}>
                        {/* Door Container */}
                        <motion.div
                            animate={{ scale: [1, 2, 15] }}
                            transition={{ duration: 4, times: [0, 0.4, 1], ease: "easeInOut" }}
                            style={{
                                width: '280px', height: '420px',
                                position: 'relative',
                                display: 'flex',
                                transformStyle: 'preserve-3d',
                            }}
                        >
                            <motion.div
                                animate={{ rotateY: [0, 0, -110] }}
                                transition={{ duration: 4, times: [0, 0.4, 1], ease: "easeInOut" }}
                                style={{ width: '50%', height: '100%', background: '#1a1a24', border: '2px solid #333', transformOrigin: 'left' }}
                            />
                            <motion.div
                                animate={{ rotateY: [0, 0, 110] }}
                                transition={{ duration: 4, times: [0, 0.4, 1], ease: "easeInOut" }}
                                style={{ width: '50%', height: '100%', background: '#1a1a24', border: '2px solid #333', transformOrigin: 'right' }}
                            />
                        </motion.div>
                    </div>
                );
            case 'stairs-up':
            case 'stairs-down':
                return (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000' }}>
                        <motion.div
                            initial={{ rotate: 0, opacity: 0 }}
                            animate={{ rotate: type === 'stairs-up' ? 90 : -90, opacity: 1 }}
                            transition={{ duration: 2 }}
                            style={{ width: '200px', height: '200px', border: '2px dashed white', borderRadius: '50%' }}
                        />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ position: 'fixed', inset: 0, zIndex: 9999, pointerEvents: 'none' }}
                >
                    {getVisual()}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
