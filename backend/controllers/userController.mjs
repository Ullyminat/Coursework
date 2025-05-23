import User from "../models/user.mjs";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import UMK from "../models/umk.mjs";
import Spec from "../models/spec.mjs";

configDotenv();
export default class UserController{
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(404).json({ msg: 'Не найден' });
            }
    
            const passwordMatch = await bcrypt.compare(password, user.password);
            if (!passwordMatch) {
                return res.status(404).json({ msg: 'Не найден' });
            }
    
            const payload = {
                _id: user._id,
                role: user.role,
                email: user.email,
            };
            const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '10h' });
    
            res.cookie('token', token, {
                httpOnly: true,
                secure: true,
                sameSite: 'lax',
                maxAge: 86400000,
              });
    
            return res.status(200).json({ user: { telephone: user.telephone, _id: user._id }, token });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async changePassword(req, res) {
        try {
            const userId = req.user._id;
            const { newPassword } = req.body;
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ msg: "Пользователь не найден" });
            }
            if (!newPassword || newPassword.trim().length === 0) {
                return res.status(400).json({ msg: `Пароль не может быть пустым` });
            }
            user.password = await bcrypt.hash(newPassword, 5);
            await user.save();
            return res.status(200).json({ msg: "Пароль успешно изменен!" });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async changeFIO(req, res) {
      try {
          const userId = req.user._id;
          const { name, surname, patronymic } = req.body;;
          const user = await User.findByIdAndUpdate(userId,{name:name, surname: surname, patronymic: patronymic})
          await user.save();
          return res.status(200).json({ msg: "Всё ок" });
      } catch (error) {
          console.log(error);
          return res.status(500).json({ error: error.message });
      }
  }

    static async logout(req, res) {
        try {
            res.clearCookie('token');
            return res.status(200).json({ msg: 'Вы успешно вышли из системы' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async Me(req, res) {
        try {
          const user = await User.findById(req.user._id).select('-password');
          res.json(user);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
    }

    static async getCabinets(req, res) {
        try {
          console.log('Fetching cabinets for user:', req.user._id);
          const user = await User.findById(req.user._id).populate('cabinets');
          if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
          }
          console.log('User cabinets:', user.cabinets);
          res.json(user.cabinets);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
      }

    static async getUMK(req, res) {
        try {
          const umk = await UMK.find();
          console.log(umk);
          res.json(umk);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
      }

      static async getSpec(req, res) {
        try {
          const spec = await Spec.find();
          console.log(spec);
          res.json(spec);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
      }

      static async getSchema(req, res) {
        try {
          const user = await User.findById(req.user._id).populate('schemas');
          if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
          }
          res.json(user.schemas);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
      }

      static async getPasport(req, res) {
        try {
          const user = await User.findById(req.user._id).populate('pasports');
          if (!user) {
            console.log('User not found');
            return res.status(404).json({ error: 'User not found' });
          }
          res.json(user.pasports);
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
      }
}