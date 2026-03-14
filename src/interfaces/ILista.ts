export interface ILista {
    crearLista(datos: any): Promise<any>;
    obtenerPorId(id: number): Promise<any>;
    obtenerPorUsuario(idUsuario: string): Promise<any>;
    actualizar(id: number, datos: any): Promise<any>;
    eliminar(id: number): Promise<boolean>;
}