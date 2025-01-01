/// <reference path="../types/custom.d.ts" />

import { Request, Response } from 'express';
import User, { IUser } from '../models/User';
import { auth } from '../config/firebase';
import { DeleteResult } from 'mongoose';

export class UserController {
  async createUser(data: IUser): Promise<IUser> {
    try {
      const doc = new User({ ...data })
      const user = await doc.save();
      return user;
    } catch (err) {
      throw new Error("Unable to create user");
    }
  }
  async getAllUsers(req: Request, res: Response): Promise<Omit<IUser, 'firebaseUID'>[] | undefined> {
    try {
      const users = await User.find({}, { email: 1, firstName: 1, lastName: 1, nickName: 1, avatarUrl: 1, _id: 0 });
      res.json(users);
      return users;
    } catch (err) {
      res.status(500).json({ message: "failed to get users" });
    }
  }
  async getUserById(req: Request, res: Response): Promise<Omit<IUser, 'firebaseUID'> | undefined | null> {
    const userId = req.params.id;
    try {
      const user = await User.findOne({ firebaseUID: userId }, { email: 1, firstName: 1, lastName: 1, nickName: 1, avatarUrl: 1, _id: 1 });
      res.json(user);
      return user;
    } catch (err) {
      res.status(500).json({ message: "failed to get user" });
    }
  }
  async updateUser(req: Request, res: Response): Promise<IUser | undefined | null> {
    const userId = req.params.id;
    const uid = req.user.uid;
    const user = await User.findById(userId);
    if (user?.firebaseUID !== uid) {
      res.status(400).json({ message: "allowed update only your account" });
      return;
    }
    try {
      const user = await User.findByIdAndUpdate({
        _id: userId
      }, {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        nickName: req.body.nickName,
      });
      res.status(200).json(user);
      return user;
    } catch (err) {
      res.status(500).json({ message: "failed to update user" });
    }
  }
  async deleteUser(req: Request, res: Response): Promise<DeleteResult | undefined> {
    const userId = req.params.id;
    const uid = req.user.uid;
    const user = await User.findById(userId);
    if (user?.firebaseUID !== uid) {
      res.status(400).json({ message: "please delete only your acc" });
      return;
    }
    try {
      const user = await User.deleteOne({ firebaseUID: userId });
      await auth.currentUser?.delete();

      res.status(200).json({ message: "user deleted succesfully" })
      return user;
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "failed to delete user" });
    }
  }
} 