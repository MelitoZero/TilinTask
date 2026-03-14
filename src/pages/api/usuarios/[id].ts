import { UsuarioDAO } from '../../../daos/UsuarioDAO';
import { UsuarioController } from '../../../controllers/UsuarioController';

//Se instancia el controlador de usuarios con el dao de usuarios ya inyectado
const usuarioController = new UsuarioController(new UsuarioDAO());
//Se exportan los métodos para hacerlos un endpoint
export const GET = usuarioController.obtenerUsuario;
export const PATCH = usuarioController.actualizarUsuario;
export const DELETE = usuarioController.eliminarUsuario;