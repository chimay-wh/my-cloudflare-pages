export async function onRequest({ request, env, next }) {
    if (!request.headers.has('Authorization')) {
        return new Response('You need to login.', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' },
        });
    }

    const [scheme, encoded] = request.headers.get('Authorization').split(' ');
    if (!encoded || scheme !== 'Basic') {
        return new Response('Malformed authorization header.', { status: 400 });
    }

    const decoded = atob(encoded);
    const [username, password] = decoded.split(':');

    if (username !== env.BASIC_USERNAME || password !== env.BASIC_PASSWORD) {
        return new Response('Invalid username or password.', { status: 401 });
    }

    return next();
}
