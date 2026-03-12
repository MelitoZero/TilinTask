import type { APIRoute } from 'astro';
import { UsuarioDAO } from '../../../daos/UsuarioDAO';
import bcrypt from 'bcryptjs';

const usuarioDAO = new UsuarioDAO();

export const POST: APIRoute = async ({ request }) => {
    
    try {
        //Lee el body de la solicitud y extrae el nombre, email y contraseña del nuevo usuario.
        const body = await request.json();
        const { name, email, passwd } = body;
        //Valida que el nombre, email y contraseña estén y cumplan con los requisitos.
        if(!name || !email || !passwd){
            return new Response(JSON.stringify({error: 'Faltan datos. Acompleta todo los campos'}),
                { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        //Valida que el email tenga un formato correcto y que la contraseña tenga al menos 8 caracteres.
        const emailListo = email.trim().toLowerCase();
        const nameListo = name.trim().replace(/[<>]/g, ' ');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;//Expresión regular para validar el formato del correo electrónico
        if (!emailRegex.test(emailListo)) {
            return new Response(JSON.stringify({ error: 'Correo electrónico no válido.'}),
                { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        //Valida que la contraseña tenga al menos 8 caracteres.
        if (passwd.length < 8) {
            return new Response(JSON.stringify({ error: 'La contraseña debe tener al menos 8 caracteres.'}),
                { status: 400, headers: { 'Content-Type': 'application/json' } });
        }
        //Si la contraseña tiene una longitud adecuada, se genera un hash de la contraseña.
        const salt = await bcrypt.genSalt(10);
        const passwdHash = await bcrypt.hash(passwd, salt);
        //Crea el nuevo usuario en la base de datos.
        const nuevoUsuario = await usuarioDAO.crear({name: nameListo, email: emailListo, passwd: passwdHash});
        return new Response(JSON.stringify({mensaje: 'Usuario resgistrado exitosamente', usuario: nuevoUsuario}),
            { status: 201, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {//Se cacha el error que pueda ocurrir durante el proceso de registro.
        if (error.code === '23505') {
            return new Response(JSON.stringify({ error: 'El correo ya está registrado, use otro.'}),
                { status: 409, headers: { 'Content-Type': 'application/json' } });
        }
        console.error('Error al registrar usuario:', error);
        return new Response(JSON.stringify({ error: 'Falla interna del servidor.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};