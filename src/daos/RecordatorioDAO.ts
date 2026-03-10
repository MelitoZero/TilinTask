import {eq, and } from 'drizzle-orm';
import { db } from '../db/index';
import { recordatorio } from '../db/schema';

export type InsertRecordatorio = typeof recordatorio.$inferInsert;
export type ActualizarRecordatorio = Partial<InsertRecordatorio>;

export class RecordatorioDAO {

    async crearRecordatorio(datos: InsertRecordatorio) {
        const resultado = await db.insert(recordatorio).values(datos).returning();
        return resultado[0];
    }

    async obtenerPorId(idBuscado: number) {
        const resultado = await db.select().from(recordatorio).where(eq(recordatorio.id, idBuscado));
        return resultado[0];
    }

    async obtenerPorTarea(idTarea: string){
        const resultado = await db.select().from(recordatorio).where(eq(recordatorio.idTarea, idTarea));
        return resultado;
    }

    async actualizar(idBuscado: number, datos: ActualizarRecordatorio) {
        const resultado = await db.update(recordatorio).set(datos).where(eq(recordatorio.id, idBuscado)).returning();
        return resultado.length > 0 ? resultado[0] : null;
    }

    async eliminar(idBuscado: number) {
        const resultado = await db.delete(recordatorio).where(eq(recordatorio.id, idBuscado)).returning({ idEliminado: recordatorio.id });
        return resultado.length > 0;
    }

}