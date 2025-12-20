import { getFavoritePony } from '../services/userService.js';

export function createUserController(userService) {

  async function create(req, res, next) {
    const { email, name, avatar, level } = req.body;
    if (!email || !name) {
      return res.status(400).json({ error: 'Los campos email y name son obligatorios' });
    }
    const newUser = userService.createUser({ email, name, avatar, level });
    res.status(201).json(newUser);
  }

  async function getAll(req, res, next) {
    res.json(userService.getAllUsers());
  }

  async function getById(req, res, next) {
    const user = userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(user);
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

  // for registering the favorite poni os user
  function registerPonyUse(req, res) {
    const { id } = req.params;
    const { pony } = req.body;

    const user = userService.getUserById(id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    if (!user.ponyStats.hasOwnProperty(pony)) {
      return res.status(400).json({ error: 'Invalid pony' });
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
