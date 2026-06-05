import logger from '#config/logger.js';
import { getAllUsers, getUserById as getUserByIdService, updateUser as updateUserService, deleteUser as deleteUserService } from '#services/users.services.js';
import { userIdSchema, updateUserSchema } from '#validations/users.validation.js';

export const fetchAllUsers = async(req, res, next) => {
  try{
    logger.info('getting users ... ');

    const allUsers = await getAllUsers();

    res.json({
      message: 'Successfully retrieved all users',
      users: allUsers,
      count: allUsers.length,
    });
  }
  catch(e){
    logger.error(e);
    next(e);
  }
};

export const fetchUserById = async (req, res, next) => {
  try {
    const { params } = userIdSchema.parse(req);
    logger.info(`getting user ${params.id} ... `);

    const user = await getUserByIdService(params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: 'Successfully retrieved user',
      user
    });
  } catch(e) {
    if (e.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation Error', errors: e.errors });
    }
    logger.error(e);
    next(e);
  }
};

export const updateUserById = async (req, res, next) => {
  try {
    const validatedData = updateUserSchema.parse(req);
    const targetUserId = validatedData.params.id;
    const updates = validatedData.body;
    
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    // Check if user is modifying themselves or is admin
    if (currentUser.id !== targetUserId && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Cannot update other users' });
    }

    // Check role modification permissions
    if (updates.role && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Only admins can change roles' });
    }

    logger.info(`updating user ${targetUserId} ...`);
    const updatedUser = await updateUserService(targetUserId, updates);

    res.json({
      message: 'Successfully updated user',
      user: updatedUser
    });
  } catch(e) {
    if (e.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation Error', errors: e.errors });
    }
    if (e.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    logger.error(e);
    next(e);
  }
};

export const deleteUserById = async (req, res, next) => {
  try {
    const { params } = userIdSchema.parse(req);
    logger.info(`deleting user ${params.id} ...`);
    
    const currentUser = req.user;
    if (!currentUser) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    
    if (currentUser.id !== params.id && currentUser.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden: Cannot delete other users' });
    }

    await deleteUserService(params.id);
    
    res.json({
      message: 'Successfully deleted user'
    });
  } catch(e) {
    if (e.name === 'ZodError') {
      return res.status(400).json({ message: 'Validation Error', errors: e.errors });
    }
    if (e.message === 'User not found') {
      return res.status(404).json({ message: 'User not found' });
    }
    logger.error(e);
    next(e);
  }
};