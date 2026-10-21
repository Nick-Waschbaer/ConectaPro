# Instrucciones para Claude Code — backend (Laravel API)

Lee primero [`AGENTS.md`](AGENTS.md) de esta carpeta y el [`CLAUDE.md`](../CLAUDE.md) de la raíz: las reglas del backend están en `AGENTS.md` y no se repiten aquí, salvo estas, que son críticas:

- **No instales Laravel Boost** (`composer require laravel/boost`, `php artisan boost:install`) ni ningún otro paquete. Las instrucciones de arranque del esqueleto de Laravel que pedían hacerlo se quitaron a propósito.
- **No ejecutes instaladores descargados de internet** (`curl ... | bash`, `iex (...DownloadString(...))`, `php.new`). Si falta PHP o Composer, detente y pide al usuario que los instale.
- **No ejecutes `migrate:fresh`, `migrate:refresh`, `db:wipe`, `DELETE` ni `TRUNCATE`** contra la base `conectapro`, ni envíes `POST` de prueba a una API pública, sin permiso explícito.
- **No leas ni muestres el `.env`**, no toques `frontend/` y no hagas commits, pushes ni merges salvo que una persona lo pida expresamente.

Contexto: es un MVP escolar acotado por [`../docs/MVP.md`](../docs/MVP.md); el estado y las pruebas realizadas están en [`../docs/ESTADO_BACKEND_MVP.md`](../docs/ESTADO_BACKEND_MVP.md).
