import { Router } from "express";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { deleteFileOnError } from "../middlewares/delete-file-on-error.js"
import { deleteUser, deleteUserAdmin, getUserById, getUserByRole, getUsers, login, register, updateRole, updateUser, updateUserAdmin } from "./user.controller.js";

const router = Router();

router.post(
    "/login",
    deleteFileOnError,
    login
)

router.post(
    "/register",
    deleteFileOnError,
    register
)

router.get(
    "/",
    getUsers
)

router.get(
    "/search/",
    validarJWT,
    validarCampos,
    getUserById
)

router.get(
    "/role/:role",
    getUserByRole
)

router.put(
    "/",
    validarJWT,
    updateUser
)

router.put(
    "/updateUsers/:id",
    [
        validarJWT,
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    updateUserAdmin
)

router.put(
    "/role/:id",
    [
        validarJWT,
        check("id", "Invalid ID").not().isEmpty(),
        check("role", "Invalid role. Valid role are: USER or ADMIN_WEB or ADMIN_HOTEL").isIn(["USER", "ADMIN_WEB", "ADMIN_HOTEL"]),
        validarCampos
    ],
    updateRole
)

router.delete(
    "/",
    validarJWT,
    deleteUser
)

router.delete(
    "/deleteUsers/:id",
    [
        validarJWT,
        check("id", "Invalid ID").not().isEmpty(),
        validarCampos
    ],
    deleteUserAdmin
)

export default router;