import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import { configDotenv } from 'dotenv';
import User from "../models/user.mjs";
import Cabinet from "../models/cabinet.mjs";
import Spec from "../models/spec.mjs";

configDotenv();

export default class AdminController{
    static async create(req,res){
        try{
            const {name,surname,patronymic,email,password,cabinets, role} = req.body;
            const hashed = await bcrypt.hash(password,5);
            const user = new User({
                name,
                surname,
                patronymic,
                email,
                password:hashed,
                cabinets,
                role
            });
            await user.save();
            res.status(201).json({msg:'Создан'});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    static async getUsers(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const total = await User.countDocuments();
            
            if(page < 1) throw new Error('Некорректный номер страницы');
            
            const skip = (page - 1) * limit;
            const pages = Math.ceil(total / limit);
            
            const users = await User.find().skip(skip).limit(limit).select('-password').populate('cabinets schemas pasports'); // Исключаем пароль, добавляем связанные данные
    
            return res.status(200).json({ total, currentPage: page, pages, limit, users });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    static async changeRole(req,res) {
        try {
            const {id} = req.params;
            const {role} = req.body;
            await User.findByIdAndUpdate(id,{role},{new:true})
            return res.status(200).json({msg: 'Вы успешно сменили роль'});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    static async addCabinetToUser(req, res) {
        try {
            const { id } = req.params;
            const { cabinets: newCabinets } = req.body;

            //Объединение массивов и удаление дубликатов
            const updatedCabinets = [...new Set([...user.cabinets, ...newCabinets])];
    
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { cabinets: updatedCabinets },
                { new: true }
            ).populate('cabinets');
    
            return res.status(200).json({
                message: 'Кабинеты успешно добавлены',
                user: updatedUser
            });
    
        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                error: "Ошибка при добавлении кабинетов",
                details: error.message 
            });
        }
    }

    static async createCabinet(req,res) {
        try {
            const {cabinet, year, S, name} = req.body;
            const cab = new Cabinet({
                cabinet,
                year,
                S,
                name
            });
            await cab.save();
            res.status(201).json({msg:'Создан кабинет'});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    static async createSpec(req,res) {
        try {
            const {name} = req.body;
            const spec = new Spec({
                name
            });
            await spec.save();
            res.status(201).json({msg:'Создана специализация'});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    static async getCabinets(req, res) {
        try {
            const alldata = await Cabinet.find()
            res.json(alldata)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
      }

    static async deleteUser(req, res) {
        try {
            const {id} = req.params;
            await User.findByIdAndDelete(id);
            return res.status(200).json({msg: 'Пользователь удалён'});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }
}