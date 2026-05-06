import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import imgPath1 from '../assets/path_1.png';
import imgPath2 from '../assets/path_2.png';
import imgPath3 from '../assets/path_3.png';
import imgPath4 from '../assets/path_4.png';
import imgPath5 from '../assets/path_5.png';

const sections = [
    {
        text: "マインドデザイン研究所では、\nモノ×潜在意識\nコト×潜在意識\nヒト×潜在意識\n物理次元（社会）×マインド次元（潜在意識）\nの共創を実現するためのマインドデザインを構築し、\n様々な分野において、目に見える情報世界では\n動かしようのなかった革新的な潜在価値を創出します。\n\n潜在的な領域に切り込むことのできる「マインドの扱い方」を熟知し、\n例外なく、個人において、組織においても\n「マインドプロセスデザイン」を構築できるという強みを生かして、\n誰にでも当てはまる「マインドプロセスデザイン」を活用し、\n社会に活用していくための研究所です。"
    },
    {
        text: "マインドデザイン研究所は、\nこの意識できていない潜在的の領域にいかにアプローチするか、\nその”マインドプロセス”を研究し続けています。\n\nマインドデザイン研究所では、人間の潜在意識に着目しました。\nそれは人間のゲノムを探求し続け、\n革新的な発見を成し遂げてきた生物学や生命科学の領域と同じくして、"
    },
    {
        text: "一人一人違う考え方、行動をするマインド「心と脳の学問」として、\n「心のマイクロスコープ」によって潜在意識という領域にフォーカスを当て、\n様々な発見と開発を重ね挑み続けることで、実証してきた知見的モデルを、\n実装可能な状態で、組織、社会に拡く実用的なしくみに組み込むことが可能です。\n\n心のマイクロスコープでのぞき込んだ日常次元では見えてこないが\n確実に存在する人間の潜在意識（9割）を解き明かしていくことが、\nマインドデザイン研究所の使命です。"
    },
    {
        text: "マインドデザイン―感性―”は、\n心の視点を引き上げる「マインドの法則」を体系化した\n【マインドプロセスデザイン-MPD- 】を活用し\n時代・産業を問わない普遍的な価値創出を実現していきます。\n\n人の行動の9割は無自覚な潜在意識が決めています。\n人間の知覚できている意識は、およそ1割以下と\n言われています。"
    },
    {
        text: "「意識できている自分」と\n「意識できていないもう一人の自分」という存在に、\n未だ多くの人は気づいていません。\n\nこの”無自覚な自分”が、自らの人生、\nそして、自らを取り巻く世界を創り出している──\n\nこの現状の真実にフォーカスを向け、\n1割の意識を読み取ったデータではなく\n潜在意識9割を読み解く“マインドデザイン―感性―”で\n世界は一変します。"
    }
];

const bgImages = [imgPath1, imgPath2, imgPath3, imgPath4, imgPath5];

export const IntroSequence = ({ onEnter }) => {
    // 画面全体（Window）のスクロールを追跡するように変更（確実に動作させるため）
    const { scrollYProgress } = useScroll();

    // スクロールに応じた5枚の画像の不透明度マッピング
    const opacity0 = useTransform(scrollYProgress, [0, 0.10, 0.20], [1, 1, 0]);
    const opacity1 = useTransform(scrollYProgress, [0.10, 0.20, 0.35, 0.45], [0, 1, 1, 0]);
    const opacity2 = useTransform(scrollYProgress, [0.35, 0.45, 0.60, 0.70], [0, 1, 1, 0]);
    const opacity3 = useTransform(scrollYProgress, [0.60, 0.70, 0.85, 0.95], [0, 1, 1, 0]);
    const opacity4 = useTransform(scrollYProgress, [0.85, 0.95, 1.0], [0, 1, 1]);
    const opacities = [opacity0, opacity1, opacity2, opacity3, opacity4];

    // 切り替えタイミングで濃くなる靄（もや）の不透明度マッピング
    const mistOpacity = useTransform(scrollYProgress, 
        [0, 0.05, 0.15, 0.25, 0.30, 0.40, 0.50, 0.55, 0.65, 0.75, 0.80, 0.90, 1.0],
        [0, 0,    1,    0,    0,    1,    0,    0,    1,    0,    0,    1,    0  ]
    );

    return (
        <div style={{ background: '#000', minHeight: '100vh', position: 'relative' }}>
            {/* Fixed Background Container */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, height: '100vh', overflow: 'hidden', zIndex: 0 }}>
                {/* Scroll-Linked Images */}
                {bgImages.map((img, idx) => (
                    <motion.div
                        key={idx}
                        style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: `url(${img})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            opacity: opacities[idx],
                            zIndex: 0
                        }}
                    />
                ))}

                {/* Scroll-Linked Mist Layer */}
                <motion.div
                    style={{
                        position: 'absolute', inset: 0,
                        background: 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.6) 70%, transparent 100%)',
                        backdropFilter: 'blur(16px)',
                        pointerEvents: 'none',
                        opacity: mistOpacity,
                        zIndex: 1
                    }}
                />

                {/* Dark Gradient Overlay for Readability */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(to bottom, transparent, rgba(5, 10, 20, 0.85))',
                    zIndex: 2
                }} />
            </div>

            {/* Scrolling Content Panels (Contiguous text flow) */}
            <div style={{ position: 'relative', zIndex: 10, paddingTop: '15vh', paddingBottom: '30vh' }}>
                {sections.map((section, idx) => (
                    <motion.div 
                        key={idx} 
                        style={{
                            minHeight: '60vh',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            padding: '20px',
                            marginBottom: '35vh' // Provides the deep scrolling feeling
                        }}
                    >
                        <div
                            style={{
                                maxWidth: '800px',
                                width: '100%',
                                padding: '50px 20px',
                                textAlign: 'center',
                            }}
                        >
                            <div style={{
                                fontSize: 'clamp(1.1rem, 3.5vw, 1.4rem)',
                                color: '#ffffff',
                                fontFamily: 'var(--font-jp)',
                                textAlign: 'center',
                                textShadow: '0 4px 8px rgba(0,0,0,0.8), 0 0 20px rgba(0,0,0,0.6)',
                                letterSpacing: '0.05em'
                            }}>
                                {/* Text paragraphs with margin for breathing room */}
                                {section.text.split('\n\n').map((paragraph, p_idx) => (
                                    <div key={p_idx} style={{ marginBottom: '3rem' }}>
                                        {paragraph.split('\n').map((line, l_idx) => (
                                            <p key={l_idx} style={{ margin: 0, lineHeight: 2.2 }}>
                                                {line}
                                            </p>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                ))}

                {/* Final Enter Button */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10vh' }}>
                    <motion.button
                        whileHover={{ scale: 1.05, boxShadow: '0 0 20px var(--floor-4)' }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onEnter}
                        style={{
                            padding: '16px 48px',
                            borderRadius: '40px',
                            background: 'var(--floor-4)',
                            color: '#000',
                            border: 'none',
                            fontSize: '1.3rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            transition: 'box-shadow 0.3s ease'
                        }}
                    >
                        大学ルームに入る <ArrowRight />
                    </motion.button>
                </div>
            </div>
        </div>
    );
};
