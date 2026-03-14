export class Responder {

    static ok(datos: any, mensaje = 'Operación Extiosa') {
        return new Response(JSON.stringify({ mensaje, datos }),
            { status: 200, headers: { 'Content-Type': 'application/json' } });
    }

    static creado(datos: any, mensaje = 'Registro creado exitosamente') {
        return new Response(JSON.stringify({ mensaje, datos }),
            { status: 201, headers: { 'Content-Type': 'application/json' } });
    }

    static badRequest(mensaje = 'Faltan datos o estan inccorectos') {
        return new Response(JSON.stringify({ error: mensaje }),
            { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    static noAutorizado(mensaje = 'No estas autorizado') {
        return new Response(JSON.stringify({ error: mensaje }),
            { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    static prohibido(mensaje = 'No tienes permiso para esta acción') {
        return new Response(JSON.stringify({ error: mensaje }),
            { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    static noEncontrado(mensaje = 'No se encontro el registro o no existe') {
        return new Response(JSON.stringify({ error: mensaje }),
            { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

}