import { eq, and } from 'drizzle-orm';
import { db } from '../db/index';
import { tarea } from '../db/schema';

export type InsertTarea = typeof tarea.$inferInsert;
export type ActualizarTarea = Partial<InsertTarea>;

export class TareaDAO {

    async crearTarea(datos: InsertTarea) {
        const resultado = await db.insert(tarea).values(datos).returning();
        return resultado[0];
    }

    async obtenerPorId(idBuscado: string) {
        const resultado = await db.select().from(tarea).where(and(eq(tarea.id, idBuscado), eq(tarea.activo, true)));
        return resultado[0];
    }

    async obtenerPorLista(idLista: number) {
        const resultado = await db.select().from(tarea).where(and(eq(tarea.idLista, idLista), eq(tarea.activo, true)));
        return resultado;
    }

    async obtenerPorUsuario(idUsuario: string) {
        const resultado = await db.select().from(tarea).where(and(eq(tarea.idUser, idUsuario), eq(tarea.activo, true)));
        return resultado;
    }

    async actualizar(idBuscado: string, datos: ActualizarTarea) {
        const resultado = await db.update(tarea).set(datos).where(and(eq(tarea.id, idBuscado), eq(tarea.activo, true))).returning();
        return resultado.length > 0 ? resultado[0] : null;
    }

    async eliminar(idBuscado: string) {
        const resultado = await db.update(tarea).set({ activo: false }).where(eq(tarea.id, idBuscado)).returning({ idEliminado: tarea.id });
        return resultado.length > 0;
    }

}