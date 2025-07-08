import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response';
const prisma = new PrismaClient();

export const getAllNotes = async (req, res) => {
    const includeDeleted = req.query.all === 'true';

    try {
        const notes = await prisma.note.findMany({
            where: includeDeleted ? {} : { deletedAt: null },
            select: {
                id: true,
                userId: true,
                title: true,
                content: true,
                visibility: true,
                createdAt: true,
                updatedAt: true,
                deletedAt: true,
            },
            include: { author: true }
        });
        return successResponse(res, {
            message: `Fetched ${notes.length} notes successfully`,
            statusCode: 200,
            internalCode: 'NOTES_FETCH_SUCCESS',
            data: notes,
        });
    } catch (err) {
        return errorResponse(res, {
            message: 'Failed to fetch notes',
            statusCode: 500,
            internalCode: 'NOTES_FETCH_INTERNAL_ERROR',
        });
    }
};

export const getAllNotesByUserId = async (req, res) => { };
export const getNoteById = async (req, res) => { };
export const createNote = async (req, res) => { };
export const updateNote = async (req, res) => { };
export const deleteNote = async (req, res) => { };

export const undeleteNote = async (req, res) => {
    const { id } = req.params;

    try {
        const note = await prisma.user.findUnique({
            where: { id: parseInt(id) }
        });

        if (!note) {
            return errorResponse(res, {
                message: 'Note not found',
                statusCode: 404,
                internalCode: 'NOTE_NOT_FOUND',
            });
        }

        if (note.deletedAt === null) {
            return errorResponse(res, {
                message: 'Note already not deleted',
                statusCode: 409,
                internalCode: 'NOTE_UNDELETION_REDUNDANT',
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
            message: 'Note undeleted successfully',
            statusCode: 200,
            internalCode: 'NOTE_UNDELETION_SUCCESS',
        });
    } catch (err) {
        return errorResponse(res, {
            message: 'Failed to undelete note',
            statusCode: 500,
            internalCode: 'NOTE_UNDELETION_INTERNAL_ERROR',
        });

    }
};