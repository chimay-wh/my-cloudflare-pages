export async function onRequest({ request, env, next }) {
    console.log("USERNAME:", env.BASIC_USERNAME);
    console.log("PASSWORD:", env.BASIC_PASSWORD);

    if (!request.headers.has('Authorization')) {
        return new Response('You need to login.', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm=\"Restricted Area\"' },
        });
    }

    const [scheme, encoded] = request.headers.get('Authorization').split(' ');
    if (!encoded || scheme !== 'Basic') {
        return new Response('Malformed authorization header.', { status: 400 });
    }

    const decoded = atob(encoded);
    const [username, password] = decoded.split(':');

    if (username !== env.BASIC_USERNAME || password !== env.BASIC_PASSWORD) {
        console.log("認証失敗: 入力された username=", username, " password=", password);
        return new Response('Invalid username or password.', { status: 401 });
    }

    return next();
}
