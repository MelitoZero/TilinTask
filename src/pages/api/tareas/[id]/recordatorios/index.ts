import { RecordatorioDAO } from '../../../../../daos/RecordatorioDAO';
import { RecordController } from '../../../../../controllers/RecordController';
import { TareaDAO } from '../../../../../daos/TareaDAO';
import { ListaDAO } from '../../../../../daos/ListaDAO';

//Se instancia el controlador de recordatorio con los daos ya inyectados
const recordatorioController = new RecordController(new RecordatorioDAO(), new TareaDAO(), new ListaDAO());
//Se exportan los métodos para endpoints
export const GET = recordatorioController.obtenerPorTarea;
export const POST = recordatorioController.crear;