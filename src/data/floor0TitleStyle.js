// 0F 本棚の表紙・章のタイトルの文字の見た目（フォントと大きさ）の選択肢
// サーバー側（netlify/functions）でも同じ値だけを受け付ける
export const TITLE_FONTS = [
    { value: 'gothic', label: 'ゴシック体', css: 'var(--font-jp)' },
    { value: 'mincho', label: '明朝体', css: 'var(--font-mincho)' },
];

export const TITLE_SIZES = [
    { value: 'small', label: '小', css: '0.75rem' },
    { value: 'medium', label: '中', css: '0.9rem' },
    { value: 'large', label: '大', css: '1.2rem' },
];

export const DEFAULT_TITLE_FONT = 'gothic';
export const DEFAULT_TITLE_SIZE = 'medium';

// 保存されている titleFont / titleSize から、タイトルに当てる CSS を作る（未設定ならゴシック体・中）
export function titleTextStyle({ titleFont, titleSize } = {}) {
    const font = TITLE_FONTS.find((f) => f.value === titleFont) || TITLE_FONTS.find((f) => f.value === DEFAULT_TITLE_FONT);
    const size = TITLE_SIZES.find((s) => s.value === titleSize) || TITLE_SIZES.find((s) => s.value === DEFAULT_TITLE_SIZE);
    return { fontFamily: font.css, fontSize: size.css };
}

// --- タイトルの一部だけフォント・大きさを変える（Word のような部分指定） ---
// タイトルは「区切り（run）」の並び titleRuns = [{ text, font?, size? }, ...] で保存する。
// font / size がない区切りは、タイトル全体の titleFont / titleSize に従う。text の "\n" は改行。

// 区切り1つ分の、全体の設定から変える部分だけの CSS
export function runTextStyle({ font, size } = {}) {
    const css = {};
    const f = TITLE_FONTS.find((x) => x.value === font);
    const s = TITLE_SIZES.find((x) => x.value === size);
    if (f) css.fontFamily = f.css;
    if (s) css.fontSize = s.css;
    return css;
}

// 1文字ずつに分けて扱う（タイトルは短いので、これで十分。位置は画面の文字数と同じ数え方にそろえる）
const toChars = (runs) => runs.flatMap((r) => r.text.split('').map((ch) => ({ ch, font: r.font, size: r.size })));
const fromChars = (chars) => {
    const runs = [];
    for (const c of chars) {
        const last = runs[runs.length - 1];
        if (last && last.font === c.font && last.size === c.size) last.text += c.ch;
        else runs.push({ text: c.ch, ...(c.font && { font: c.font }), ...(c.size && { size: c.size }) });
    }
    return runs;
};

// 空の区切りを除き、同じ見た目で隣り合う区切りをまとめる
export const normalizeRuns = (runs) => fromChars(toChars(runs));

// 本・章のタイトルを区切りの並びで取り出す（部分指定がなければタイトル全体で1つ）
export function runsFromItem(item) {
    if (Array.isArray(item?.titleRuns) && item.titleRuns.length > 0) return item.titleRuns.map((r) => ({ ...r }));
    return item?.title ? [{ text: item.title }] : [];
}

export const runsToText = (runs) => runs.map((r) => r.text).join('');

// 一覧やプルダウンに出す1行のタイトル（改行は空白にする）
export const runsToPlainTitle = (runs) => runsToText(runs).replace(/\s*\n\s*/g, ' ').trim();

// start〜end の文字の font / size を変える
export function applyRunStyle(runs, start, end, prop, value) {
    const chars = toChars(runs);
    for (let i = start; i < end && i < chars.length; i++) chars[i][prop] = value;
    return fromChars(chars);
}

// 全体の設定に戻す（部分指定した font / size を消す）
export const clearRunStyle = (runs, prop) => fromChars(toChars(runs).map((c) => ({ ...c, [prop]: undefined })));

// start〜end を text に置き換える。新しい文字は直前の文字の見た目を引き継ぐ
export function replaceRunText(runs, start, end, text) {
    const chars = toChars(runs);
    const ref = chars[start - 1] || chars[end] || {};
    chars.splice(start, end - start, ...text.split('').map((ch) => ({ ch, font: ref.font, size: ref.size })));
    return fromChars(chars);
}

// 保存する titleRuns。部分指定も改行もなければ null（全体の設定だけで足りるので保存しない）
export function titleRunsForSave(runs) {
    const needed = runs.some((r) => r.font || r.size) || runsToText(runs).includes('\n');
    return needed ? normalizeRuns(runs) : null;
}
