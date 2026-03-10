import type { APIRoute } from 'astro';
import { UsuarioDAO } from '../../../daos/UsuarioDAO';

const usuarioDAO = new UsuarioDAO();

export const POST: APIRoute = async ({ request }) => {
    try {
        
        const body = await request.json();
        const { name, email, passwd } = body;

        if(!name || !email || !passwd){
            return new Response(JSON.stringify({error: 'Faltan datos. Acompleta todo los campos'}),
                { status: 400, headers: { 'Content-Type': 'application/json' }});
        }

        const nuevoUsuario = await usuarioDAO.crear({name, email, passwd});
        return new Response(JSON.stringify({mensaje: 'Usuario resgistrado exitosamente', usuario: nuevoUsuario}), {
            status: 201,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error: any) {
        if (error.code === '23505') {
            return new Response(JSON.stringify({ error: 'El correo ya está registrado, use otro.'}), {
                status: 409,
                headers: { 'Content-Type': 'application/json' }
            });
        }
        console.error('Error al registrar usuario:', error);
        return new Response(JSON.stringify({ error: 'Error al registrar usuario' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
};