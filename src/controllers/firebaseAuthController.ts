import { Request, Response } from 'express';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, signOut, UserCredential } from "firebase/auth";
import { auth } from "../config/firebase";

export class FirebaseAuthController {
  async registerUser(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    try {
      const userCreds = await createUserWithEmailAndPassword(auth, email, password);
      res.status(200).json({ message: "User registered successfully", userCreds })
    } catch (err) {
      console.log('err:', err);
      return res.status(500).json({ message: "Failed to register user" });
    }
  }
  async loginUser(req: Request, res: Response) {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    try {
      const userCreds: UserCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCreds.user.getIdToken();
      if (!idToken) {
        return res.status(400).json({ message: "Failed to login" });
      }
      res.cookie('access_token', idToken, { httpOnly: true });
      res.status(200).json({ message: "User logged in successfully", userCreds })
    } catch (err) {
      console.log('err:', err);
      return res.status(500).json({ message: "Failed to register user" });
    }
  }
  async logout(req: Request, res: Response) {
    try {
      await signOut(auth);
      res.clearCookie('access_token');
      res.status(200).json({ message: "User logged out successfully" });
    } catch (err) {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
}
