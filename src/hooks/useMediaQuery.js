import { useEffect, useState, useSyncExternalStore } from 'react';

// 画面の幅・向きなどが条件に合うかを返し、画面を回したり幅を変えたりしたら追従する
// 例: useMediaQuery('(max-width: 600px)')
export function useMediaQuery(query) {
    const get = () => typeof window !== 'undefined' && !!window.matchMedia?.(query).matches;
    const [matches, setMatches] = useState(get);
    useEffect(() => {
        const mql = window.matchMedia(query);
        const update = () => setMatches(mql.matches);
        update();
        mql.addEventListener('change', update);
        return () => mql.removeEventListener('change', update);
    }, [query]);
    return matches;
}

// スマホなど、幅の狭い・縦長・背の低い（スマホを横にした）画面か（このサイトの「スマホ用レイアウト」の切り替え条件）
// index.css の「スマホ用レイアウト」の @media も同じ条件にそろえる
export const MOBILE_QUERY = '(max-width: 640px), (max-aspect-ratio: 3/4), (max-height: 500px)';
export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);

// いまマウス（タッチパッドを含む）で操作しているか。
// タッチパネル付きの Windows パソコンなどでは、マウスがあっても CSS の (hover: hover) が false になることがあるため、
// 実際の操作から判断する: マウスを動かしたら true、画面をタッチしたら false。最初は (any-hover: hover) で推測する
let hasMouseNow = typeof window !== 'undefined' && !!window.matchMedia?.('(any-hover: hover)').matches;
const hasMouseListeners = new Set();
if (typeof window !== 'undefined') {
    const set = (value) => {
        if (hasMouseNow === value) return;
        hasMouseNow = value;
        hasMouseListeners.forEach((fn) => fn(value));
    };
    window.addEventListener('pointermove', (e) => { if (e.pointerType === 'mouse') set(true); }, { passive: true });
    window.addEventListener('pointerdown', (e) => { set(e.pointerType === 'mouse'); }, { passive: true });
}
const subscribeHasMouse = (onChange) => {
    hasMouseListeners.add(onChange);
    return () => hasMouseListeners.delete(onChange);
};
export const useHasMouse = () => useSyncExternalStore(subscribeHasMouse, () => hasMouseNow, () => false);

// 縦長（正方形より縦に長い）画面か。背景の真ん中しか映らないので、背景に合わせて置いた物の位置を変えるときに使う
export const PORTRAIT_QUERY = '(max-aspect-ratio: 1/1)';
export const useIsPortrait = () => useMediaQuery(PORTRAIT_QUERY);
