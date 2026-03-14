import { TareaDAO } from '../../../daos/TareaDAO';
import { ListaDAO } from '../../../daos/ListaDAO';
import { TareaController } from '../../../controllers/TareaController';

//Se instancia el controlador de tarea con los daos ya inyectados
const tareaController = new TareaController(new TareaDAO(), new ListaDAO());
//Se exportan los métodos para endpoints
export const GET = tareaController.obtenerPorId;
export const PATCH = tareaController.actualizarTarea;
export const DELETE = tareaController.eliminarTarea;