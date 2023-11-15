import { createTransport } from 'nodemailer';
import exceljs from 'exceljs';
import moment from 'moment';
import { User } from '../models/User.js'
import { Role } from '../models/Role.js'
import cron from 'node-cron';

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

        const { count, rows } = await User.findAndCountAll({
            limit: pageSize,
            offset: offset,
            include: {
                model: Role,
            },
        });
        res.json({
            usersWithRoles: rows,
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

        const { count, rows } = await Role.findAndCountAll({
            limit: pageSize,
            offset: offset,
            include: {
                model: User,
            },
        });
        res.json({
            rolesWithUsers: rows,
            total: count
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


async function obtenerSuperadmins() {
    try {
        // Busca todos los registros en la tabla intermedia UserRole
        const relacionesUsuarioRol = await UserRole.findAll();

        // Busca el rol 'Super Admin' en la base de datos
        const superAdminRole = await Role.findOne({
            where: {
                roleName: 'Super Admin', // Ajusta según la estructura de tu modelo de Role
            },
        });

        if (!superAdminRole) {
            return null; // Rol 'Super Admin' no encontrado
        }

        // Filtra las relaciones para obtener solo las que tienen el rol 'Super Admin'
        const relacionesSuperAdmin = relacionesUsuarioRol.filter(relacion => relacion.roleId === superAdminRole.id);

        // Obtiene los IDs de usuario correspondientes a las relaciones 'Super Admin'
        const idsUsuariosSuperAdmin = relacionesSuperAdmin.map(relacion => relacion.userId);

        // Busca los usuarios con los IDs obtenidos
        const usuariosSuperAdmin = await User.findAll({
            where: {
                id: idsUsuariosSuperAdmin,
            },
        });

        // Obtén los correos electrónicos de los usuarios 'Super Admin'
        const correosSuperAdmin = usuariosSuperAdmin.map(usuario => usuario.email);

        return correosSuperAdmin;
    } catch (error) {
        console.error(error);
        throw error;
    }
};

export const enviarCorreosSuperadmins = async (req, res) => {
    try {
        const superadmins = await obtenerSuperadmins();

        if (superadmins && superadmins.length > 0) {
            const horaEnvioCorreo = req.body.horaEnvioCorreo || '00:00:00';
            const fechaEnvioCorreo = moment().startOf('day').add(moment.duration(horaEnvioCorreo));

            // Verifica si la hora actual es posterior a la hora de envío configurada
            while (moment() < fechaEnvioCorreo) {
                await new Promise(resolve => setTimeout(resolve, 60000)); // Espera 1 minuto antes de volver a verificar
            }

            const config = {
                host: 'smtp.gmail.com',
                port: 587,
                auth: {
                    user: 'apirestdistribuidos@gmail.com',
                    pass: 'iibu iqrd mdhi swgo',
                },
            };

            const transport = createTransport(config);

            const workbook = new exceljs.Workbook();
            const worksheet = workbook.addWorksheet('Usuarios');
            worksheet.columns = [
                { header: 'ID', key: 'id', width: 5 },
                { header: 'Nombre', key: 'name', width: 20 },
                { header: 'Apellido', key: 'lastName', width: 20 },
            ];

            superadmins.forEach((superadmin) => {
                worksheet.addRow({
                    id: superadmin.id,
                    name: superadmin.name,
                    lastName: superadmin.lastName,
                });
            });

            const xlsBuffer = await workbook.xlsx.writeBuffer();

            const fechaActual = moment().format('YYYY-MM-DD HH:mm:ss'); // Obtiene la fecha y hora actual formateada

            const mensaje = {
                from: 'apirestdistribuidos@gmail.com',
                to: superadmins.map(superadmin => superadmin.email), 
                subject: `USUARIOS CREADOS - ${fechaActual}`, // Utiliza la fecha y hora en el asunto
                text: 'Listado de usuarios adjunto en un archivo XLS.',
                attachments: [
                    {
                        filename: 'usuarios.xlsx',
                        content: xlsBuffer,
                    },
                ],
            };

            const info = await transport.sendMail(mensaje);

            res.status(200).json({ message: 'Correos enviados correctamente', info });
        } else {
            res.status(404).json({ message: 'No hay superadmins para enviar correos.' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al enviar el correo electrónico', error });
    }
};



