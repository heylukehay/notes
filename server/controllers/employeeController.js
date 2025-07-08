import { PrismaClient } from '@prisma/client';
import { successResponse, errorResponse } from '../utils/response';
const prisma = new PrismaClient();

export const getAllEmployees = async (req, res) => {};
export const getEmployeeById = async (req, res) => {};
export const createEmployee = async (req, res) => {};
export const updateEmployee = async (req, res) => {};
export const deleteEmployee = async (req, res) => {};
export const undeleteEmployee = async (req, res) => {};