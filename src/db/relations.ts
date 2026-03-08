import { relations } from "drizzle-orm/relations";
import { usuarios, lista, tarea, reconocimiento, recordatorio } from "./schema";

export const listaRelations = relations(lista, ({one, many}) => ({
	usuario: one(usuarios, {
		fields: [lista.idUser],
		references: [usuarios.id]
	}),
	tareas: many(tarea),
}));

export const usuariosRelations = relations(usuarios, ({many}) => ({
	listas: many(lista),
	tareas: many(tarea),
	reconocimientos: many(reconocimiento),
}));

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