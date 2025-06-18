export async function onRequest({ request, env, next }) {
    console.log("DEBUG: Middleware is running.");
    console.log("DEBUG: USERNAME =", env.BASIC_USERNAME);
    console.log("DEBUG: PASSWORD =", env.BASIC_PASSWORD);

    if (!request.headers.has('Authorization')) {
        console.log("DEBUG: Authorization header missing");
        return new Response('You need to login.', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm="Restricted Area"' },
        });
    }

    const [scheme, encoded] = request.headers.get('Authorization').split(' ');
    if (!encoded || scheme !== 'Basic') {
        console.log("DEBUG: Malformed authorization header");
        return new Response('Malformed authorization header.', { status: 400 });
    }

    const decoded = atob(encoded);
    const [username, password] = decoded.split(':');

    if (username !== env.BASIC_USERNAME || password !== env.BASIC_PASSWORD) {
        console.log(`DEBUG: Invalid login attempt - username=${username}, password=${password}`);
        return new Response('Invalid username or password.', { status: 401 });
    }

    return next();
}
