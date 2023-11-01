import {User} from '../models/User.js'
import {Role} from '../models/Role.js'

export const createUserRole = async (req, res) => {
    try {
        // Recupera los datos del cuerpo de la solicitud
        const { userId, roleId } = req.body;

        // Verifica si el usuario y el rol existen
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);

        if (!user || !role) {
            return res.status(404).json({ message: "Usuario o rol no encontrado." });
        }

        // Crea la relación en la tabla intermedia UserRole
        await user.addRole(role);

        res.status(201).json({ message: "Relación usuario-rol creada con éxito.", userRole: user });
    } catch (error) {
        console.error(error);
        console.error(error.name);
        return res.status(500).json({ message: error.message });
    }
};

export const getUsersRole = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1; // Página actual, predeterminada a 1 si no se proporciona.
        const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de página, predeterminado a 10 si no se proporciona.

        const offset = (page - 1) * pageSize;

        const {count, rows} = await User.findAndCountAll({
            limit:pageSize,
            offset:offset,
            include: {
                model: Role,
            },
        });
        res.json({
            usersWithRoles:rows,
            total: count
        });
    } catch (error) {
        console.error(error);
        console.error(error.name);
        return res.status(500).json({ message: error.message });
    }
};

export const getRolesAndUsers = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1; // Página actual, predeterminada a 1 si no se proporciona.
        const pageSize = parseInt(req.query.pageSize) || 10; // Tamaño de página, predeterminado a 10 si no se proporciona.

        const offset = (page - 1) * pageSize;

        const {count, rows} = await Role.findAndCountAll({
            limit: pageSize,
            offset:offset,
            include: {
                model: User,
            },
        });
        res.json({
            rolesWithUsers:rows,
            total:count
        });
    } catch (error) {
        console.error(error);
        console.error(error.name);
        return res.status(500).json({ message: error.message });
    }
};

//Actualiza una relacion usuario-rol existente con un rol 
export const updateUserRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        // Busca el usuario y el rol en la base de datos
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);

        if (!user || !role) {
            return res.status(404).json({ message: "Usuario o rol no encontrado." });
        }

        // Actualiza la relación en la tabla intermedia UserRole
        await user.setRoles([role]); // Esto reemplaza los roles existentes con el nuevo rol

        res.json({ message: "Relación usuario-rol actualizada con éxito." });
    } catch (error) {
        console.error(error);
        console.error(error.name);
        return res.status(500).json({ message: error.message });
    }
};

// Actualiza una relación usuario-rol existente con varios roles
export const updateUserRoles = async (req, res) => {
    try {
        const { userId, roleIds } = req.body;

        // Busca el usuario en la base de datos
        const user = await User.findByPk(userId, {
            include: Role, // Incluye la relación con la entidad Role
          });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        // Busca los roles en la base de datos
        const roles = await Role.findAll({
            where: {
                id: roleIds, // Filtra los roles por los IDs proporcionados
            },
        });

        // Actualiza la relación en la tabla intermedia UserRole
        await user.setRoles(roles);

        res.json({ message: "Relación usuario-rol actualizada con éxito.", user });
    } catch (error) {
        console.error(error);
        console.error(error.name);
        return res.status(500).json({ message: error.message });
    }
};

export const deleteUserRole = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        // Busca el usuario y el rol en la base de datos
        const user = await User.findByPk(userId);
        const role = await Role.findByPk(roleId);

        if (!user || !role) {
            return res.status(404).json({ message: "Usuario o rol no encontrado." });
        }

        // Elimina la relación en la tabla intermedia UserRole
        await user.removeRole(role);

        res.json({ message: "Relación usuario-rol eliminada con éxito." });
    } catch (error) {
        console.error(error);
        console.error(error.name);
        return res.status(500).json({ message: error.message });
    }
};

export const getUserWithRoles = async (req, res) => {
    try {
      const userId = req.params.id; // Obtiene el ID del usuario de los parámetros de la URL
  
      // Busca el usuario por su ID e incluye la relación con los roles
      const user = await User.findByPk(userId, {
        include: Role, // Incluye la relación con la entidad Role
      });
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado." });
      }
  
      res.json(user);
    } catch (error) {
      console.error(error);
      console.error(error.name);
      return res.status(500).json({ message: error.message });
    }
  };



