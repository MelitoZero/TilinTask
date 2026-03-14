export interface ITarea {
    crearTarea(datos: any): Promise<any>;
    obtenerPorId(id: string): Promise<any>;
    obtenerPorLista(idLista: number): Promise<any>;
    obtenerPorUsuario(idUsuario: string): Promise<any>;
    actualizar(id: string, datos: any): Promise<any>;
    eliminar(id: string): Promise<boolean>;
}