import type { APIRoute } from 'astro';
import type { IRecordatorio } from '../interfaces/IRecordatorio';
import type { ITarea } from '../interfaces/ITarea';
import type { ILista } from '../interfaces/ILista';
import { Responder } from '../helpers/Responder';

//Exportamos el controlador de recordatorios.
export class RecordController {
    //Constructor con los 3 daos ya inyectados
    constructor(private recordatorioDAO: IRecordatorio, private tareaDAO: ITarea, private listaDAO: ILista) {}
    //Método para crear recordatorios
    public crear: APIRoute = async ({ params, request, locals }) => {
        //Se obtienen los ids de tarea y de usuario
        const idUsuario = locals.usuario?.id;
        const idTarea = String(params.id);
        //Se verifica que tenga autorización
        if(!idUsuario) return Responder.noAutorizado();
        if(!idTarea) return Responder.badRequest('No hay id de tarea.');
        //Se verifica bien para quien es el recordatorio
        const tarea = await this.tareaDAO.obtenerPorId(idTarea);
        if(!tarea) return Responder.noEncontrado('No se encontró la tarea.');
        const lista = await this.listaDAO.obtenerPorId(tarea.idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();
        //Se obtiene el body
        const body = await request.json();
        if(!body.fechaAlerta) return Responder.badRequest('La fecha es obligatoria.');
        //Se crea el recordatorio
        const nuevoRecordatorio = await this.recordatorioDAO.crearRecordatorio({idTarea: idTarea, fechaAlerta: body.fechaAlerta,
            fechaAlerta2: body.fechaAlerta2, fechaAlerta3: body.fechaAlerta3 });
        return Responder.creado(nuevoRecordatorio, 'Recordatorio creado exitosamente.');
    };
    //Método para obtener recordatorios de una tarea
    public obtenerPorTarea: APIRoute = async ({ params, locals }) => {
        //Se obtienes los ids
        const idTarea = String(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que tenga autorización
        if(!idUsuario) return Responder.noAutorizado();
        if(!idTarea) return Responder.badRequest('No hay id de tarea.');
        //Se verifica a quien pertence el recordatorio
        const tarea = await this.tareaDAO.obtenerPorId(idTarea);
        if(!tarea) return Responder.noEncontrado('No se encontró la tarea.');
        const lista = await this.listaDAO.obtenerPorId(tarea.idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();
        //Se obtiene el recordatorio
        const recordatorio = await this.recordatorioDAO.obtenerPorTarea(idTarea);
        return Responder.ok(recordatorio, 'Recordatorio obtenido exitosamente.');
    };
    //Método para obtener un recordatorio en especifico
    public obtenerPorId: APIRoute = async ({ params, locals }) => {
        //se obtienen los ids
        const idRecord = Number(params.id);
        const idUsuario = locals.usuario?.id;
        //Se verifica que tenga autorización
        if(!idUsuario) return Responder.noAutorizado();
        if(!idRecord) return Responder.badRequest('No hay id de recordatorio.');
        //Se obtiene el recordatorio
        const recordatorio = await this.recordatorioDAO.obtenerPorId(idRecord);
        if(!recordatorio) return Responder.noEncontrado('No se encontró el recordatorio.');
        //Se verifica a quien pertenece
        const tarea = await this.tareaDAO.obtenerPorId(recordatorio.idTarea);
        if(!tarea) return Responder.noEncontrado('No se encontró la tarea.');
        const lista = await this.listaDAO.obtenerPorId(tarea.idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();
        //Se devuelve el recordatorio
        return Responder.ok(recordatorio, 'Recordatorio obtenido exitosamente.');
    };
    //Método para actualizar recordatorios
    public actualizar: APIRoute = async ({ params, request, locals }) => {
        //Se obtienen los ids
        const idUsuario = locals.usuario?.id;
        const idRecord = Number(params.id);
        //Se verifica que tenga autorización
        if(!idUsuario) return Responder.noAutorizado();
        if(!idRecord) return Responder.badRequest('No hay id de recordatorio.');
        //se verifica el dueño
        const recordatorio = await this.recordatorioDAO.obtenerPorId(idRecord);
        if(!recordatorio) return Responder.noEncontrado('No se encontró el recordatorio.');
        const tarea = await this.tareaDAO.obtenerPorId(recordatorio.idTarea);
        if(!tarea) return Responder.noEncontrado('No se encontró la tarea.');
        const lista = await this.listaDAO.obtenerPorId(tarea.idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();
        //Se obtiene los datos del body
        const body = await request.json();
        const datosActualizados: any = {};
        if(body.fechaAlerta) datosActualizados.fechaAlerta = body.fechaAlerta;
        if(body.fechaAlerta2) datosActualizados.fechaAlerta2 = body.fechaAlerta2;
        if(body.fechaAlerta3) datosActualizados.fechaAlerta3 = body.fechaAlerta3;
        //Se verifica que haya datos para actualizar
        if(Object.keys(datosActualizados).length === 0) return Responder.badRequest('No se encontraron datos para actualizar.');
        //Se actualiza el recordatorio
        const recordatorioActualizado = await this.recordatorioDAO.actualizar(idRecord, datosActualizados);
        return Responder.ok(recordatorioActualizado, 'Recordatorio actualizado exitosamente.');
    };
    //Método para eliminar recordatorios
    public eliminar: APIRoute = async ({ params, locals }) => {
        //Se obtienen los ids
        const idUsuario = locals.usuario?.id;
        const idRecord = Number(params.id);
        //Se verifica que tenga autorización
        if(!idUsuario) return Responder.noAutorizado();
        if(!idRecord) return Responder.badRequest('No hay id de recordatorio.');
        //Se verifica el dueño
        const recordatorio = await this.recordatorioDAO.obtenerPorId(idRecord);
        if(!recordatorio) return Responder.noEncontrado('No se encontró el recordatorio.');
        const tarea = await this.tareaDAO.obtenerPorId(recordatorio.idTarea);
        if(!tarea) return Responder.noEncontrado('No se encontró la tarea.');
        const lista = await this.listaDAO.obtenerPorId(tarea.idLista);
        if(!lista || lista.idUser !== idUsuario) return Responder.prohibido();
        //Se elimina el recordatorio
        await this.recordatorioDAO.eliminar(idRecord);
        return Responder.ok({}, 'Recordatorio eliminado exitosamente.');
    };
}