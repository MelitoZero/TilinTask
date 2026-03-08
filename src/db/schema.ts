import { pgTable, unique, uuid, text, foreignKey, serial, integer, date } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const usuarios = pgTable("Usuarios", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: text().notNull(),
	name: text().notNull(),
	passwd: text().notNull(),
}, (table) => [
	unique("user_email_unico").on(table.email),
]);

export const lista = pgTable("Lista", {
	id: serial().primaryKey().notNull(),
	name: text().notNull(),
	descrip: text("Descrip").notNull(),
	idUser: uuid("id_User").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idUser],
			foreignColumns: [usuarios.id],
			name: "usuario_fk"
		}),
]);

export const tarea = pgTable("Tarea", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	titulo: text().notNull(),
	descrip: text("Descrip").notNull(),
	idLista: integer("id_Lista").notNull(),
	fechaInicio: date("fecha_inicio").notNull(),
	fechaLimite: date("fecha_limite").notNull(),
	estado: text().notNull(),
	idUser: uuid("id_user").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idUser],
			foreignColumns: [usuarios.id],
			name: "usuario_fk"
		}),
	foreignKey({
			columns: [table.idLista],
			foreignColumns: [lista.id],
			name: "lista_fk"
		}),
]);

export const reconocimiento = pgTable("Reconocimiento", {
	id: serial().primaryKey().notNull(),
	tipo: text().notNull(),
	idUsuario: uuid("id_usuario").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idUsuario],
			foreignColumns: [usuarios.id],
			name: "usuario_fk"
		}),
]);

export const recordatorio = pgTable("Recordatorio", {
	id: serial().primaryKey().notNull(),
	idTarea: uuid("id_Tarea").notNull(),
	fechaAlerta: date("fecha_alerta").notNull(),
	fechaAlerta2: date("fecha_alerta2").notNull(),
	fechaAlerta3: date("fecha_alerta3").notNull(),
}, (table) => [
	foreignKey({
			columns: [table.idTarea],
			foreignColumns: [tarea.id],
			name: "tarea_fk"
		}),
]);
