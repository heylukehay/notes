import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response';
import { validateUserCreation, validateUserUpdate } from '../utils/validation/userValidation';
import { bcrypt } from 'bcrypt';
const prisma = new PrismaClient();

// @desc Fetches all users from the database, optionally including deleted users
// @route GET /api/users
// @access Private
// @queryParam all - if true, fetches all users including deleted ones
// @returns {Object} - List of users with their details
// @returns {Object} - Error if no users found or if there is an internal error
// @internalCode - USERS_FETCH_SUCCESS, USERS_NOT_FOUND, USERS_FETCH_INTERNAL_ERROR
// @statusCode - 200, 404, 500,         
export const getAllUsers = async (req, res) => {
    const includeDeleted = req.query.all === 'true';

    try {
        const users = await prisma.user.findMany({
            where: includeDeleted ? {} : { deletedAt: null },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            }
        });
        if (users.length === 0) {
            return errorResponse(res, {
                message: 'No users found',
                statusCode: 404,
                internalCode: 'USERS_NOT_FOUND',
            });
        }
        return successResponse(res, {
            message: `Fetched ${users.length} users successfully`,
            statusCode: 200,
            internalCode: 'USERS_FETCH_SUCCESS',
            data: users,
        });
    } catch (err) {
        return errorResponse(res, {
            message: 'Failed to fetch users',
            statusCode: 500,
            internalCode: 'USERS_FETCH_INTERNAL_ERROR',
        });
    }
};

// @desc Fetches a user by their ID
// @route GET /api/users/:id
// @access Private
// @queryParam id - ID of the user to fetch
// @returns {Object} - User details if found
// @returns {Object} - Error if user not found or if there is an internal error
// @internalCode - USER_FETCH_SUCCESS, USER_NOT_FOUND, USER_FETCH_BY_ID_INTERNAL_ERROR
// @statusCode - 200, 404, 500
export const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            }
        });

        if (!user) {
            return errorResponse(res, {
                message: 'User not found',
                statusCode: 404,
                internalCode: 'USER_NOT_FOUND',
            });
        }

        return successResponse(res, {
            message: 'User fetched successfully',
            statusCode: 200,
            internalCode: 'USER_FETCH_SUCCESS',
            data: user,
        });
    } catch (err) {
        return errorResponse(res, {
            message: 'Failed to fetch user by ID',
            statusCode: 500,
            internalCode: 'USER_FETCH_BY_ID_INTERNAL_ERROR',
        });
    }
}

export const getUserByUsername = async (req, res) => {
    const { username } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { username: username },
            select: {
                id: true,
                username: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            }
        });

        if (!user) {
            return errorResponse(res, {
                message: 'User not found',
                statusCode: 404,
                internalCode: 'USER_NOT_FOUND',
            });
        }

        return successResponse(res, {
            message: 'User fetched successfully',
            statusCode: 200,
            internalCode: 'USER_FETCH_SUCCESS',
            data: user,
        });
    } catch (err) {
        return errorResponse(res, {
            message: 'Failed to fetch user by username',
            statusCode: 500,
            internalCode: 'USER_FETCH_BY_USERNAME_INTERNAL_ERROR',
        });
    }

};

export const createUser = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return errorResponse(res, {
            message: 'Username and password are required',
            statusCode: 400,
            internalCode: 'USER_CREATION_VALIDATION_ERROR',
        });
    }

    try {
        const userExists = await prisma.user.findUnique({
            where: { username: username }
        });

        if (userExists) {
            return errorResponse(res, {
                message: 'Username already exists',
                statusCode: 409,
                internalCode: 'USER_CREATION_CONFLICT',
            });
        }

        const newUser = await prisma.user.create({
            data: {
                username: username,
                password: password,
                createdAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return successResponse(res, {
            message: `User ${newUser.username} created successfully`,
            statusCode: 201,
            internalCode: 'USER_CREATION_SUCCESS',
            data: {
                id: newUser.id,
                username: newUser.username,
                createdAt: newUser.createdAt,
                updatedAt: newUser.updatedAt,
            },
        });

    } catch (err) {
        return errorResponse(res, {
            message: 'Failed to create user',
            statusCode: 500,
            internalCode: 'USER_CREATION_INTERNAL_ERROR',
        });
    }

};

export const updateUser = async (req, res) => {
    const { id } = req.params;
    const { username, password } = req.body;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });

        if (!user) {
            return errorResponse(res, {
                message: 'User not found',
                statusCode: 404,
                internalCode: 'USER_NOT_FOUND',
            });
        }

        if (user.deletedAt) {
            return errorResponse(res, {
                message: `Cannot update deleted user ${user.username}`,
                statusCode: 409,
                internalCode: 'USER_UPDATE_DELETED',
            });
        }

        if (!username && !password) {
            return errorResponse(res, {
                message: 'At least one field (username or password) must be provided for update',
                statusCode: 400,
                internalCode: 'USER_UPDATE_VALIDATION_ERROR',
            });
        }

        if (username) {
            const existingUser = await prisma.user.findUnique({
                where: { username: username }
            });
            if (existingUser && existingUser.id !== user.id) {
                return errorResponse(res, {
                    message: `Username ${username} already exists`,
                    statusCode: 409,
                    internalCode: 'USER_UPDATE_CONFLICT',
                });
            }
        }

        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                username: username ?? user.username,
                password: password ?? user.password,
                updatedAt: new Date(),
            },
        });

        return successResponse(res, {
            message: `User ${updatedUser.username} updated successfully`,
            statusCode: 200,
            internalCode: 'USER_UPDATE_SUCCESS',
            data: updatedUser,
        });
    } catch (err) {
        return errorResponse(res, {
            message: 'Failed to update user',
            statusCode: 500,
            internalCode: 'USER_UPDATE_INTERNAL_ERROR',
        });
    }

};

export const deleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });

        if (!user) {
            return errorResponse(res, {
                message: 'User not found',
                statusCode: 404,
                internalCode: 'USER_NOT_FOUND',
            });
        }
        if (user.deletedAt) {
            return errorResponse(res, {
                message: 'User already deleted',
                statusCode: 409,
                internalCode: 'USER_DELETION_REDUNDANT',
            });
        }

        await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                deletedAt: new Date(),
                updatedAt: new Date(),
            },
        });

        return successResponse(res, {
            message: `User ${user.username} deleted successfully`,
            statusCode: 200,
            internalCode: 'USER_DELETION_SUCCESS',
        });
    } catch (err) {
        return errorResponse(res, {
            message: 'Failed to delete user',
            statusCode: 500,
            internalCode: 'USER_DELETION_INTERNAL_ERROR',
        });
    }
};

export const undeleteUser = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });

        if (!user) {
            return errorResponse(res, {
                message: 'User not found',
                statusCode: 404,
                internalCode: 'USER_NOT_FOUND',
            });
        }

        if (user.deletedAt === null) {
            return errorResponse(res, {
                message: 'User already not deleted',
                statusCode: 409,
                internalCode: 'USER_UNDELETION_REDUNDANT',
            });
        }

        await prisma.user.update({
            where: { id: parseInt(id) },
            data: {
                deletedAt: null,
                updatedAt: new Date(),
            },
        });

        return successResponse(res, {
            message: 'User undeleted successfully',
            statusCode: 200,
            internalCode: 'USER_UNDELETION_SUCCESS',
        });
    } catch (err) {
        return errorResponse(res, {
            message: 'Failed to undelete user',
            statusCode: 500,
            internalCode: 'USER_UNDELETION_INTERNAL_ERROR',
        });

    }
};
