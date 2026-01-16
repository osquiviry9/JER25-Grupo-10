import { getFavoritePony } from '../services/userService.js';

export function createUserController(userService) {

 
  async function create(req, res, next) {
    const { nickname } = req.body;

    if (!nickname) {
      return res.status(400).json({ error: 'El campo nickname es obligatorio' });
    }

    try {
      const newUser = userService.createUser({ nickname });
      
      res.status(201).json(newUser);
    } catch (error) {
      next(error);
    }
  }

  
  async function getAll(req, res, next) {
    res.json(userService.getAllUsers());
  }

 
  async function getById(req, res, next) {
    const user = userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    
    // Calculamos el favorito al vuelo antes de devolverlo
    const favorite = getFavoritePony(user);
    
    res.json({ ...user, favoritePony: favorite });
  }

  
  async function update(req, res, next) {
    const user = userService.updateUser(req.params.id, req.body);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
  }


  async function remove(req, res, next) {
    const ok = userService.deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.status(204).end();
  }

  
  function registerPonyUse(req, res) {
    const { id } = req.params;
    const { pony } = req.body;

    const user = userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.ponyStats.hasOwnProperty(pony)) {
      return res.status(400).json({ error: 'Invalid pony name' });
    }

    user.ponyStats[pony]++;

    res.json({
      id: user.id,
      nickname: user.nickname,
      ponyStats: user.ponyStats,
      favoritePony: getFavoritePony(user)
    });
  }

  return {
    create,
    getAll,
    getById,
    update,
    remove,
    registerPonyUse
  };
}