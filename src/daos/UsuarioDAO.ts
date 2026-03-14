import { eq, and } from 'drizzle-orm';
import { db } from '../db/index';
import { usuarios } from '../db/schema';
import type { IUsuario } from '../interfaces/IUsuario';

export type InsertarUsuario = typeof usuarios.$inferInsert;
export type ActualizarUsuario = Partial<InsertarUsuario>;

export class UsuarioDAO implements IUsuario {
    //Crea un nuevo usuario en la base de datos y lo devuelve
    async crear(datos: InsertarUsuario){
        const resultado = await db.insert(usuarios).values(datos).returning();
        return resultado[0];
    }
    //Busca un usuario por su ID y lo devuelve
    async obtenerPorId(idBuscado: string){
        const resultado = await db.select().from(usuarios).where(and(eq(usuarios.id, idBuscado), eq(usuarios.activo, true)));
        return resultado[0];
    }
    //Obtiene un usuario por su email y lo devuelve
    async obtenerPorEmail(emailBuscado: string){
        const resultado = await db.select().from(usuarios).where(and(eq(usuarios.email, emailBuscado), eq(usuarios.activo, true)));
        return resultado[0];
    }
    //Obtiene un usuario y los actualiza con los nuevos datos, luego devuelve el usuario actualizado
    async actualizar(idBuscado: string, datos: ActualizarUsuario){
        const resultado = await db.update(usuarios).set(datos).where(and(eq(usuarios.id, idBuscado), eq(usuarios.activo, true)))
            .returning();
        return resultado.length > 0 ? resultado[0] : null;
    }
    //Permite eliminar un usuario
    async eliminar(idBuscado: string){
        const resultado = await db.update(usuarios).set({activo: false}).where(eq(usuarios.id, idBuscado))
            .returning({idEliminado: usuarios.id});
        return resultado.length > 0;
    }
}