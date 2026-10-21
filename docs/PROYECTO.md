# ConectaPro — idea del proyecto

## Resumen

ConectaPro es un marketplace web que conecta a personas que necesitan servicios técnicos o de mantenimiento del hogar con profesionales independientes de su zona. El piloto previsto comienza en sectores de Asunción, Paraguay.

## Problema

- Los clientes dependen a menudo del boca a boca o de búsquedas poco estructuradas en redes sociales.
- Los clientes tienen dificultades para comparar opciones y generar confianza.
- Los profesionales independientes pueden tener poca visibilidad y pocos canales digitales para conseguir clientes.

## Solución propuesta

Una plataforma donde los clientes puedan descubrir profesionales y enviar solicitudes de servicio, mientras los profesionales pueden mostrar sus servicios y reputación.

## Modelo de negocio previsto

El registro sería gratuito y la plataforma cobraría una comisión del 15% sobre servicios finalizados mediante ConectaPro. En el MVP escolar no se procesarán pagos reales ni se afirmará que la comisión ya se cobra.

## Módulos planeados

1. Inicio de sesión y roles.
2. Gestión de usuarios y validación de profesionales.
3. Publicación de solicitudes y perfiles/portafolios de servicios.
4. Búsqueda por oficio, zona y reseñas.
5. Historial, comprobantes y reportes financieros.

## Diferencia entre visión y entrega

Los módulos anteriores describen la visión del producto. `docs/MVP.md` define qué se construirá para esta entrega y qué se deja expresamente fuera. La presentación debe distinguir entre funciones terminadas, prototipos y trabajo futuro.

## Qué módulos están implementados en el MVP escolar

Esta tabla traduce la visión a lo que existe hoy en el repositorio (revisión del 2026-10-20). Lo que figura como «futuro» **no está implementado**.

| Módulo de la visión | Estado en el MVP escolar |
| --- | --- |
| 1. Inicio de sesión y roles | **Futuro.** No hay autenticación ni roles |
| 2. Gestión de usuarios y validación de profesionales | **Futuro.** Los profesionales son datos ficticios cargados por un seeder; ninguno está verificado |
| 3. Publicación de solicitudes y perfiles o portafolios de servicios | **Parcial.** Se pueden enviar solicitudes de servicio a un profesional y se guardan en MySQL con estado `pending`. No hay perfiles ni portafolios editables ni gestión posterior del trabajo |
| 4. Búsqueda por oficio, zona y reseñas | **Parcial.** Hay búsqueda por oficio y por barrio. No hay reseñas reales: la valoración mostrada es un dato ficticio |
| 5. Historial, comprobantes y reportes financieros | **Futuro** |
| Modelo de negocio (comisión del 15 %) | **Futuro.** No se procesan pagos ni se cobra ninguna comisión |

**Implementado y verificado en el MVP:** consulta de profesionales, filtros por oficio y barrio, creación de solicitudes con validación, integración entre React y Laravel, y persistencia en MySQL. Ver [`MVP.md`](MVP.md) y [`ESTADO_BACKEND_MVP.md`](ESTADO_BACKEND_MVP.md).

## Documentos de visión

La visión resumida del producto es este mismo documento. Los archivos `IDEA_PROYECTO_CONECTAPRO.md`, `PRD_01_Frontend_ConectaPro.md` y `PRD_02_Backend_ConectaPro.md`, mencionados en conversaciones del equipo, **no están en este repositorio**. Si el equipo los conserva fuera de aquí, deben leerse como visión y no como descripción del producto entregado: lo que el producto hace hoy es lo descrito en [`MVP.md`](MVP.md).
