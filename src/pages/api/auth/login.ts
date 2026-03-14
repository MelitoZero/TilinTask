import { UsuarioDAO } from '../../../daos/UsuarioDAO';
import { AuthController } from '../../../controllers/AuthController';

//Se instancia el controlador de autenticación con el dao ya inyectado
const authController = new AuthController(new UsuarioDAO);
//Se exporta el método para hacerlo un endpoint
export const POST = authController.login;