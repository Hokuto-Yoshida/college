// 管理画面のパスワードの確認（Netlify Functions で共通に使う）。
// パスワードは Netlify の環境変数 ADMIN_PASSWORD で変えられる。設定していなければ「kurucomecome」。
// 画面（src/data/adminAuth.js）は、書き込み（追加・変更・削除）のリクエストのヘッダー X-Admin-Password に入れて送ってくる
const DEFAULT_ADMIN_PASSWORD = 'kurucomecome';
export const ADMIN_PASSWORD_HEADER = 'x-admin-password';

function expectedPassword() {
    const fromNetlify = globalThis.Netlify?.env?.get?.('ADMIN_PASSWORD');
    return fromNetlify || globalThis.process?.env?.ADMIN_PASSWORD || DEFAULT_ADMIN_PASSWORD;
}

// 文字数の差や途中までの一致で、かかる時間が変わらないように比べる
function sameText(a, b) {
    const x = new TextEncoder().encode(a);
    const y = new TextEncoder().encode(b);
    let diff = x.length ^ y.length;
    for (let i = 0; i < Math.max(x.length, y.length); i++) diff |= (x[i] ?? 0) ^ (y[i] ?? 0);
    return diff === 0;
}

export function isAdminPassword(password) {
    return typeof password === 'string' && password.length > 0 && sameText(password, expectedPassword());
}

// パスワードが合っていなければ 401 の Response を返す（合っていれば null）
export function requireAdmin(req) {
    if (isAdminPassword(req.headers.get(ADMIN_PASSWORD_HEADER) || '')) return null;
    return new Response(JSON.stringify({ error: '管理画面のパスワードが違います。管理画面を開き直してください' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
    });
}
