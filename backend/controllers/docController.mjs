import User from '../models/user.mjs';
import Pasport from '../models/pasport.mjs';
import Cabinet from '../models/cabinet.mjs';
import PizZip from 'pizzip';
import fs from 'fs';
import Docxtemplater from 'docxtemplater';
import path from 'path';
import UMK from '../models/umk.mjs';
import Spec from '../models/spec.mjs';
import Schemas from '../models/schemas.mjs';
import ImageModule from 'docxtemplater-image-module-free';
import mongoose from 'mongoose';
import sizeOf from 'image-size';

export default class DocController {
  static async generateDoc(req, res) {
    try {
        const { cabinetId, cabinetName, umkIds, specIds, schemaId } = req.body;
        const userId = req.user._id;

        // Валидация обязательных полей
        if (!cabinetId || !cabinetName || !umkIds || !specIds || !schemaId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        // Получение данных из БД
        const user = await User.findById(userId);
        const cabinet = await Cabinet.findById(cabinetId);
        const umks = await UMK.find({ _id: { $in: umkIds } });
        const specs = await Spec.find({ _id: { $in: specIds } });
        const schema = await Schemas.findById(schemaId);

        // Проверка существования данных
        if (!user || !schema) {
            return res.status(404).json({ error: "User or schema not found" });
        }

        if (umks.length !== umkIds.length || specs.length !== specIds.length) {
            return res.status(404).json({ error: "Some UMKs or Specs not found" });
        }

        // Валидация структуры схемы
        if (!schema.schema_data?.nodes || !Array.isArray(schema.schema_data.nodes)) {
            return res.status(400).json({ error: "Invalid schema data structure" });
        }

        // Подсчёт элементов схемы
        const counts = schema.schema_data.nodes.reduce((acc, node) => {
            if (node.type !== undefined) {
                acc[node.type] = (acc[node.type] || 0) + 1;
            }
            return acc;
        }, {});

        // Инициализация обязательных типов
        const requiredTypes = ['board','studentDesk','studentChair','teacherDesk',
                             'teacherChair','window','door','socket','cabinet','computer','tv'];
        requiredTypes.forEach(type => {
            counts[type] = counts[type] || 0;
        });

        // Проверка и загрузка изображения
        if (!schema.image || !fs.existsSync(schema.image)) {
            return res.status(400).json({ error: "Image file not found" });
        }

        // Обработка изображения
        const imageBuffer = fs.readFileSync(schema.image);
        const dimensions = sizeOf(imageBuffer);
        const DESIRED_WIDTH = 650;
        const aspectRatio = dimensions.width / dimensions.height;
        const desiredHeight = Math.round(DESIRED_WIDTH / aspectRatio);

        // Загрузка шаблона документа
        const templatePath = path.resolve("media/template.docx");
        const content = fs.readFileSync(templatePath, "binary");
        const zip = new PizZip(content);

        // Настройка модуля для работы с изображениями
        const imageModule = new ImageModule({
            getImage: (tagValue) => fs.readFileSync(tagValue),
            getSize: () => [DESIRED_WIDTH, desiredHeight],
        });

        // Инициализация Docxtemplater
        const doc = new Docxtemplater(zip, {
            modules: [imageModule],
            paragraphLoop: true,
            linebreaks: true,
        });

        // Подготовка данных для шаблона
        const data = {
            ...counts,
            image: schema.image,
            year: new Date().getFullYear(),
            user: {
                name: user.name,
                surname: user.surname,
                patronymic: user.patronymic,
            },
            num_cabinet: cabinet?.cabinet || '', // Номер из БД (если есть)
            cabinet_year: cabinet?.year || '',    // Год из БД (если есть)
            name_cabinet: cabinetName,           // Используем переданное название
            head_of_cabinet: `${user.surname} ${user.name} ${user.patronymic}`,
            head_of_cab: `${user.name[0]}. ${user.patronymic[0]}. ${user.surname}`,
            S: cabinet?.S || '',                 // Площадь из БД (если есть)
            umk: umks.map((umk) => ({ name: umk.name, year: umk.year })),
            spec: specs.map((spec) => ({ name: spec.name })),
        };

        // Рендер документа
        doc.render(data);

        // Генерация файла
        const buf = doc.getZip().generate({ type: "nodebuffer" });

        // Создание записи паспорта
        const pasport = new Pasport({
            cabinets: [cabinetId],
            UMK: umkIds,
            specs: specIds,
            createdBy: userId,
            schema: schemaId,
            file: buf,
        });

        // Обновление пользователя
        await User.findByIdAndUpdate(
            userId,
            { $push: { pasports: pasport._id } },
            { new: true, useFindAndModify: false }
        );

        // Сохранение файла
        const fileName = `cabinet-${cabinet?.cabinet || 'custom'}-pasport-${Date.now()}.docx`;
        const filePath = path.resolve(`media/doc/${fileName}`);
        fs.writeFileSync(filePath, buf);

        // Обновление записи паспорта
        pasport.file = fileName;
        await pasport.save();

        // Отправка документа
        res.setHeader("Content-Disposition", "attachment; filename=document.docx");
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
        res.send(buf);
    } catch (error) {
        console.error("Document generation error:", error);
        res.status(500).json({ 
            error: "Document generation failed", 
            details: error.message 
        });
    }
}

  static async saveSchema(req, res) {
    try {
      const { schemaData, cabinetId } = req.body;
      const userId = req.user._id;

      if (!req.file) {
        return res.status(400).json({ error: "No image uploaded" });
      }

      const newSchema = new Schemas({
        user: userId,
        cabinet: cabinetId,
        schema_data: JSON.parse(schemaData),
        image: req.file.path,
      });

      await newSchema.save();

      await User.findByIdAndUpdate(userId, {
        $push: { schemas: newSchema._id },
      });

      res.status(201).json({
        message: "Schema saved successfully",
        schemaId: newSchema._id,
      });
    } catch (error) {
      console.error("Schema saving error:", error);
      res.status(500).json({ error: "Schema saving failed", details: error.message });
    }
  }

static async deletePasport(req, res) {
  try {
      const { pasportId } = req.params;
      const userId = req.user._id;
      const pasport = await Pasport.findById(pasportId);

      const filePath = path.resolve(`media/doc/${pasport.file}`);
      if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
      }
      await Pasport.findByIdAndDelete(pasportId);
      await User.findByIdAndUpdate(
          userId,
          { $pull: { pasports: pasportId } }
      );
      return res.status(200).json({ message: "Паспорт успешно удалён" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
}

  static async downloadPasport(req, res) {
    try {
      const { pasportId } = req.params;
      const userId = req.user._id;
  
      if (!mongoose.Types.ObjectId.isValid(pasportId)) {
        return res.status(400).json({ error: "Неверный ID паспорта" });
      }
  
      const pasport = await Pasport.findById(pasportId);
      if (!pasport) {
        return res.status(404).json({ error: "Паспорт не найден" });
      }
  
      const filePath = path.resolve('media/doc', pasport.file);
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Файл не найден" });
      }
  
      // Отправка файла
      res.setHeader('Content-Disposition', `attachment; filename="${pasport.file}"`);
      res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
      res.sendFile(filePath);
  
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error: error.message });
    }
  }
}