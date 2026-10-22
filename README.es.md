[English](README.md) · [Tiếng Việt](README.vi.md) · [Español](README.es.md) · [Português (Brasil)](README.pt-BR.md) · [Français](README.fr.md) · [Deutsch](README.de.md)

# Agent Workspace

Agent Workspace es una app para macOS que reúne Claude Code, Codex y Antigravity en una ventana para que veas qué agentes están trabajando y cuáles te esperan.

<img src="images/app-icon.png" width="128" alt="Agent Workspace">

Descarga la última versión: [Agent-Workspace-arm64-notarized.zip](https://github.com/dat08101999/agent-workspace/releases/latest/download/Agent-Workspace-arm64-notarized.zip) (en la página de [Releases](https://github.com/dat08101999/agent-workspace/releases) encontrarás otras versiones).

Página de presentación con una demo interactiva y un vídeo: https://dat08101999.github.io/agent-workspace/

Este repo contiene solo documentación, la página de presentación (la rama `gh-pages`) y los instaladores. El código fuente de la app no está aquí.

## Qué hace la app

Abres varios agentes a la vez, cada uno trabajando en una carpeta distinta. Uno se detiene para preguntarte si puede editar un archivo. Estás en otra ventana y no te das cuenta. El agente sigue esperando.

Agent Workspace reúne tus chats en una barra lateral. Puedes ver qué chats están en curso y cuáles te esperan. Cuando te necesita, la app muestra una notificación de macOS y un contador en el icono del Dock. Responde en la app.

La app usa Claude Code, Codex y Antigravity, que ya están instalados y tienen sesión iniciada en tu equipo. No tiene una cuenta propia.

## Requisitos

- Un Mac con Apple silicon.
- `python3` en tu equipo. Basta con la versión incluida en Xcode Command Line Tools; si no la tienes, ejecuta `xcode-select --install` en Terminal.
- Al menos una de estas tres herramientas: Claude Code, Codex o Antigravity. Debe estar instalada y con la sesión iniciada.

No necesitas instalar .NET ni Node. El servidor viene incluido en la app.

## Instalación

1. **Descarga el ZIP.** Haz clic en «Descargar para Mac» para obtener `Agent-Workspace-arm64-notarized.zip`.
2. **Mueve la app a Aplicaciones.** Descomprime el archivo y arrastra `Agent Workspace.app` a Aplicaciones.
3. **Abre la app.** Abre Agent Workspace desde Aplicaciones. Si macOS pregunta si quieres abrir una app descargada de internet, pulsa Abrir.

La descarga actual tiene una firma Developer ID válida y un ticket de notarización de Apple adjunto. Gatekeeper aceptó la app después de descomprimirla.

## Primer inicio

La app encuentra Claude Code, Codex y Antigravity en tu equipo y se conecta a ellos automáticamente; no tienes que hacer clic en nada. Consulta los resultados en Ajustes → Proveedor.

1. Añade una carpeta. Usa «Añadir carpeta» al final de la lista de carpetas en la barra lateral. Una carpeta del disco es un espacio de trabajo para la app.
2. Abre un chat en esa carpeta con el «+» junto al nombre de la carpeta.
3. Elige dónde se ejecuta el chat (Claude Code, Codex o Antigravity) y, después, elige un modelo y un nivel de esfuerzo.
4. Escribe y envía tu primer mensaje.

Un chat nuevo es un borrador. La app no crea ninguna conversación en el proveedor hasta que envías el primer mensaje.

![Primer inicio: todavía no hay carpetas](images/lan-mo-dau.png)

## Cómo funciona

La app es una ventana nativa que contiene una página web ejecutada en tu equipo. Un servidor pequeño sirve esa página y la app lo inicia. El servidor solo escucha en `127.0.0.1` (puerto 5188). Se comunica con Claude Code, Codex y Antigravity en tu equipo. Los scripts auxiliares se ejecutan con el `python3` de tu equipo.

```
Ventana de la app  <->  servidor local 127.0.0.1:5188  <->  Claude Code / Codex / Antigravity
                                                              (en tu Mac)
```

La app no llama a ninguna API de modelos. Cada turno se ejecuta mediante las herramientas del proveedor.

## Funciones

### Consultar

- La barra lateral muestra qué chats están en curso y cuáles te esperan (la marca «!»). El contador `N te necesitan` indica cuántos chats te necesitan.
- Cuando la ventana está en segundo plano y un agente te hace una pregunta, macOS muestra una notificación y el icono del Dock indica cuántos chats están esperando.
- Cuando termina un turno, macOS muestra una notificación de «terminado». Puedes desactivarla en el menú de la app, en «Avisar cuando termine Agent». Las notificaciones de preguntas siguen activas.
- Después de cada turno, un bloque enumera los archivos editados. Haz clic en un archivo para abrirlo en la columna derecha.
- La pantalla de límites de uso muestra los límites que indica cada proveedor.
- Despliega cada paso de trabajo (ejecutar un comando, editar un archivo) para ver la salida del comando o el diff del archivo.
- Los planes en forma de lista de verificación y el razonamiento que el proveedor pone a disposición aparecen en el chat.
- La interfaz está disponible en inglés, vietnamita, español, portugués (Brasil), francés y alemán. Sigue el idioma de tu Mac; cámbialo en Ajustes → Idioma.
- «Oficina de agentes» es una oficina pixel art. Cada agente es un personaje cuya pose refleja su estado real: trabaja en un escritorio, saluda cuando te necesita, muestra una marca de verificación cuando acaba de terminar y representa a un agente hijo con un pequeño robot.

### Aprobar

- Las solicitudes de permiso de Claude Code, Codex y Antigravity aparecen en tarjetas. Para las ediciones de archivos, la tarjeta muestra las líneas eliminadas y añadidas. En una tarjeta de Antigravity, "Permitir en este chat" también permite después el mismo tipo de comando en ese chat.
- Las preguntas y los planes de Claude Code también aparecen ahí. En Codex, las tarjetas también incluyen solicitudes para ejecutar herramientas MCP, formularios y páginas que abrir.
- También puedes responder a las preguntas de un agente hijo de Claude que se ejecuta en segundo plano.

![Tarjeta de aprobación para un cambio de Claude Code](images/duyet.png)

### Detener

- Puedes detener un turno en curso.
- Un turno detenido aparece como «Este turno se detuvo.».
- Si un turno falla, se muestra el motivo indicado por el proveedor.

### Continuar

- Envía otro mensaje mientras hay un turno en curso.
- Recarga la página sin perder el turno en curso.
- Cada chat tiene su propia selección de entorno de ejecución (Claude Code, Codex o Antigravity), modelo y esfuerzo.
- Un chat en borrador no crea nada en el proveedor hasta que envías el primer mensaje.
- Adjunta imágenes, PDF y archivos de texto con los tres proveedores.
- Edita un mensaje enviado: la conversación vuelve a ese mensaje para que puedas enviarlo otra vez. Con Claude Code, también puedes elegir restaurar los archivos editados después de ese mensaje.
- Bifurca desde un mensaje para probar otra dirección en un chat nuevo.
- Elige el modo de permisos en el cuadro de redacción: por chat para Claude Code y Codex; por carpeta para Antigravity (Request Review, Default o Turbo, guardado en los ajustes de Antigravity para ese proyecto).
- Con Codex: enviar más tarde (un mensaje espera hasta que termina el turno en curso), modo Plan, revisión y objetivos.
- Tareas en segundo plano de Claude Code y Antigravity: consulta la salida y detén tareas individuales.

### Conectores (servidores MCP)

- En el cuadro de redacción, «+» → Conector muestra los servidores MCP del proveedor que usa el chat.
- Activa o desactiva cada servidor, vuelve a conectar los que hayan fallado e inicia sesión en los que lo requieran (Codex, Antigravity).
- Con Codex y Antigravity, los cambios se aplican a todos los chats de ese proveedor en tu equipo, también en su app nativa. Con Claude Code, solo se aplican a esa carpeta.
- Antes de desactivar el servidor `pet_task_manager` de la app, esta vuelve a preguntarte porque la delegación lo necesita.

### Delegar en otro agente

- En cualquier chat (Claude Code, Codex o Antigravity), pide a un agente de otro proveedor que haga algo; por ejemplo, «pídele a Codex que revise este archivo». La app abre un chat real en ese proveedor y le envía la tarea; después devuelve la respuesta al chat que la solicitó.
- El chat delegado aparece debajo del chat que lo solicitó, tras el botón «N hijos» de la barra lateral, con la etiqueta «delegado». Puedes abrirlo y enviarle mensajes directamente.
- Pide un modelo por su nombre conocido; por ejemplo, «Codex sol 6.1». Si coincide con varios modelos, el agente recibe una lista para elegir o te pregunta.
- Cada chat puede tener como máximo 3 agentes hijos en ejecución a la vez, y los agentes hijos no pueden crear otros agentes hijos.
- Esta función está desactivada de forma predeterminada. Actívala en Ajustes → Proveedor → «Agentes hijos de otros proveedores».

## Datos y privacidad

- La app no tiene una cuenta propia ni llama a ninguna API de modelos.
- Tus propias herramientas Claude Code, Codex o Antigravity envían el contenido del chat, no la app.
- El servidor local solo escucha en `127.0.0.1`.
- Los datos propios de la app (un token local, la base de datos y los logs) están en `~/Library/Application Support/Agent Workspace`.
- Eliminar un chat o una carpeta en la app no borra nada en el proveedor.
- Cada vez que se inicia, la app añade una entrada MCP llamada `pet_task_manager` a la configuración de cada herramienta instalada: `~/.claude.json` (Claude Code), `~/.codex/config.toml` (Codex), `~/.gemini/config/mcp_config.json` (Antigravity). Así, los chats pueden usar las herramientas de la app, como delegar en otro agente. Antes de escribir, la app hace una copia de seguridad del archivo anterior junto al original, deja intacta cualquier entrada `pet_task_manager` añadida por otra persona y no la vuelve a añadir si la eliminas tú.
- Por lo demás, la app solo escribe fuera de su carpeta de datos cuando se lo pides. Por ejemplo, al hacer clic en «Instalar hook» en «Origen del estado», añade un hook de observación a `~/.claude/settings.json` (Claude Code) o `~/.gemini/config/hooks.json` (Antigravity). «Quitar hook», en el mismo lugar, lo elimina.

## Limitaciones actuales

- Los agentes hijos que se ejecutan en Antigravity no reciben límites de permisos de la app: siguen el modo de Antigravity de su carpeta, que puedes cambiar con el botón Modo del chat. Los agentes hijos de Codex son de solo lectura de forma predeterminada.
- En el modo de permisos Manual, cada vez que Claude usa la herramienta de agente hijo, aparece una tarjeta de aprobación.
- La app todavía no permite iniciar sesión en los servidores MCP de Claude Code; usa `/mcp` en Claude Code.
- Solo está disponible para macOS con Apple silicon.
- La app para Mac requiere macOS 12 o posterior. Las versiones anteriores no son compatibles.
- La app solo se ha probado en unos pocos equipos. Si no se abre, comunícalo en Issues.

## Desinstalación

1. Si hiciste clic en «Instalar hook» en la app, haz clic primero en «Quitar hook». El comando del hook apunta a la ubicación de la app y dejará de funcionar si la eliminas o la mueves.
2. Cierra `Agent Workspace`.
3. Arrastra `Agent Workspace` desde Applications a la Papelera.
4. Elimina la entrada `pet_task_manager` de `~/.claude.json`, `~/.codex/config.toml` y `~/.gemini/config/mcp_config.json`. Esta entrada apunta a la app y dejará de funcionar cuando la elimines.
5. Para eliminar también los datos de la app, borra `~/Library/Application Support/Agent Workspace`.

## Preguntas e informes de errores

Abre una incidencia en https://github.com/dat08101999/agent-workspace/issues.

Al informar de un error, incluye la versión de la app, la versión de macOS, el proveedor del chat, los pasos que seguiste y lo que viste. No pegues tokens ni contenido confidencial del chat en una incidencia.
