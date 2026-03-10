import { eq, and} from 'drizzle-orm';
import { db } from '../db/index';
import { lista } from '../db/schema';

export type InsertLista = typeof lista.$inferInsert;
export type ActualizarLista = Partial<InsertLista>;

export class ListaDAO {

    async crearLista(datos: InsertLista) {
        const resultado = await db.insert(lista).values(datos).returning();
        return resultado[0];
    }

    async obtenerPorId(idBuscado: number) {
        const resultado = await db.select().from(lista).where(and(eq(lista.id, idBuscado), eq(lista.activo, true)));
        return resultado[0];
    }

    async obtenerPorUsuario(idUsuario: string) {
        const resultado = await db.select().from(lista).where(and(eq(lista.idUser, idUsuario), eq(lista.activo, true)));
        return resultado;
    }

    async actualizar(idBuscado: number, datos: ActualizarLista) {
        const resultado = await db.update(lista).set(datos).where(and(eq(lista.id, idBuscado), eq(lista.activo, true))).returning();
        return resultado.length > 0 ? resultado[0] : null;
    }

    async eliminar(idBuscado: number) {
        const resultado = await db.update(lista).set({ activo: false }).where(eq(lista.id, idBuscado)).returning({ idEliminado: lista.id });
        return resultado.length > 0;
    }
}