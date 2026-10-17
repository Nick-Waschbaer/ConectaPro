# Alcance del MVP para la entrega

## Meta

Demostrar un recorrido real y pequeño que atraviese frontend, API, backend y base de datos. Priorizar funcionalidad verificable sobre cantidad de pantallas.

## Incluido

1. Página de búsqueda/listado de profesionales.
2. Filtro simple por oficio.
3. Formulario de solicitud asociado a un profesional.
4. Validación básica de datos en Laravel.
5. Guardado real de solicitudes en MySQL.
6. Confirmación clara en React, con manejo de carga y errores.
7. Comprobación de salud del backend.
8. Frontend publicado en Vercel y API accesible por ngrok para la demostración, si la conectividad y los límites gratuitos lo permiten.

## Datos de demostración

Usar profesionales ficticios y solicitudes de prueba. No utilizar teléfonos, direcciones precisas, contraseñas ni otros datos personales reales.

## Fuera del alcance inicial

- Pagos reales o cobro de la comisión del 15%.
- Seguro real contra daños.
- Verificación real de identidad o antecedentes.
- Chat en tiempo real.
- Notificaciones SMS/WhatsApp.
- Aplicaciones nativas Android/iOS.
- Sistema completo de administración y reportes financieros.
- Autenticación completa, salvo que el flujo principal esté terminado y quede tiempo suficiente.

## Criterios de aceptación

- El frontend obtiene los profesionales desde la API, no desde una lista fija escrita en el componente final.
- El filtro cambia los resultados.
- Una solicitud válida se guarda realmente en MySQL.
- Una solicitud inválida muestra errores comprensibles.
- El usuario ve una confirmación tras guardar.
- El backend devuelve JSON y códigos HTTP adecuados.
- El flujo se prueba desde una computadora distinta o desde la URL pública antes de presentar.
- El equipo puede explicar qué sucede desde el clic del usuario hasta la base de datos.

## Regla de prioridad

Primero completar un flujo integrado de extremo a extremo. Solo después añadir otras funciones. No declarar como terminada una funcionalidad que sea solo una maqueta visual.
