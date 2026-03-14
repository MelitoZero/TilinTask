export interface IRecordatorio {
    crearRecordatorio(datos: any): Promise<any>;
    obtenerPorId(id: number): Promise<any>;
    obtenerPorTarea(idTarea: string): Promise<any>;
    actualizar(id: number, datos: any): Promise<any>;
    eliminar(id: number): Promise<boolean>;
}