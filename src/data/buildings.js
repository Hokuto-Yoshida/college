import { floors as mainFloors } from './floors';

export const buildings = [
    {
        id: 'main',
        name: '本館',
        description: '心の階層を7階建ての建物で表現。感性と論理を統合するメインキャンパス。',
        floors: mainFloors,
        imageKey: 'exterior',
        color: '#ff9a9e',
        mapPosition: { top: '50%', left: '50%', scale: 1.2 }
    },
    {
        id: 'east',
        name: '東館',
        description: '「表現と創造」の塔。アート、音楽、身体表現など、アウトプットに特化したエリア。',
        floors: [
            { id: '1F', title: 'アトリエ', description: '色彩と形の実験室', color: '#a18cd1', bgCurrent: 'linear-gradient(135deg, #a18cd1, #fbc2eb)' },
            { id: '2F', title: 'サウンドラボ', description: '音の波形をデザインする', color: '#ff9a9e', bgCurrent: 'linear-gradient(135deg, #ff9a9e, #fecfef)' }
        ],
        imageKey: 'annex_exterior', // Placeholder
        color: '#a18cd1',
        mapPosition: { top: '50%', left: '80%', scale: 0.9 }
    },
    {
        id: 'west', // Formerly Annex
        name: '西館',
        description: '「深層と休息」の別邸。静寂の中で自己の内側深くへと潜るサンクチュアリ。',
        floors: [
            {
                id: '3F',
                domain: '深層',
                title: '静寂の回廊',
                subtitle: '音のない世界',
                description: '外部の喧騒を遮断し、内なる声だけに耳を傾ける回廊。',
                color: 'var(--floor-6)',
                bgCurrent: 'linear-gradient(135deg, rgba(161,140,209,0.1), rgba(251,194,235,0.1))',
                icon: 'Moon'
            },
            {
                id: '2F',
                domain: '深層',
                title: '記憶の書庫',
                subtitle: '過去の編纂',
                description: '忘れ去られた記憶を整理し、意味を与え直すための場所。',
                color: 'var(--floor-4)',
                bgCurrent: 'linear-gradient(135deg, rgba(143,211,244,0.1), rgba(132,250,176,0.1))',
                icon: 'Book'
            },
            {
                id: '1F',
                domain: '深層',
                title: '瞑想ホール',
                subtitle: 'ゼロへの回帰',
                description: 'すべてを手放し、ただ呼吸とともに在るための何もない空間。',
                color: 'var(--floor-2)',
                bgCurrent: 'linear-gradient(135deg, rgba(212,252,121,0.1), rgba(150,230,161,0.1))',
                icon: 'Minimize'
            }
        ],
        imageKey: 'annex_exterior',
        color: '#4facfe',
        mapPosition: { top: '50%', left: '20%', scale: 0.9 }
    },
    {
        id: 'north',
        name: '北館',
        description: '「知恵と記録」の図書館。宇宙の法則や歴史、アカシックレコードにアクセスする。',
        floors: [
            { id: '1F', title: 'アーカイブ', description: '全歴史の記録', color: '#43e97b', bgCurrent: 'linear-gradient(135deg, #43e97b, #38f9d7)' }
        ],
        imageKey: 'exterior', // Placeholder
        color: '#43e97b',
        mapPosition: { top: '20%', left: '50%', scale: 0.8 }
    }
];
