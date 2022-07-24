import express, { Request, Response } from "express";
import { body, param } from "express-validator";
import jwt from "jsonwebtoken";
import {
  validateRequest,
  NotFoundError,
  BadRequestError,
} from "@kjbuku/common";
import { User } from "../models/user";
import { Password } from "../services/Password";

const router = express.Router();

router.patch(
  "/api/users/:userId",
  [param("userId").isMongoId().withMessage("Invalid MongoDB ObjectId")],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      newPassword,
      isAdmin,
      nama,
      foto,
      jsonAlamatKirim,
    } = req.body;

    const user = await User.findById(req.params.userId);

    if (!user) {
      throw new NotFoundError();
    }

    if (password && password !== "") {
      const existingUser = await User.findOne({ nama });

      if (!existingUser) {
        throw new BadRequestError("Password atau email salah");
      }

      const passwordMatch = await Password.compare(
        existingUser.password,
        password
      );

      if (!passwordMatch) {
        throw new BadRequestError("Password Salah");
      }
    }

    let alamatKirim; //่JSON
    if (typeof jsonAlamatKirim === "string") {
        alamatKirim = await JSON.parse(jsonAlamatKirim);
    } else if (typeof jsonAlamatKirim === "object") {
        alamatKirim = jsonAlamatKirim;
    }

    user.set({
      email: email !== "" ? email : user.email,
      password: newPassword ? newPassword : password ?? user.password,
      isAdmin: isAdmin !== undefined ? isAdmin : user.isAdmin,
      nama: nama !== "" ? nama : user.nama,
      foto: foto !== "" ? foto : user.foto,
      alamatKirim: alamatKirim ? alamatKirim : user.alamatKirim,
    });

    await user.save();

    // Generate JWT
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        nama: user.nama,
        foto: user.foto,
        alamatKirim: user.alamatKirim,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJWT,
    };

    res.send(user);
  }
);

export { router as updateUserRouter };
