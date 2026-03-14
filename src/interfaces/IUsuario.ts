export interface IUsuario {
    crear(datos: any): Promise<any>
    obtenerPorId(id: string): Promise<any>;
    obtenerPorEmail(email: string): Promise<any>;
    actualizar(id: string, datos: any): Promise<any>;
    eliminar(id: string): Promise<boolean>;
}