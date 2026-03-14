import type { APIRoute } from 'astro';
import type { IUsuario } from '../interfaces/IUsuario';
import { Responder } from '../helpers/Responder';
import bcrypt from 'bcryptjs';

//Exportamos el controlador de usuario.
export class UsuarioController {
    //Se hace constructor con el dao ya inyectado.
    constructor(private usuarioDAO: IUsuario) {}
    //Método para registar usuarios.
    public registrar: APIRoute = async ({ request }) => { 
        //Lee el body de la solicitud y extrae el nombre, email y contraseña del nuevo usuario.
        const body = await request.json();
        const { name, email, passwd } = body;
        //Valida que el nombre, email y contraseña estén y cumplan con los requisitos.
        if(!name || !email || !passwd){
            return Responder.badRequest('Faltan datos o estan inccorectos.');
        }
        //Valida que el email tenga un formato correcto y que la contraseña tenga al menos 8 caracteres.
        const emailListo = email.trim().toLowerCase();
        const nameListo = name.trim().replace(/[<>]/g, ' ');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//Expresión regular para validar el formato del correo electrónico
        if (!emailRegex.test(emailListo)) {
            return Responder.badRequest('Correo electrónico no válido.');
        }
        const usuarioExistente = await this.usuarioDAO.obtenerPorEmail(emailListo);
        if(usuarioExistente) {
            return Responder.badRequest('El correo electrónico ya está registrado.');                    
        }
        //Valida que la contraseña tenga al menos 8 caracteres.
        if (passwd.length < 8) {
            return Responder.badRequest('La contraseña debe tener al menos 8 caracteres.');
        }
        //Si la contraseña tiene una longitud adecuada, se genera un hash de la contraseña.
        const salt = await bcrypt.genSalt(10);
        const passwdHash = await bcrypt.hash(passwd, salt);
        //Crea el nuevo usuario en la base de datos.
        const nuevoUsuario = await this.usuarioDAO.crear({name: nameListo, email: emailListo, passwd: passwdHash});
        return Responder.creado(nuevoUsuario, 'Usuario registrado exitosamente.');
    };
    //Método para obtener usuarios.
    public obtenerUsuario: APIRoute = async ({ params, locals }) => {
        //Se obtiene el id del usuario desde la url y de locals
        const idBuscado = String(params.id);
        const idLogueado = locals.usuario?.id;
        //Si no se proporciona un id, se devuelve un error. O si no se proporciona el id correcto
        if(!idBuscado) return Responder.badRequest('ID de usuario no proporcionado.');
        if(idBuscado !== idLogueado) return Responder.prohibido();
        //Se busca el usuario por su id.
        const usuario = await this.usuarioDAO.obtenerPorId(idBuscado);
        //Si no se encuentra el usuario, se devuelve un error.
        if(!usuario) return Responder.noEncontrado('El usuario no existe.');
        //Si se encuentra el usuario, se devuelve su información.
        const datosSeguros = {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email
        };
        return Responder.ok(datosSeguros, 'El usuario se obtuvo exitosamente.');
    };
    //Método para actualizar usuarios.
    public actualizarUsuario: APIRoute = async ({ params, request, locals }) => {
        //Se obtiene el id del usuario desde la url y de locals
        const idBuscado = String(params.id);
        const idLogueado = locals.usuario?.id;
        //Si no se proporciona un id, se devuelve un error. O si no se proporciona el id correcto
        if(!idBuscado) return Responder.badRequest('ID de usuario no proporcionado.');
        if(idBuscado !== idLogueado) return Responder.prohibido();
        //Se obtienen los datos del cuerpo de la solicitud.
        const body = await request.json();
        const datosActualizados: any = {};
        //Se validan y actualizan los campos proporcionados.
        if(body.name) {
            datosActualizados.name = body.name.trim().replace(/[<>]/g, ' ');
        }
        //Si se proporciona una nueva contraseña, se valida y se hashea antes de actualizar.
        if(body.passwd) {
            if(body.passwd.length < 8) {
                return Responder.badRequest('La contraseña debe tener al menos 8 caracteres.');
            }
            const salt = await bcrypt.genSalt(10);
            datosActualizados.passwd = await bcrypt.hash(body.passwd, salt);
        }
        //Verifica que se hayan proporcionado datos para actualizar.
        if(Object.keys(datosActualizados).length === 0) {
            return Responder.badRequest('No se encontraron datos para actualizar.');
        }
        //Se actualiza el usuario en la base de datos.
        const usuarioActualizado = await this.usuarioDAO.actualizar(idBuscado, datosActualizados);
        return Responder.ok(usuarioActualizado, 'El usuario se actualizó exitosamente.');
    };
    //Método para eliminar usuarios.
    public eliminarUsuario: APIRoute = async ({ params, locals }) => {
        //Se obtiene el id del usuario desde la url y de locals
        const idBuscado = String(params.id);
        const idLogueado = locals.usuario?.id;
        //Si no se proporciona un id, se devuelve un error. O si no se proporciona un id correcto
        if(!idBuscado) return Responder.badRequest('ID de usuario no proporcionado.');
        if(idBuscado !== idLogueado) return Responder.prohibido();
        //Se llama al DAO para eliminar el usuario.
        await this.usuarioDAO.eliminar(idBuscado);
        return Responder.ok({}, 'El usuario se eliminó exitosamente.');
    };
}