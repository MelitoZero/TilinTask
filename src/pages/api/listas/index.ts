import { ListaDAO } from '../../../daos/ListaDAO';
import { ListaController } from '../../../controllers/ListaController';

//Instancia de controlador de lista con dao de lista ya inyectado
const listaController = new ListaController(new ListaDAO());
//Se exportan métodos para endpoints
export const GET = listaController.obtenerListasU;
export const POST = listaController.crearLista;