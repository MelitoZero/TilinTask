import { UsuarioDAO } from '../../../daos/UsuarioDAO';
import { UsuarioController } from '../../../controllers/UsuarioController';

//Se instancia el controlador de usuario con el dao de usuario ya inyectado
const usuarioController = new UsuarioController(new UsuarioDAO());
//Se exporta el método para hacerlo un endpoint
export const POST = usuarioController.registrar;