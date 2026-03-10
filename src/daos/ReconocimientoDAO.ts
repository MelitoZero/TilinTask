import { eq, and } from 'drizzle-orm';
import { db } from '../db/index';
import { reconocimiento } from '../db/schema';

export type InsertarReconocimiento = typeof reconocimiento.$inferInsert;
export type ActualizarReconocimiento = Partial<InsertarReconocimiento>;

export class ReconocimientoDAO{

    async crear(datos: InsertarReconocimiento){
        const resultado = await db.insert(reconocimiento).values(datos).returning();
        return resultado[0];
    }

    async obtenerPorId(idBuscado: number){ 
        const resultado = await db.select().from(reconocimiento).where(eq(reconocimiento.id, idBuscado));
        return resultado[0];
    }

    async obtenerPorUsuario(idBuscado: string){
        const resultado = await db.select().from(reconocimiento).where(eq(reconocimiento.idUsuario, idBuscado));
        return resultado;
    }
    
    async actualizar(idBuscado: number, datos: ActualizarReconocimiento){
        const resultado = await db.update(reconocimiento).set(datos).where(eq(reconocimiento.id, idBuscado)).returning();
        return resultado.length > 0 ? resultado[0] : null;
    }

    async eliminar(idBuscado: number){
        const resultado = await db.delete(reconocimiento).where(eq(reconocimiento.id, idBuscado)).returning({idEliminado: reconocimiento.id});
        return resultado.length > 0;
    }
}