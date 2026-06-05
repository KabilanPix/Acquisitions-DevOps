import { db } from '#config/database.js';
import logger from '#config/logger.js';
import { users } from '#models/user.model.js';
import { eq } from 'drizzle-orm';

export const getAllUsers = async () => {
  try{
    return await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
    }).from(users);
  }
  catch(e){
    logger.error('Error getting all users',{cause : e});
    throw e;
  }
};

export const getUserById = async (userId) => {
  try {
    const user = await db.select({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
    }).from(users).where(eq(users.id, userId)).limit(1);

    if (!user.length) throw new Error('User not found');
    return user[0];
  } catch(e) {
    logger.error('Error getting user by id', { cause: e });
    throw e;
  }
};

export const updateUser = async (userId, updates) => {
  try {
    const user = await db.update(users).set(updates).where(eq(users.id, userId)).returning({
      id: users.id,
      name: users.name,
      email: users.email,
      role: users.role,
      created_at: users.created_at,
    });

    if (!user.length) throw new Error('User not found');
    return user[0];
  } catch(e) {
    logger.error('Error updating user', { cause: e });
    throw e;
  }
};

export const deleteUser = async (userId) => {
  try {
    const user = await db.delete(users).where(eq(users.id, userId)).returning();

    if (!user.length) throw new Error('User not found');
    return user[0];
  } catch(e) {
    logger.error('Error deleting user', { cause: e });
    throw e;
  }
};