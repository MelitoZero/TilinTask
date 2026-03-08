-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE "Usuarios" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"passwd" text NOT NULL,
	CONSTRAINT "user_email_unico" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "Lista" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"Descrip" text NOT NULL,
	"id_User" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Tarea" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"titulo" text NOT NULL,
	"Descrip" text NOT NULL,
	"id_Lista" integer NOT NULL,
	"fecha_inicio" date NOT NULL,
	"fecha_limite" date NOT NULL,
	"estado" text NOT NULL,
	"id_user" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Reconocimiento" (
	"id" serial PRIMARY KEY NOT NULL,
	"tipo" text NOT NULL,
	"id_usuario" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Recordatorio" (
	"id" serial PRIMARY KEY NOT NULL,
	"id_Tarea" uuid NOT NULL,
	"fecha_alerta" date NOT NULL,
	"fecha_alerta2" date NOT NULL,
	"fecha_alerta3" date NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Lista" ADD CONSTRAINT "usuario_fk" FOREIGN KEY ("id_User") REFERENCES "public"."Usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Tarea" ADD CONSTRAINT "usuario_fk" FOREIGN KEY ("id_user") REFERENCES "public"."Usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Tarea" ADD CONSTRAINT "lista_fk" FOREIGN KEY ("id_Lista") REFERENCES "public"."Lista"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Reconocimiento" ADD CONSTRAINT "usuario_fk" FOREIGN KEY ("id_usuario") REFERENCES "public"."Usuarios"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Recordatorio" ADD CONSTRAINT "tarea_fk" FOREIGN KEY ("id_Tarea") REFERENCES "public"."Tarea"("id") ON DELETE no action ON UPDATE no action;
*/