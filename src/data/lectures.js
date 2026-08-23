
export const lectures = [
    {
        id: 'L1',
        floorId: '3F', // 感情
        title: '感情のスペクトル解析',
        links: [
            { title: '参考動画 (シネマテスト用)', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', type: 'recorded' },
            { title: 'オンライン講義室 (Zoom)', url: 'https://zoom.us/test', type: 'realtime' }
        ],
        workshops: [
            {
                id: 'W1-1',
                title: '感情の色と温度',
                description: '今の感情を物理的な特性に例えて分解します',
                questions: [
                    { id: 'q1', text: '今、最も強く感じている感情に名前をつけてください。' },
                    { id: 'q2', text: 'その感情は何色ですか？また、透明度はどのくらいですか？' },
                    { id: 'q3', text: 'その感情の温度は何度くらいですか？（例：触れると火傷する、ひんやりしている）' },
                    { id: 'q4', text: 'その感情は体（身体）のどこに反応が出ていますか？（例：胸の奥、喉のつかえ）' },
                    { id: 'q5', text: 'その感情がもし「音」だとしたら、どんな音がしますか？' },
                    { id: 'q6', text: 'その感情を拒絶せず、ただ横に置いて眺めてみてください。形は変わりましたか？' },
                    { id: 'q7', text: 'その感情の背後にある「本当の願い」は何だと思いますか？' },
                    { id: 'q8', text: '過去に同じ感情を感じた場面を一つ思い出してください。' },
                    { id: 'q9', text: '未来の自分が、今のこの感情を見たら何と言うと思いますか？' },
                    { id: 'q10', text: 'このワークを通じて、その感情に対する印象はどう変化しましたか？' },
                ]
            },
            {
                id: 'W1-2',
                title: '境界線のデザイン',
                description: '自分と他者の感情の境界線を引くワーク',
                questions: [
                    { id: 'q1', text: '最近、他者の感情に巻き込まれたと感じた出来事はありますか？' },
                    { id: 'q2', text: 'その時、あなたの領域（テリトリー）はどこまで侵食されましたか？' },
                    // Shortened for demo simplicity, but structure supports 10
                    { id: 'q3', text: '理想的な境界線を「柵」や「壁」「光のカーテン」などでイメージしてください。' },
                ]
            }
        ]
    },
];
