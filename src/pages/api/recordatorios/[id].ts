import { RecordatorioDAO } from '../../../daos/RecordatorioDAO';
import { RecordController } from '../../../controllers/RecordController';
import { TareaDAO } from '../../../daos/TareaDAO';
import { ListaDAO } from '../../../daos/ListaDAO';

//Se instancia el controlador de recordatorios con el dao inyectado
export const recordController = new RecordController(new RecordatorioDAO(), new TareaDAO(), new ListaDAO());
//Se exportan los métodos para endpoints
export const GET = recordController.obtenerPorId;
export const PATCH = recordController.actualizar;
export const DELETE = recordController.eliminar;