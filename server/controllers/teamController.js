import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response';
const prisma = new PrismaClient();

export const getAllTeams = async (req, res) => {};
export const getTeamById = async (req, res) => {};
export const createTeam = async (req, res) => {};
export const updateTeam = async (req, res) => {};
export const deleteTeam = async (req, res) => {};
export const undeleteTeam = async (req, res) => {};