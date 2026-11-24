import { isAdminPassword } from '../lib/adminAuth.js';

// 管理画面を開くときのパスワード確認。{ password } を送ると、合っていれば 200、違えば 401 を返す
export default async (req) => {
    if (req.method !== 'POST') return new Response('Method Not Allowed', { status: 405 });
    let body;
    try {
        body = await req.json();
    } catch {
        body = null;
    }
    const ok = isAdminPassword(body?.password);
    return new Response(JSON.stringify(ok ? { ok: true } : { error: 'パスワードが違います' }), {
        status: ok ? 200 : 401,
        headers: { 'Content-Type': 'application/json' },
    });
};

export const config = {
    path: '/api/admin-login',
};
