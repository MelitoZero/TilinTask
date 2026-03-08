import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

//Leemos la cadena de conexión desde las variables de entorno.
const connectionString = import.meta.env.DATABASE_URL ?? process.env.DATABASE_URL;
//Si no se encuentra la variable de entorno, lanzamos un error.
if (!connectionString) {
  throw new Error('Falta la variable DATABASE_URL para la conexión a la base de datos.');
}
//Abrimos la conexión a la base de datos utilizando postgres.js y luego creamos una instancia de Drizzle ORM con el esquema definido.
const client = postgres(connectionString);
export const db = drizzle(client, { schema });

