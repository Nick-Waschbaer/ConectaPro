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

## Estado de la entrega (2026-10-20)

Este apartado se añadió al cerrar el MVP; **no cambia el alcance anterior**. Los tipos de evidencia están explicados en [`ESTADO_BACKEND_MVP.md`](ESTADO_BACKEND_MVP.md): una cosa es que el código lo implemente, otra que el equipo lo haya probado a mano y otra que una prueba automatizada lo compruebe.

### Funciones incluidas

| # | Función | Estado | Evidencia |
| --- | --- | --- | --- |
| 1 | Página de búsqueda y listado de profesionales | Implementada | Código; el equipo verificó el listado contra MySQL (2026-10-18) y reportó verlo en Vercel |
| 2 | Filtro por oficio | Implementada (además, filtro por barrio en el navegador) | Código; pruebas del backend para el filtro por oficio (reportadas, 2026-10-18) |
| 3 | Formulario de solicitud asociado a un profesional | Implementada | Código |
| 4 | Validación básica en Laravel | Implementada | Pruebas del backend (13 pruebas, resultado reportado del 2026-10-18; no repetidas el 2026-10-20) |
| 5 | Guardado real de solicitudes en MySQL | Verificada por el equipo | Pruebas HTTP contra MySQL local (2026-10-18) y filas creadas desde la web (2026-10-19) |
| 6 | Confirmación en React con carga y errores | Implementada | Código y 8 pruebas del frontend sobre el formato de la respuesta. La confirmación solo aparece con HTTP 201 |
| 7 | Comprobación de salud del backend | Implementada y verificada | `GET /api/health` en local y por el túnel |
| 8 | Frontend en Vercel y API por ngrok | Verificada por el equipo (2026-10-19) | Túnel y CORS comprobados; la URL de ngrok y el CORS **pueden cambiar** |

### Criterios de aceptación

| Criterio | Estado |
| --- | --- |
| El frontend obtiene los profesionales desde la API, no desde una lista fija | Cumplido. El modo demo (`VITE_USE_MOCK_API=true`) es opcional, explícito y está avisado en pantalla; apagado, nunca se usan datos ficticios de reserva |
| El filtro cambia los resultados | Cumplido en el código |
| Una solicitud válida se guarda realmente en MySQL | Verificado por el equipo contra MySQL |
| Una solicitud inválida muestra errores comprensibles | Implementado (errores por campo del `422`); el equipo reporta haberlo probado públicamente |
| El usuario ve una confirmación tras guardar | Implementado |
| El backend devuelve JSON y códigos HTTP adecuados | Verificado por pruebas y por el equipo (201, 422 y 404 en JSON) |
| El flujo se probó desde otra computadora o desde la URL pública | Reportado por el equipo (2026-10-19); conviene repetirlo antes de presentar |
| El equipo puede explicar el recorrido del clic a la base de datos | Criterio de la presentación; no se puede comprobar con un documento |

### Fuera del alcance: sigue sin implementarse

Pagos y comisión, seguro, verificación de identidad, chat, notificaciones, aplicaciones nativas, administración y reportes, y autenticación. El código no incluye ninguna de estas funciones.
