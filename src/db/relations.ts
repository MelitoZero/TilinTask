import { relations } from "drizzle-orm/relations";
import { usuarios, tarea, lista, reconocimiento, recordatorio } from "./schema";

export const tareaRelations = relations(tarea, ({one, many}) => ({
	usuario: one(usuarios, {
		fields: [tarea.idUser],
		references: [usuarios.id]
	}),
	lista: one(lista, {
		fields: [tarea.idLista],
		references: [lista.id]
	}),
	recordatorios: many(recordatorio),
}));

export const usuariosRelations = relations(usuarios, ({many}) => ({
	tareas: many(tarea),
	listas: many(lista),
	reconocimientos: many(reconocimiento),
}));

export const listaRelations = relations(lista, ({one, many}) => ({
	tareas: many(tarea),
	usuario: one(usuarios, {
		fields: [lista.idUser],
		references: [usuarios.id]
	}),
}));

export const reconocimientoRelations = relations(reconocimiento, ({one}) => ({
	usuario: one(usuarios, {
		fields: [reconocimiento.idUsuario],
		references: [usuarios.id]
	}),
}));

export const recordatorioRelations = relations(recordatorio, ({one}) => ({
	tarea: one(tarea, {
		fields: [recordatorio.idTarea],
		references: [tarea.id]
	}),
}));