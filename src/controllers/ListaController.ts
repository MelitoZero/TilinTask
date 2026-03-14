import type { APIRoute } from 'astro';
import type { ILista } from '../interfaces/ILista';
import { Responder } from '../helpers/Responder';


//Exportamos el controlador de lista
export class ListaController {
    //Se crea el constructor con el dao de listas ya inyectado
    constructor(private listaDAO: ILista) {}

    //Método para obtener todas las listas del usuario
    public obtenerListasU: APIRoute = async ({ locals }) => {
         //Obtiene el id del usuario autenticado desde los locals
        const idUsuario = locals.usuario?.id;
        //Si no hay un usuario autenticado, se responde con un error 401
        if(!idUsuario) return Responder.noAutorizado('No tienes autorización.');
        //Obtiene las listas del usuario autenticado
        const listasU = await this.listaDAO.obtenerPorUsuario(idUsuario);
        return Responder.ok(listasU, 'Listas obtenidas exitosamente.');
    };
    //Método para crear una nueva lista
    public crearLista: APIRoute = async ({ request, locals }) => {
        //Obtiene el id del usuario autenticado desde los locals
        const idUsuario = locals.usuario?.id;
        if(!idUsuario) return Responder.noAutorizado('No tienes autorización.');
        //Se obtiene los datos del cuerpo de la petición
        const body = await request.json();
        const { titulo, descripcion } = body;
        //Validación de los datos recibidos
        if(!titulo) return Responder.badRequest('El título es obligatorio.');
        //Limpieza de los datos para evitar fallos
        const tituloLimpio = titulo.trim().replace(/[<>]/g, ' ');
        const descripcionLimpia = descripcion ? descripcion.trim().replace(/[<>]/g, ' ') : null;
        //Se crea la nueva lista con el id del usuario autenticado
        const nuevaLista = await this.listaDAO.crearLista({
            name: tituloLimpio, descrip: descripcionLimpia,
            idUser: idUsuario
        });
        return Responder.creado(nuevaLista, 'Lista creada exitosamente.');
    };
    //Método para obtener la lista del usuario busca
    public obtenerLista: APIRoute = async ({ params, locals }) => {
        //Se obtiene el id de la lista desde param y el id del usuario desde locals
        const idLista = Number(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que exista sesión y lista
        if(!idUsuario) return Responder.noAutorizado('No tienes autorización.');
        if(!idLista) return Responder.badRequest('No hay id de lista.');
        //Se obtiene la lista por su id
        const lista = await this.listaDAO.obtenerPorId(idLista);
        //Se verifica que se devuelva una lista
        if(!lista) return Responder.noEncontrado('No se encontró la lista.');
        //Se verifica que la lista pertenezca al usuario autenticado
        if(lista.idUser !== idUsuario) return Responder.prohibido('No tienes autorización.');
        //Se devuelve la lista
        return Responder.ok(lista, 'Lista obtenida exitosamente.');        
    };
    //Método para actualizar una lista
    public actualizarLista: APIRoute = async ({ request, params, locals }) => {
        //Se obtienen el id de lista y del usuario desde param y locals
        const idLista = Number(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que haya sesión de usuario
        if(!idUsuario) return Responder.noAutorizado('No tienes sesión iniciada.');
        //Se verifica que haya id de lista
        if(!idLista) return Responder.badRequest('No hay id de lista.');
        //Se verifica los datos antes de modificarlos
        const listaExistente = await this.listaDAO.obtenerPorId(idLista);
        if(!listaExistente) {
            return Responder.noEncontrado('No se encontró la lista.');
        }
        if(listaExistente.idUser !== idUsuario) return Responder.prohibido('No tienes autorización.');
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
            return Responder.badRequest('No se encontraron datos para actualizar.');
        }
        //Se actualiza la lista
        const listaActualizada = await this.listaDAO.actualizar(idLista, datosActualizados);
        return Responder.ok(listaActualizada, 'Lista actualizada exitosamente.');
    };
    //Método para eliminar una lista
    public eliminarLista: APIRoute = async ({ params, locals }) => {
        //Se obtienen el id de lista y del usuario desde param y locals
        const idLista = Number(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que haya sesión de usuario
        if(!idUsuario) return Responder.noAutorizado('No tienes sesión iniciada.');
        //Se verifica que haya id de lista
        if(!idLista) return Responder.badRequest('No hay id de lista.');
        //Se verifica que exista para asegurar el eliminado
        const listaExistente = await this.listaDAO.obtenerPorId(idLista);
        if(!listaExistente) return Responder.noEncontrado('No se encontró la lista.');
        if(listaExistente.idUser !== idUsuario) return Responder.prohibido('No tienes autorización.');
        //Se elimina la lista
        await this.listaDAO.eliminar(idLista);
        return Responder.ok({}, 'Lista eliminada exitosamente.');
    };
}