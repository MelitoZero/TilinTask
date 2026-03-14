import { defineMiddleware } from 'astro:middleware';
import jwt from 'jsonwebtoken';

//Se obtiene la clave secreta de las variables de entorno
const SECRET_KEY = import.meta.env.JWT_SECRET;
//Se definen las rutas no protegidas
const RUTAS_PUBLICAS = ['/login', '/registro', '/api/auth/login', '/api/usuarios', '/'];

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, cookies, redirect, locals } = context;
    const path = url.pathname;

    try{
        //Si la ruta es pública, se permite el acceso sin autenticación
        if(RUTAS_PUBLICAS.includes(path)) {
            return await next();
        }
        //Si la ruta no es pública, se verifica el token JWT
        const token = cookies.get('sesion_jwt')?.value;
        //Si no hay token, se redirige al login
        const rebotaUsuario = () => {
            //Si la ruta es una API, se devuelve un error JSON en lugar de redirigir
            if(path.startsWith('/api/')) {
                return new Response(JSON.stringify({ error: 'No autenticado' }),
                    { status: 401, headers: { 'Content-Type': 'application/json' } });
            }
            // Redirige al login para rutas no API
            return redirect('/login');
        };
        //Se redirige al login
        if(!token) return rebotaUsuario();
        //Si hay token, se verifica el token JWT
        try {
            //Si el token es válido, se decodifica
            const usuarioDecodificado = jwt.verify(token, SECRET_KEY) as { id: string; name: string; };
            locals.usuario = usuarioDecodificado; // Se almacena el usuario decodificado en locals para su uso posterior
        } catch(errorToken) {
            //Si el token no es válido, se borra la cookie y se redirige al login
            cookies.delete('sesion_jwt', { path: '/'});
            return rebotaUsuario();
        }
        //Si es correcto el token se ejecuta la ruta protegida
        return await next();

    } catch(errorGlobal) {
        //Atrapa todos los errores globale de los controladores
        console.error(`Fallo interno del servidor capturado en: [${context.request.method} ${path}]`);
        console.error(errorGlobal);
        if(path.startsWith('/api/')) {
            return new Response(JSON.stringify({ error: 'Falla interna del servidor.' }), 
            { status: 500, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ error: 'Error 500: Fallo en cargar el servidor.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
});