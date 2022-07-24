import express, { Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { BadRequestError, validateRequest } from '@kjbuku/common';
import { User } from "../models/user";

const router = express.Router();

router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email Harus Valid"),
    body("password")
      .trim()
      .isLength({ min: 4, max: 20 })
      .withMessage("Password harus diantara 4 and 20 karakter"),
    body("nama").not().isEmpty().withMessage("Nama harus diisi"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const {
      email,
      password,
      isAdmin,
      nama,
      jsonAlamatKirim,
    } = req.body;
    let { foto } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new BadRequestError("Email telah digunakan");
    }
    const user = User.build({
      email,
      password,
      isAdmin,
      nama,
      foto,
      alamatKirim: jsonAlamatKirim,
    });
    await user.save();

    // Generate JWT
    const userJWT = jwt.sign(
      {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        nama,
        foto,
        alamatKirim: jsonAlamatKirim,
      },
      process.env.JWT_KEY!
    );

    // Store it on session object
    req.session = {
      jwt: userJWT,
    };

    res.status(201).send(user);
  }
);

export { router as signupRouter };
