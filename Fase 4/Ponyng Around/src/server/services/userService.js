/**
 * Servicio de gestión de usuarios usando closures
 * Este servicio mantiene el estado de los usuarios en memoria
 * y proporciona métodos para realizar operaciones CRUD
 */

export function createUserService() {
  let users = [];
  let nextId = 1;

  function createUser(userData) {

    // Validación mínima
    if (!userData.nickname) {
      throw new Error('Nickname requerido');
    }

    const newUser = {
      id: String(nextId),
      nickname: userData.nickname,
      ponyStats: {
        Ache: 0,
        Haiire: 0,
        Domdomdadom: 0,
        Kamil: 0,
        Beersquiviry: 0
      }
    };

    users.push(newUser);
    nextId++;

    return newUser;
  }

  function getAllUsers() {
    return [...users];
  }

  function getUserById(id) {
    return users.find(u => u.id === id) || null;
  }

  function getUserByEmail(email) {
    return users.find(u => u.email === email) || null;
  }

  function updateUser(id, updates) {
    const user = getUserById(id);
    if (!user) return null;

    if (updates.nickname) {
      user.nickname = updates.nickname;
    }

    return user;
  }

  function deleteUser(id) {
    const index = users.findIndex(u => u.id === id);
    if (index === -1) return false;

    users.splice(index, 1);
    return true;
  }

  return {
    createUser,
    getAllUsers,
    getUserById,
    getUserByEmail,
    updateUser,
    deleteUser
  };
}


//For calculating the favorite pony of a user
export function getFavoritePony(user) {
    let favorite = null;
    let max = 0;

    for (const pony in user.ponyStats) {
        if (user.ponyStats[pony] > max) {
            max = user.ponyStats[pony];
            favorite = pony;
        }
    }

    return max === 0 ? null : favorite;
}

