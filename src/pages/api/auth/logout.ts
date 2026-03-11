import type { APIRoute } from 'astro';

// Ruta para cerrar sesión eliminando la cookie de sesión JWT
export const POST: APIRoute = async ({ cookies }) => {

    try {
        // Elimina la cookie de sesión JWT
        cookies.delete('sesion_jwt', { path: '/' });
        return new Response(JSON.stringify({ message: 'Sesión cerrada exitosamente.' }),
            { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error) {
        console.error("Error al cerrar sesión:", error);
        return new Response(JSON.stringify({ message: 'Error al cerrar sesión.' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
};