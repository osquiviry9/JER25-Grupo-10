# Documentación API REST Fase 3

Esta sección describe la interfaz de programación de aplicaciones (API) implementada para la comunicación Cliente-Servidor.  
El servidor corre sobre **Node.js** con **Express** y gestiona la persistencia de usuarios y el estado de las conexiones en tiempo real.

**URL Base:** /api

## 1. Recurso: Usuarios (/users)

Gestión completa del ciclo de vida de los jugadores (CRUD) y sus estadísticas.

| Método | Endpoint            | Descripción                                                                 | Cuerpo (Body) / Params        | Respuesta (JSON)                                  |
|--------|---------------------|------------------------------------------------------------------------------|-------------------------------|--------------------------------------------------|
| POST   | /users            |  Crea un nuevo usuario o recupera sesión.              | { "nickname": "Pony1" }`     | { "id": "1", "nickname": "Pony1", ... }        |
| GET    | /users/:id      | Devuelve datos del usuario y calcula su poni favorito.  |id` (URL Param)              | { "id": "1", "nickname": "...", "favoritePony": "Ache" }` |
| GET    | /users            |  Obtiene la lista completa de usuarios registrados.        | —                             | `[ { "id": "1", ... }, { "id": "2", ... } ]     |
| PUT    | /users/:id/pony   |  Registra el uso de un personaje para estadísticas.        | { "pony": "Kamil" }`         | { "ponyStats": { "Kamil": 1, ... }, "favoritePony": "Kamil" } |
| DELETE | `/users/:id        | Elimina el registro del usuario del servidor.           | id (URL Param)              | 204 No Content                                |

## Ejemplo de Flujo de Usuario (JSON)

### 1. Petición de Registro

```http
POST /api/users
Content-Type: application/json

{
  "nickname": "BLINBLIN"
}

```
### 2. Respuesta del servidor
```json

{
  "id": "15",
  "nickname": "BLINBLIN",
  "ponyStats": {
    "Ache": 0,
    "Haiire": 0,
    "Domdomadom": 0,
    "Kamil": 0,
    "Beersquivir": 0
  }
}

```
El siguiente diagrama ilustra como el jugador se registra y como se determina su poni favorito:

![Diagrama de flujo de registro](FotosAPI/FlujoRegistro.png)
*Figura: Flujo de registro de nombre de usuario y poni favorito.*

## 2. Recurso: Conexiones (/connected)

Sistema de **Heartbeat** para monitorizar usuarios activos y detectar desconexiones.

| Método | Endpoint      | Descripción                                  | Cuerpo                      | Respuesta                                   |
|--------|---------------|----------------------------------------------|-----------------------------------|--------------------------------------------------|
| POST   | /connected  |  El cliente notifica que sigue vivo. | { "sessionId": "sess_12345" }`  | { "connected": 3 } *(Nº total de usuarios online)* |

---

### Funcionamiento del Keep-Alive

1. El cliente genera un sessionId único al iniciar.
2. Cada **2 segundos**, el cliente envía una petición POST a /api/connected.
3. El servidor actualiza la marca de tiempo de esa sesión.
4. **Timeout:** Si el servidor no recibe señal de una sesión en **5 segundos**, la considera desconectada y la elimina de la lista de activos.


El siguiente diagrama ilustra cómo se lleva a cabo el sistema:

![Diagrama de flujo del sistema Keep-Alive](FotosAPI/FlujoHeartBeat.png)
*Figura: Flujo del sistema Keep-Alive*

## 3. Códigos de Estado HTTP

La API utiliza los códigos estándar para indicar el resultado de las operaciones:

- **200 OK**: La petición se procesó correctamente.
- **201 Created**: Recurso creado con éxito (ej. nuevo usuario).
- **204 No Content**: Acción realizada correctamente sin respuesta (ej. borrar).
- **400 Bad Request**: Faltan datos obligatorios (ej. falta nickname o sessionId).
- **404 Not Found**: El recurso (usuario) no existe.
- **500 Internal Server Error**: Error no controlado en el servidor.
