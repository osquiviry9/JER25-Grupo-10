/**
 * Rutas para la gestión de usuarios
 * Define los endpoints HTTP y los conecta con el controlador
 *
 * Patrón: Inyección de dependencias - recibe el controlador como parámetro
 */

import express from 'express';

export function createUserRoutes(userController) {
  const router = express.Router();

  router.post('/', userController.create);
  router.get('/', userController.getAll);
  router.get('/:id', userController.getById);
  router.put('/:id', userController.update);
  router.delete('/:id', userController.remove);
  router.put('/:id/pony', userController.registerPonyUse);

  return router;
}
