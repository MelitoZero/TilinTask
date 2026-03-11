import type { APIRoute } from 'astro';
import { UsuarioDAO } from '../../../daos/UsuarioDAO';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const usuarioDAO = new UsuarioDAO();
const SECRET_KEY = import.meta.env.JWT_SECRET;

export const POST: APIRoute = async ({ request, cookies }) => {
    //Verifica que la variable de entorno exista, si no, devuelve un error de configuración del servidor.
    if (!SECRET_KEY) {
        console.error("Falta la variable de entorno JWT_SECRET.");
        return new Response(JSON.stringify({ error: 'Falla interna de configuración del servidor.' }),
            { status: 500 });
    }

    try {
        //Se lee el cuerpo de la solicitud y extrae el email y la contraseña.
        const body = await request.json();
        const { email, passwd } = body;
        //Se valida que el email y la contraseña estén presentes.
        if (!email || !passwd) {
            return new Response(JSON.stringify({ error: 'Email y contraseña son requeridos.' }),
                { status: 400 });
        }
        const emailLimpio = email.trim().toLowerCase();
        //Se busca el usuario por su email.
        const usuario = await usuarioDAO.obtenerPorEmail(emailLimpio);
        if (!usuario) {
            return new Response(JSON.stringify({ error: 'Credenciales inválidas.' }),
                { status: 401 });
        }
        //Se compara la contraseña proporcionada con la contraseña almacenada en la base de datos.
        const passwdValida = await bcrypt.compare(passwd, usuario.passwd);
        if (!passwdValida) {
            return new Response(JSON.stringify({ error: 'Credenciales inválidas.' }),
                { status: 401 });
        }
        //Si las credenciales son válidas, se genera un token JWT.
        const tokenPayload = {
            id: usuario.id,
            name: usuario.name
        };
        //Se firma el token y se establece una fecha de expiración.
        const token = jwt.sign(tokenPayload, SECRET_KEY, { expiresIn: '12h'});
        //Se guarda el token en una cookie HTTPOnly para mayor seguridad.
        cookies.set('sesion_jwt', token, {
            httpOnly: true, //La cookie no será accesible desde JavaScript del lado del cliente.
            secure: true, //La cookie solo se enviará a través de conexiones seguras (HTTPS)
            sameSite: 'strict', //La cookie solo se enviará en solicitudes del mismo sitio
            path: '/', //La cookie estará disponible en toda la pagina
            maxAge: 60 * 60 * 12 //12 horas en segundos
        });
        //Se devuelve una respuesta exitosa con el token.
        return new Response(JSON.stringify({ message: 'Inicio de sesión exitoso.',
            usuario: {id: usuario.id, name: usuario.name, email: usuario.email } }),
            { status: 200 });

    } catch (error) {
        console.error("Fallo el login:", error);
        return new Response(JSON.stringify({ error: 'Falla interna del servidor.' }),
            { status: 500 });
    }
}