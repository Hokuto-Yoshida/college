import { floors as mainFloors } from './floors';

export const buildings = [
    {
        id: 'personal',
        name: 'パーソナル',
        description: '自己を深堀りするパーソナルな空間。',
        floors: [{ id: '1F', title: 'ラウンジ', description: '自己との対話', color: '#ff9a9e', bgCurrent: 'linear-gradient(135deg, #ff9a9e, #fecfef)' }],
        imageKey: 'exterior',
        color: '#ff9a9e',
        mapPosition: { top: '32%', left: '40%', scale: 0.8 }
    },
    {
        id: 'mirror',
        name: '鏡面感覚',
        description: '世界を反射し、自己を映し出す鏡面の世界。',
        floors: [{ id: '1F', title: '鏡の間', description: '反射と投影', color: '#a18cd1', bgCurrent: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' }],
        imageKey: 'annex_exterior',
        color: '#a18cd1',
        mapPosition: { top: '39%', left: '35%', scale: 0.9 }
    },
    {
        id: 'collage',
        name: 'コラージュ',
        description: '様々な要素を再構築し、新しい意味を創り出す場所。',
        floors: [{ id: '1F', title: 'アトリエ', description: '断片の結合', color: '#f6d365', bgCurrent: 'linear-gradient(135deg, #f6d365, #fda085)' }],
        imageKey: 'exterior',
        color: '#f6d365',
        mapPosition: { top: '38%', left: '45%', scale: 0.8 }
    },
    {
        id: 'main',
        name: '本館',
        description: '心の階層を7階建ての建物で表現。感性と論理を統合するメインキャンパス。',
        floors: mainFloors,
        imageKey: 'exterior',
        color: '#4facfe',
        mapPosition: { top: '47%', left: '52%', scale: 1.2 }
    },
    {
        id: 'mind',
        name: 'マインド塾',
        description: '精神の構造を学び、マインドを鍛える専門塾。',
        floors: [{ id: '1F', title: '講義室', description: '精神構造論', color: '#43e97b', bgCurrent: 'linear-gradient(135deg, #43e97b, #38f9d7)' }],
        imageKey: 'annex_exterior',
        color: '#43e97b',
        mapPosition: { top: '39%', left: '68%', scale: 1.0 }
    },
    {
        id: 'yosei',
        name: '養成塾',
        description: '実践的なスキルと心を育てるトレーニンググラウンド。',
        floors: [{ id: '1F', title: 'プラクティスルーム', description: '実践訓練', color: '#fa709a', bgCurrent: 'linear-gradient(135deg, #fa709a, #fee140)' }],
        imageKey: 'exterior',
        color: '#fa709a',
        mapPosition: { top: '53%', left: '32%', scale: 1.1 }
    },
    {
        id: 'practical',
        name: '心の実学',
        description: '心の理論を現実世界で活かすための応用学部。',
        floors: [{ id: '1F', title: '応用研究室', description: '現実との接点', color: '#30cfd0', bgCurrent: 'linear-gradient(135deg, #30cfd0, #330867)' }],
        imageKey: 'annex_exterior',
        color: '#30cfd0',
        mapPosition: { top: '53%', left: '73%', scale: 1.1 }
    }
];
