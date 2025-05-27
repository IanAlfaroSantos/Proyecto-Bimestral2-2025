import User from "../users/user.model.js";
import { hash, verify } from "argon2";

//VALIDACIONES USERS
export const existenteEmail = async (email = ' ') => {
    
    const existeEmail = await User.findOne({ email });
    
    if (existeEmail) {
        throw new Error(`El email ${ email } ya existe en la base de datos`);
    }
}

export const existenteUsername = async (username = ' ') => {
    
    username = username.toLowerCase();
    
    const existeUsername = await User.findOne({ username });
    
    if (existeUsername) {
        throw new Error(`El username ${ username } ya existe en la base de datos`);
    }
}


export const existeUserById = async (id = '') => {

    if (!/^[0-9a-fA-F]{24}$/.test(id)) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }

    const existeUser = await User.findById(id);

    if (!existeUser) {
        throw new Error(`El ID ${id} no existe en la base de datos`);
    }
}

export const existeUser = async ( email = ' ', username = ' ') => {
    
    const user = await User.findOne({
        $or: [{ email }, { username }]
    });

    if (email && !user) {
        const userWithEmail = await User.findOne({ email });
        if (!userWithEmail) {
            throw new Error(`El email ${email} no existe en la base de datos`);
        }
    }

    if (username && !user) {
        const userWithUsername = await User.findOne({ username });
        if (!userWithUsername) {
            throw new Error(`El username ${username} no existe en la base de datos`);
        }
    }
}

export const statusUser = async (user) => {
    
    if (user.status === false) {
        throw new Error('Usuario desactivado o ya esta desactivado');
    }
}

export const verificarContraseña = async (user, password = '') => {

    const validarPassword = await verify(user.password, password);

    if (!validarPassword) {
        throw new Error('Contraseña incorrecta');
    }
}

export const noActualizarAdmin = async (id) => {

    const user = await User.findById(id);
    
    if (user.username === "administradorweb" || user.username === "administradorhotel") {
        throw new Error('No se puede actualizar o eliminar a los ADMIN por defecto');
    }
}

export const verificarUsuarioExistente = async (username, user) => {

    if (username && username !== user.username) {
        const existingUser = await User.findOne({ username });

        if (existingUser && existingUser._id.toString() !== user._id.toString()) {
            throw new Error(`El nombre de usuario ${ username } ya existe en la base de datos`);
        }
    }
}

export const validarPasswordUpdate = async (user, password, currentPassword) => {

    if (password) {
        if (!currentPassword) {
            throw new Error('Debes proporcionar la contraseña actual para cambiarla');
        }

        const verifyPassword = await verify(user.password, currentPassword);

        if (!verifyPassword) {
            throw new Error('Contraseña actual incorrecta');
        }

        user.password = await hash(password);
        await user.save();
    }
}

export const soloAdmin = async (req) => {
    
    if (req.user.role !== "ADMIN_WEB") {
        throw new Error("Solo los ADMIN_WEB pueden actualizar el rol de otros usuarios");
    }
}

export const validarUsernameParaEliminar = async (username = '') => {
    if (!username) {
        throw new Error('Necesita proporcionar su username para poder eliminar');
    }
}

export const pedirPassword = async (password = '') => {
    if (!password) {
        throw new Error('Necesita proporcionar su contraseña para poder eliminar');
    }
}

export const coincidirUsername = async (username, user) => {
    if (user.username.toLowerCase() !== username.toLowerCase()) {
        throw new Error('El nombre de usuario es incorrecto');
    }
}

export const phoneLength = async (phone = ' ') => {

    if (phone.length > 8 || phone.length < 8) {
        throw new Error('El número de telefono debe contener exactamente 8 caracteres');
    }
}

export const passwordLength = async (password = ' ') => {

    if (password.length > 10 || password.length < 8) {
        throw new Error('La contraseña debe contener minimo 8 caracteres y maximo 10 caracteres');
    }
}

export const validarPasswordParaEliminar = async (user, password) => {

    const validPassword = await verify(user.password, password);
    if (!validPassword) {
        throw new Error('Contraseña incorrecta');
    }
}

export const validarRole = async (role = '') => {
    if (!["USER", "ADMIN_HOTEL", "ADMIN_WEB"].includes(role)) {
        throw new Error("Role invalido, solo se permiten 'USER' o 'ADMIN_WEB' o 'ADMIN_HOTEL'");
    }
}

export const noExistenUserRole = async (users, role) => {
    if (users.length === 0) {
        throw new Error(`No se encontraron usuarios con el rol ${ role }`);
    }
}

export const crearAdminWebSiNoExiste = async () => {
    const verifyUser = await User.findOne({ username: "administradorweb".toLowerCase() });

    if (!verifyUser) {
        const encryptedPassword = await hash("Admin100");

        const adminUser = new User({
            name: "Ian",
            surname: "Alfaro",
            username: "administradorweb".toLowerCase(),
            email: "adminweb@gmail.com",
            phone: "78212654",
            password: encryptedPassword,
            role: "ADMIN_WEB"
        });

        await adminUser.save();

        console.log(" ");
        console.log("El usuario ADMIN_WEB fue creado exitosamente");
        console.log(" ");
    } else {
        console.log(" ");
        console.log("El usuario ADMIN_WEB ya existe, no se creó nuevamente");
        console.log(" ");
    }
}

export const crearAdminHotelSiNoExiste = async () => {
    const verifyUser = await User.findOne({ username: "administradorhotel".toLowerCase() });

    if (!verifyUser) {
        const encryptedPassword = await hash("Admin100");

        const adminUser = new User({
            name: "Pablo",
            surname: "Castillo",
            username: "administradorhotel".toLowerCase(),
            email: "adminhotel@gmail.com",
            phone: "22345366",
            password: encryptedPassword,
            role: "ADMIN_HOTEL"
        });

        await adminUser.save();

        console.log(" ");
        console.log("El usuario ADMIN_HOTEL fue creado exitosamente");
        console.log(" ");
    } else {
        console.log(" ");
        console.log("El usuario ADMIN_HOTEL ya existe, no se creó nuevamente");
        console.log(" ");
    }
}