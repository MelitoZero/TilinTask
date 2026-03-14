import type { APIRoute } from 'astro';
import type { IReconocimiento } from '../interfaces/IReconocimiento';
import { Responder } from '../helpers/Responder';

//Exportamos el controlador de reconocimiento.
export class ReconController {
    //Constructor con el dao ya inyectado
    constructor(private reconocimientoDAO: IReconocimiento) {}
    //Método para obtener reconocimientos.
    public obtenerReconocimientos: APIRoute = async ({ locals }) => {
        //Se obtiene el id del usuario
        const idUsuario = locals.usuario?.id;
        //Se verifica que tenga autorización
        if(!idUsuario) return Responder.noAutorizado();
        //Se obtienen los reconocimientos del usuario exclusivamente
        const reconocimientos = await this.reconocimientoDAO.obtenerPorUsuario(idUsuario);
        return Responder.ok(reconocimientos, 'Reconocimientos obtenidos exitosamente.');
    };
}