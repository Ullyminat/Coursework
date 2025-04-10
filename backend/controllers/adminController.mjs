import bcrypt from "bcrypt";
import { configDotenv } from 'dotenv';
import User from "../models/user.mjs";
import Cabinet from "../models/cabinet.mjs";
import Spec from "../models/spec.mjs";
import UMK from "../models/umk.mjs";

configDotenv();

export default class AdminController{
    // Создание пользователя
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

    // Получение пользователей с пагинацией
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

    // Получение УМК с пагинацией
    static async getUMKs(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const total = await UMK.countDocuments();
            
            if(page < 1) throw new Error('Некорректный номер страницы');
            
            const skip = (page - 1) * limit;
            const pages = Math.ceil(total / limit);
            
            const umks = await UMK.find().skip(skip).limit(limit);
            return res.status(200).json({ total, currentPage: page, pages, limit, umks });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    // Получение кабинетов с пагинацией
    static async getCabinets(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const total = await Cabinet.countDocuments();
            
            if (page < 1) throw new Error('Некорректный номер страницы');
            
            const skip = (page - 1) * limit;
            const totalPages = Math.ceil(total / limit);
            
            const cabinets = await Cabinet.find().skip(skip).limit(limit);
            
            return res.status(200).json({total,currentPage: page,totalPages,limit,cabinets:cabinets});
        } catch (error) {
            console.error('Ошибка в getCabinets:', error);
            return res.status(500).json({ 
                error: error.message || 'Внутренняя ошибка сервера' 
            });
        }
    }

    // Получение специализаций с пагинацией    
    static async getSpecs(req, res) {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 10;
            const total = await Spec.countDocuments();
            
            if(page < 1) throw new Error('Некорректный номер страницы');
            
            const skip = (page - 1) * limit;
            const pages = Math.ceil(total / limit);
            
            const specs = await Spec.find().skip(skip).limit(limit);
            return res.status(200).json({ total, currentPage: page, pages, limit, specs });
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    // Смена роли для пользователей
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

    // Получение пользователя
    static async getUser(req,res) {
        try {
            const {id} = req.params;
            const user = await User.findById(id);
            return res.status(200).json(user);
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    // Изменение кабинетов для пользователя
    static async updateUserCabinets(req, res) {
        try {
            const { id } = req.params;
            const { cabinets } = req.body;
            const user = await User.findById(id)
            
            // Удаляем дубликаты
            const uniqueCabinets = [...new Set(cabinets)];
            
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { cabinets: uniqueCabinets },
                { new: true }
            ).populate('cabinets');

            return res.status(200).json({
                message: 'Кабинеты успешно обновлены',
                user: updatedUser
            });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ 
                error: "Ошибка при обновлении кабинетов",
                details: error.message 
            });
        }
    }

    // Создание кабинета
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

    // Создание специализации
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

    // Создание УМК
    static async createUMK(req,res) {
        try {
            const {name, year} = req.body;
            const umk = new UMK({
                name,
                year
            });
            await umk.save();
            res.status(201).json({msg:'Создан УМК'});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    // Получение всех кабинетов
    static async getCabinets(req, res) {
        try {
            const alldata = await Cabinet.find()
            res.json(alldata)
        } catch (error) {
            console.log(error);
            return res.status(500).json({ error: error.message });
        }
      }

    // Удаление пользователя
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

    static async deleteCabinet(req, res) {
        try {
            const {id} = req.params;
            await Cabinet.findByIdAndDelete(id);
            return res.status(200).json({msg: 'Кабинет удалён'});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    static async deleteSpec(req, res) {
        try {
            const {id} = req.params;
            await Spec.findByIdAndDelete(id);
            return res.status(200).json({msg: 'Специальность удалена'});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }

    static async deleteUMK(req, res) {
        try {
            const {id} = req.params;
            await UMK.findByIdAndDelete(id);
            return res.status(200).json({msg: 'УМК удалён'});
        } catch (error) {
            console.log(error)
            return res.status(500).json({ error: error.message });
        }
    }
}