import { TareaDAO } from '../../../../../daos/TareaDAO';
import { ListaDAO } from '../../../../../daos/ListaDAO';
import { TareaController } from '../../../../../controllers/TareaController';

//Instancia de controlador de tarea con daos de tarea y lista ya inyectados
const tareaController = new TareaController(new TareaDAO(), new ListaDAO());
//Se exportan los método para endpoints
export const GET = tareaController.obtenerPorLista;
export const POST = tareaController.crearTarea;
