/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        usuario?: {
            id: string;
            name: string;
        };
    }
}