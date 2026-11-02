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
