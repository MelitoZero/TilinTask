import type { APIRoute } from 'astro';
import type { ITarea } from '../interfaces/ITarea';
import type { ILista } from '../interfaces/ILista';
import { Responder } from '../helpers/Responder';

//Exportamos el controlador de tareas.
export class TareaController {
    //Se crea el constructor con el dao de tareas y listas ya inyectado.
    constructor(private tareaDAO: ITarea, private listaDAO: ILista) {}
    //Método para listar tareas de una lista especifica
    public obtenerPorLista: APIRoute = async ({ params, locals }) => {
        //Se obtiene el id de la lista y el id de usuario
        const idUsuario = locals.usuario?.id;
        const idLista = Number(params.id);
        //Se verifica que este autorizado
        if(!idUsuario) return Responder.noAutorizado();
        if(!idLista) return Responder.badRequest('No hay id de lista.');
        //Se verifica que la lista pertenece al usurio
        const lista = await this.listaDAO.obtenerPorId(idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();
        //Se obtiene las tareas de la lista
        const tareas = await this.tareaDAO.obtenerPorLista(idLista);
        return Responder.ok(tareas, 'Tareas obtenidas exitosamente.');
        
    };
    //Método para obtener una sola tarea especifica
    public obtenerPorId: APIRoute = async ({ params, locals }) => {
        //Se obtiene el id de la tarea y el id de usuario
        const idTarea = String(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que este autorizado
        if(!idUsuario) return Responder.noAutorizado();
        if(!idTarea) return Responder.badRequest('No hay id de tarea.');
        //Se obtiene la tarea
        const tarea = await this.tareaDAO.obtenerPorId(idTarea);
        if(!tarea) return Responder.noEncontrado('No se encontró la tarea.');
        //Se verifica que pertenezca al usuario
        const lista = await this.listaDAO.obtenerPorId(tarea.idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();;
        //Se devuelve la tarea
        return Responder.ok(tarea, 'Tarea obtenida exitosamente.');
    };    
    //Método para crear tareas.
    public crearTarea: APIRoute = async ({ params, request, locals }) => {
        //Se obtiene el id de lista y usuario
        const idUsuario = locals.usuario?.id;
        const idLista = Number(params.id);
        //Se verifica que tenga autorización o este logueado el usuario
        if(!idUsuario) return Responder.noAutorizado();
        if(!idLista) return Responder.badRequest('No hay id de lista.');
        //Se consulta la lista
        const lista = await this.listaDAO.obtenerPorId(idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();
        //Se obtienes los datos del body 
        const body = await request.json();
        if(!body.titulo) return Responder.badRequest('El título es obligatorio.');
        //Se crea la nueva tarea
        const nuevaTarea = await this.tareaDAO.crearTarea({
            titulo: body.titulo.trim().replace(/[<>]/g, ' '), descrip: body.descripcion ? body.descripcion.trim().replace(/[<>]/g, ' ') : null,
            idLista: idLista, fechaInicio: body.fechaInicio, fechaLimite: body.fechaLimite, estado: body.estado, idUser: idUsuario });
        return Responder.creado(nuevaTarea, 'Tarea creada exitosamente.');
    };
    //Método para actualizar una tarea
    public actualizarTarea: APIRoute = async ({ request, params, locals }) => {
        //Se obtiene el id de lista y usuario
        const idTarea = String(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que tenga autorización
        if(!idUsuario) return Responder.noAutorizado();
        if(!idTarea) return Responder.badRequest('No hay id de tarea.');
        //Se crea la tarea y se verifica el dueño
        const tarea = await this.tareaDAO.obtenerPorId(idTarea);
        if(!tarea) return Responder.noEncontrado('No se encontró la tarea.');
        const lista = await this.listaDAO.obtenerPorId(tarea.idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();
        //Se obtienen los datos del body del usuario
        const body = await request.json();
        const datosActualizados: any = {};
        //Se limpian los datos
        if(body.titulo) datosActualizados.titulo = body.titulo.trim().replace(/[<>]/g, ' ');
        if(body.descrip !== undefined) datosActualizados.descrip = body.descripcion ? body.descripcion.trim().replace(/[<>]/g, ' ') : null;
        if(body.estado) datosActualizados.estado = body.estado.trim().replace(/[<>]/g, ' ');
        //En caso de meter una validación booleana de tarea completa implementar abajo
        //Se verifica que haya datos a actualizar
        if(Object.keys(datosActualizados).length === 0) return Responder.badRequest('No se encontraron datos para actualizar.');
        //Se actualiza la tarea
        const tareaActualizada = await this.tareaDAO.actualizar(idTarea, datosActualizados);
        return Responder.ok(tareaActualizada, 'Tarea actualizada exitosamente.');
    };
    //Método para eliminar una tarea
    public eliminarTarea: APIRoute = async ({ params, locals }) => {
        //Se obtiene el id de lista y usuario
        const idTarea = String(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que tenga autorización
        if(!idUsuario) return Responder.noAutorizado();
        if(!idTarea) return Responder.badRequest('No hay id de tarea.');
        //Se crea la tarea y se verifica el dueño
        const tarea = await this.tareaDAO.obtenerPorId(idTarea);
        if(!tarea) return Responder.noEncontrado('No se encontró la tarea.');
        const lista = await this.listaDAO.obtenerPorId(tarea.idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();
        //Se elimina la tarea
        await this.tareaDAO.eliminar(idTarea);
        return Responder.ok({}, 'Tarea eliminada exitosamente.');
    };
}