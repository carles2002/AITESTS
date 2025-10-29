# Gestor de tareas

Una aplicación web sencilla para gestionar tus tareas diarias. Permite crear, editar, completar y eliminar elementos, además de filtrar por estado. Todos los cambios se guardan de forma local en el navegador mediante `localStorage`.

## Estructura del proyecto

```
public/
├── index.html
├── styles.css
└── app.js
```

- **index.html**: estructura básica de la aplicación.
- **styles.css**: estilos responsivos y accesibles.
- **app.js**: lógica para gestionar el estado, renderizar la interfaz y persistir los datos.

## Cómo ejecutar la aplicación

No se requiere backend ni dependencias adicionales. Existen dos formas recomendadas para abrir la aplicación:

1. **Abrir el archivo HTML directamente**
   - Navega hasta la carpeta `public/` y abre `index.html` con tu navegador preferido.

2. **Levantar un servidor estático** (recomendado para probar `localStorage` en algunos navegadores)
   - Utiliza cualquier servidor HTTP simple, por ejemplo con `npx`:
     ```bash
     npx serve public
     ```
   - Abre el navegador en la URL que indique la terminal (por defecto suele ser `http://localhost:3000`).

## Funcionalidades

- Crear nuevas tareas mediante el formulario principal.
- Mostrar la lista de tareas con acciones para editar, completar o eliminar cada elemento.
- Filtrar las tareas por estado: todas, pendientes y completadas.
- Persistir automáticamente los cambios usando `localStorage`, incluso al recargar la página.
- Sincronización básica entre pestañas mediante el evento `storage` del navegador.

## Compatibilidad

La aplicación está desarrollada con HTML, CSS y JavaScript estándar, por lo que funciona en los navegadores modernos sin configuración adicional.
