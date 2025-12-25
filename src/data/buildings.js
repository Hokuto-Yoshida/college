import { floors as mainFloors } from './floors';

export const buildings = [
    {
        id: 'main',
        name: 'Mind University',
        description: '心の階層を7階建ての建物で表現。情動・感情・感性の領域を行き来する実践の場所。',
        floors: mainFloors,
        imageKey: 'exterior'
    },
    {
        id: 'annex',
        name: 'Annex (別館)',
        description: '深層心理を探求するための特別棟。より静かで個人的な内省のための空間。',
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
        imageKey: 'annex_exterior'
    }
];
