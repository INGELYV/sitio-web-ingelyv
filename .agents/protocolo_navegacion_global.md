# Protocolo Global de Navegación y Privacidad (Antigravity)

Este protocolo rige todas las interacciones de navegador realizadas por el agente Antigravity para el usuario, asegurando la separación de perfiles de Google y la privacidad de los datos.

## 1. Modo de Navegación por Defecto (Invitado)
*   **Regla:** A menos que una tarea requiera EXPLICITAMENTE una sesión de Google, el agente debe abrir el navegador en una instancia **limpia (Guest/Incognito)**.
*   **Uso:** Visualización de `localhost`, investigación general, lectura de documentación pública y pruebas de UI.

## 2. Acciones con Cuenta de Google (Consentimiento Obligatorio)
*   **Regla:** Antes de realizar cualquier tarea que requiera autenticación (Google Drive, Gmail, Google Cloud, Firebase, etc.), el agente **DEBE PREGUNTAR** al usuario qué perfil utilizar.
*   **Excepción (Instrucción Explícita):** Si el usuario especifica en su comando inicial la cuenta a utilizar, el agente procederá sin preguntar, utilizando el perfil correspondiente a:
    *   **Personal:** `germanvilladupretts@gmail.com`
    *   **Empresarial:** `ingelyv@gmail.com`
*   **Pregunta de Seguridad:** *"Para esta tarea necesito iniciar sesión. ¿Usamos el perfil **Trabajo (ingelyv@gmail.com)**, el perfil **Personal (germanvilladupretts@gmail.com)**, o deseas que abra el navegador en blanco para que tú hagas el login manualmente?"*

## 3. Verificación de Identidad
*   **Regla:** Si el usuario selecciona un perfil, el agente debe navegar primero a `https://myaccount.google.com/` para confirmar que la cuenta activa coincide con la elección del usuario antes de proceder con la tarea.

## 4. Aislamiento entre Proyectos
*   **Regla:** El agente nunca debe asumir que la cuenta utilizada en el "Proyecto A" es la misma para el "Proyecto B". Cada nuevo hilo de conversación o cambio de contexto de proyecto requiere una nueva confirmación si se necesita el navegador con cuenta.

## 5. Prevención de Captura de Datos Sensibles
*   **Regla:** El agente debe evitar tomar capturas de pantalla (screenshots) de bandejas de entrada de correo o datos de facturación a menos que sea estrictamente necesario para resolver un bug, informando siempre al usuario antes de hacerlo.
