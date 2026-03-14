import type { APIRoute } from 'astro';
import type { IUsuario } from '../interfaces/IUsuario';
import { Responder } from '../helpers/Responder';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

//Se obtiene la clave secreta para el jwt.
const SECRET_KEY = import.meta.env.JWT_SECRET;

export class AuthController {
    //Constructor que inicia con dao ya inyectado.
    constructor(private usuarioDAO: IUsuario) {}
    //Funcion arrow para el login.
    public login: APIRoute = async ({ request, cookies }) => {
        //Se lee el body de la solicitud y se extrae el correo y contraseña.
        const body = await request.json();
        const { email, passwd } = body;
        //Se valida que se envie correo y la contraseña y no este vacio.
        if (!email || !passwd) return Responder.badRequest('Faltan datos o estan inccorectos.');
        //Se verifica que el correo este bien.
        const emailLimpio = body.email.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailLimpio)) return Responder.badRequest('Correo electrónico no válido.');
        //Se busca el usuario por su email.
        const usuario = await this.usuarioDAO.obtenerPorEmail(emailLimpio);
        if (!usuario) return Responder.badRequest('Credenciales inválidas.');
        //Valida que la contraseña tenga al menos 8 caracteres.
        if (passwd.length < 8) return Responder.badRequest('La contraseña debe tener al menos 8 caracteres.');
        //Se compara la contraseña dada con la almacenada con la bd.
        const passwdValida = await bcrypt.compare(passwd, usuario.passwd);
        if(!passwdValida) return Responder.badRequest('Credenciales inválidas.');
        //Si las credenciales son validas se genera un token JWT.
        const tokenPayload = {id: usuario.id, name: usuario.name};
        const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '12h' });
        //Se guarda el token en una cookies HTTPOnly para mayor seguridad.
        cookies.set('sesion_jwt', token, {httpOnly: true, secure: true, sameSite: 'strict',
            path: '/', maxAge: 60 * 60 *12 });
        return Responder.ok({usuario: { id: usuario.id, name: usuario.name }}, 'Inicio de sesión exitoso.');
    };
    //Función arrow para el logout.
    public logout: APIRoute = async ({ cookies }) => {
        //Elimina la cookie de sesion JWT.
        cookies.delete('sesion_jwt', { path: '/' });
        return Responder.ok({}, 'Sesión cerrada exitosamente.');
    };
}