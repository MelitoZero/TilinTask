import { ReconocimientoDAO } from '../../../daos/ReconocimientoDAO';
import { ReconController } from '../../../controllers/ReconController';

//Se instancia el controlador de reconocimiento con el dao de reconocimiento ya inyectado
const reconocimientoController = new ReconController(new ReconocimientoDAO());
//Se exporta el método para hacerlo un endpoint
export const GET = reconocimientoController.obtenerReconocimientos;