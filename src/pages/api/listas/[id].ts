import type { APIRoute } from 'astro';
import { ListaDAO } from '../../../daos/ListaDAO';

const listaDAO = new ListaDAO();

//Ruta para obtener las listas del usuario autenticado
export const GET: APIRoute = async ({ params, locals }) => {

    try {
        //Se obtiene el id de la lista desde param y el id del usuario desde locals
        const idLista = Number(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que exista sesión y lista
        if(!idUsuario) {
            return new Response(JSON.stringify({ error: 'No tienes sesión iniciada .' }),
                { status: 401, headers: { 'Content-Type': 'application/json' } });
        }
        if(!idLista) {
            return new Response(JSON.stringify({ error: 'No hay id de lista.' }),
                { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        //Se obtiene la lista por su id
        const lista = await listaDAO.obtenerPorId(idLista);
        //Se verifica que se devuelva una lista
        if(!lista) {
            return new Response(JSON.stringify({ error: 'No se encontró la lista.' }),
                { status: 404, headers: { 'Content-Type': 'application/json' } });
        }
        //Se verifica que la lista pertenezca al usuario autenticado
        if(lista.idUser !== idUsuario) {
            return new Response(JSON.stringify({ error: 'No tienes permiso para acceder a esta lista.' }),
                { status: 403, headers: { 'Content-Type': 'application/json' } });
        }
        return new Response(JSON.stringify({ lista }),
            { status: 200, headers: { 'Content-Type': 'application/json' } });
        
    } catch (error) {
        console.error('Error al obtener las lista:', error);
        return new Response(JSON.stringify({ error: 'Fallo interno del servidor' }),
            { status: 500 });
    }
};

//Ruta para actualizar lista
export const PATCH: APIRoute = async ({ request, params, locals }) => {

    try {
        //Se obtienen el id de lista y del usuario desde param y locals
        const idLista = Number(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que haya sesión de usuario
        if(!idUsuario) {
            return new Response(JSON.stringify({ error: 'No tienes sesión iniciada.' }),
                { status: 401 });
        }
        //Se verifica que haya id de lista
        if(!idLista) {
            return new Response(JSON.stringify({ error: 'No hay id de lista.' }),
                { status: 400 });
        }
        //Se verifica los datos antes de modificarlos
        const listaExistente = await listaDAO.obtenerPorId(idLista);
        if(!listaExistente) {
            return new Response(JSON.stringify({ error: 'No se encontró la lista.' }),
                { status: 404 });
        }
        if(listaExistente.idUser !== idUsuario) {
            return new Response(JSON.stringify({ error: 'No tienes permiso para modificar esta lista.' }),
                { status: 403 });
        }
        //Se obtienen los datos a actualizar
        const body = await request.json();
        const datosActualizados: any = {};
        //Se limpian los datos para evitar fallos
        if(body.titulo) {
            datosActualizados.name = body.titulo.trim().replace(/[<>]/g, ' ');
        }
        if(body.descripcion !== undefined) {
            datosActualizados.descrip = body.descripcion ? body.descripcion.trim().replace(/[<>]/g, ' ') : null;
        }
        //Se verifica que se haya mandado datos
        if(Object.keys(datosActualizados).length === 0) {
            return new Response(JSON.stringify({ error: 'No se encontraron datos para actualizar.' }),
                { status: 400 });
        }
        //Se actualiza la lista
        const listaActualizada = await listaDAO.actualizar(idLista, datosActualizados);
        return new Response(JSON.stringify({ message: 'Lista actualizada exitosamente.', lista: listaActualizada }),
            { status: 200 });

    } catch (error) {
        console.log("Error al actualizar lista:", error);
        return new Response(JSON.stringify({ error: 'Fallo interno del servidor' }),
            { status: 500 });
    }
};

//Ruta para eliminar lista
export const DELETE: APIRoute = async ({ params, locals }) => {

    try {
        //Se obtienen el id de lista y del usuario desde param y locals
        const idLista = Number(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que haya sesión de usuario
        if(!idUsuario) {
            return new Response(JSON.stringify({ error: 'No tienes sesión iniciada.' }),
                { status: 401 });
        }
        //Se verifica que haya id de lista
        if(!idLista) {
            return new Response(JSON.stringify({ error: 'No hay id de lista.' }),
                { status: 400 });
        }
        //Se verifica que exista para asegurar el eliminado
        const listaExistente = await listaDAO.obtenerPorId(idLista);
        if(!listaExistente) {
            return new Response(JSON.stringify({ error: 'No se encontró la lista.' }),
                { status: 404 });
        }
        if(listaExistente.idUser !== idUsuario) {
            return new Response(JSON.stringify({ error: 'No tienes permiso para eliminar esta lista.' }),
                { status: 403 });
        }
        //Se elimina la lista
        await listaDAO.eliminar(idLista);
        return new Response(JSON.stringify({ message: 'Lista eliminada exitosamente.' }),
            { status: 200 });

    } catch (error) {
        console.log("Error al eliminar lista:", error);
        return new Response(JSON.stringify({ error: 'Fallo interno del servidor' }),
            { status: 500 });
    }
};