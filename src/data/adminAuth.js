// 管理画面のパスワード（画面側）。
// 管理画面を開くときに入れたパスワードを、そのタブを閉じるまで覚えておき（sessionStorage）、
// 本の追加・変更・削除のリクエストに付けて送る。正しいかどうかはサーバー（netlify/lib/adminAuth.js）が確かめる
const STORAGE_KEY = 'kuru_admin_password';
export const ADMIN_PASSWORD_HEADER = 'X-Admin-Password';

let memoryPassword = ''; // sessionStorage が使えないときの控え

export function getAdminPassword() {
    try {
        return sessionStorage.getItem(STORAGE_KEY) || memoryPassword;
    } catch {
        return memoryPassword;
    }
}

export function setAdminPassword(password) {
    memoryPassword = password || '';
    try {
        if (password) sessionStorage.setItem(STORAGE_KEY, password);
        else sessionStorage.removeItem(STORAGE_KEY);
    } catch {
        // 保存できなくても、このページを開いている間は memoryPassword で使える
    }
}

// 書き込みのリクエストに付けるヘッダー
export const adminHeaders = (headers = {}) => ({ ...headers, [ADMIN_PASSWORD_HEADER]: getAdminPassword() });

// パスワードを確かめる。合っていれば覚えて true
export async function verifyAdminPassword(password) {
    let res;
    try {
        res = await fetch('/api/admin-login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        });
    } catch {
        throw new Error('通信に失敗しました。時間をおいてもう一度お試しください');
    }
    // 開発中（npm run dev）は Netlify Functions が動いていないので、netlify/lib/adminAuth.js の既定のパスワードだけで開けるようにする（本番のビルドには入らない）
    if (import.meta.env.DEV && (res.status === 404 || !(res.headers.get('content-type') || '').includes('json'))) {
        const ok = password === 'kurucomecome';
        if (ok) setAdminPassword(password);
        return ok;
    }
    if (res.ok) {
        setAdminPassword(password);
        return true;
    }
    if (res.status === 401) return false;
    throw new Error('確認に失敗しました。時間をおいてもう一度お試しください');
}
