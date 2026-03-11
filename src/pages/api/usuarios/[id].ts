import type { APIRoute } from 'astro';
import { UsuarioDAO } from '../../../daos/UsuarioDAO';
import bcrypt from 'bcryptjs';

const usuarioDAO = new UsuarioDAO();

// Ruta para obtener un usuario por su ID.
export const GET: APIRoute = async ({ params }) => {

    try {
        //Se obtiene el id del usuario desde la url.
        const idBuscado = String(params.id);
        //Si no se proporciona un id, se devuelve un error.
        if(!idBuscado) {
            return new Response(JSON.stringify({ error: 'ID de usuario no proporcionado' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        //Se busca el usuario por su id.
        const usuario = await usuarioDAO.obtenerPorId(idBuscado);
        //Si no se encuentra el usuario, se devuelve un error.
        if(!usuario) {
            return new Response(JSON.stringify({ error: 'Usuario no encontrado' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        //Si se encuentra el usuario, se devuelve su información.
        const datosSeguros = {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email
        };
        return new Response(JSON.stringify({ usuario: datosSeguros }),
            { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error al obtener el usuario por ID:', error);
        return new Response(JSON.stringify({ error: 'Falla interna del servidor.' }),
            { status: 500 });
    }
};

//Ruta para actualizar un usuario por su ID.
export const PATCH: APIRoute = async ({ params, request }) => {

    try {
        //Se obtiene el id del usuario desde la url.
        const idBuscado = String(params.id);
        //Si no se proporciona un id, se devuelve un error.
        if(!idBuscado) {
            return new Response(JSON.stringify({ error: 'ID de usuario no proporcionado' }),
                { status: 400 });
        }
        //Se obtienen los datos del cuerpo de la solicitud.
        const body = await request.json();
        const datosActualizados: any = {};
        //Se validan y actualizan los campos proporcionados.
        if(body.name) {
            datosActualizados.name = body.name.trim();
        }
        //Si se proporciona una nueva contraseña, se valida y se hashea antes de actualizar.
        if(body.passwd) {
            if(body.passwd.length < 8) {
                return new Response(JSON.stringify({ error: 'La contraseña debe tener al menos 8 caracteres.' }),
                { status: 400 });
            }
            const salt = await bcrypt.genSalt(10);
            datosActualizados.passwd = await bcrypt.hash(body.passwd, salt);
        }
        //Verifica que se hayan proporcionado datos para actualizar.
        if(Object.keys(datosActualizados).length === 0) {
            return new Response(JSON.stringify({ error: 'No se dieron datos para actualizar.' }),
                { status: 400 });
        }
        //Se actualiza el usuario en la base de datos.
        const usuarioActualizado = await usuarioDAO.actualizar(idBuscado, datosActualizados);
        return new Response(JSON.stringify({ mensaje: 'Datos de usuario actualizados exitosamente.', usuario: usuarioActualizado}),
            { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        return new Response(JSON.stringify({ error: 'Falla interna del servidor.' }),
            { status: 500 });
    }
};

//Ruta para eliminar un usuario por su ID.
export const DELETE: APIRoute = async ({ params }) => {

    try {
        //Se obtiene el id del usuario desde la url.
        const idBuscado = String(params.id);
        //Si no se proporciona un id, se devuelve un error.
        if(!idBuscado) {
            return new Response(JSON.stringify({ error: 'ID de usuario no proporcionado' }),
            { status: 400 });
        }
        //Se llama al DAO para eliminar el usuario.
        await usuarioDAO.eliminar(idBuscado);
        return new Response(JSON.stringify({ mensaje: 'Usuario eliminado exitosamente.' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error al eliminar el usuario:', error);
        return new Response(JSON.stringify({ error: 'Falla interna del servidor.' }),
            { status: 500 });
    }
};