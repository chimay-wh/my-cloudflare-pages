export async function onRequest({ request, env, next }) {
    console.log("DEBUG: Middleware is running.");
    console.log("DEBUG: USERNAME =", env.BASIC_USERNAME);
    console.log("DEBUG: PASSWORD =", env.BASIC_PASSWORD);

    if (!request.headers.has('Authorization')) {
        return new Response('You need to login.', {
            status: 401,
            headers: { 'WWW-Authenticate': 'Basic realm=\"Restricted Area\"' },
        });
    }

    return next();
}
