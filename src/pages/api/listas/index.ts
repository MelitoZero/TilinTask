import type { APIRoute } from 'astro';
import { ListaDAO } from '../../../daos/ListaDAO';

const listaDAO = new ListaDAO();

//Ruta para obtener las listas del usuario autenticado
export const GET: APIRoute = async ({ locals }) => {

    try {
        //Obtiene el id del usuario autenticado desde los locals
        const idUsuario = locals.usuario?.id;
        //Si no hay un usuario autenticado, se responde con un error 401
        if(!idUsuario) {
            return new Response(JSON.stringify({ error: 'Usuario no autenticado. Autentificate primero.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        //Obtiene las listas del usuario autenticado
        const listasU = await listaDAO.obtenerPorUsuario(idUsuario);
        return new Response(JSON.stringify({ listas: listasU}),
            { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error al obtener las listas:', error);
        return new Response(JSON.stringify({ error: 'Fallo interno del servidor' }),
            { status: 500 });
    }
};

//Ruta pra crar una nueva lista
export const POST: APIRoute = async ({ request, locals }) => {

    try {
        //Obtiene el id del usuario autenticado desde los locals
        const idUsuario = locals.usuario?.id;
        if(!idUsuario) {
            return new Response(JSON.stringify({ error: 'Usuario no autenticado. Autentificate primero.' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        //Se obtiene los datos del cuerpo de la petición
        const body = await request.json();
        const { titulo, descripcion } = body;
        //Validación de los datos recibidos
        if(!titulo) {
            return new Response(JSON.stringify({ error: 'El título es obligatorio.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        //Limpieza de los datos para evitar fallos
        const tituloLimpio = titulo.trim().replace(/[<>]/g, ' ');
        const descripcionLimpia = descripcion ? descripcion.trim().replace(/[<>]/g, ' ') : null;
        //Se crea la nueva lista con el id del usuario autenticado
        const nuevaLista = await listaDAO.crearLista({
            name: tituloLimpio, descrip: descripcionLimpia,
            idUser: idUsuario
        });
        return new Response(JSON.stringify({ message: 'Lista creada exitosamente.', lista: nuevaLista }),
            { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error('Error al crear la lista:', error);
        return new Response(JSON.stringify({ error: 'Fallo interno del servidor' }),
            { status: 500 });
    }
};