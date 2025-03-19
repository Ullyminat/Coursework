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
      const { cabinetId, umkIds, specIds, schemaId } = req.body;
      const userId = req.user._id;

      if (!cabinetId || !umkIds || !specIds || !schemaId) {
        return res.status(400).json({ error: "Missing required fields" });
      }

      const user = await User.findById(userId);
      const cabinet = await Cabinet.findById(cabinetId);
      const umks = await UMK.find({ _id: { $in: umkIds } });
      const specs = await Spec.find({ _id: { $in: specIds } });
      const schema = await Schemas.findById(schemaId);

      if (!user || !cabinet || !schema) {
        return res.status(404).json({ error: "Data not found" });
      }

      if (umks.length !== umkIds.length || specs.length !== specIds.length) {
        return res.status(404).json({ error: "Some UMKs or Specs not found" });
      }

      if (
        !schema.schema_data ||
        !schema.schema_data.nodes ||
        !Array.isArray(schema.schema_data.nodes)
      ) {
        return res.status(400).json({ error: "Invalid schema data structure" });
      }

      //Подсчет элементов схемы
      const counts = schema.schema_data.nodes.reduce((acc, node) => {
        if (node.type !== undefined) {
          acc[node.type] = (acc[node.type] || 0) + 1;
        }
        return acc;
      }, {});

      const requiredTypes = ['board','studentDesk','studentChair','teacherDesk','teacherChair','window','door','socket','cabinet','computer','tv'];
      requiredTypes.forEach(type => {
        counts[type] = counts[type] || 0;
      });

      //Проверка и загрузка изображения
      if (!schema.image || !fs.existsSync(schema.image)) {
        return res.status(400).json({ error: "Image file not found" });
      }

      //Изображение в буфер
      const imageBuffer = fs.readFileSync(schema.image);

      //Размеры изображения
      const dimensions = sizeOf(imageBuffer);

      //Ширина изображения
      const DESIRED_WIDTH = 650;

      const aspectRatio = dimensions.width / dimensions.height;
      const desiredHeight = Math.round(DESIRED_WIDTH / aspectRatio);

      //Загрузка шаблона документа
      const templatePath = path.resolve("media/template.docx");
      const content = fs.readFileSync(templatePath, "binary");

      const zip = new PizZip(content);

      //Настройка модуля для работы с изображениями
      const imageModule = new ImageModule({
        getImage: (tagValue) => {
          return fs.readFileSync(tagValue);
        },
        getSize: () => {
          return [DESIRED_WIDTH, desiredHeight];
        },
      });

      const doc = new Docxtemplater(zip, {
        modules: [imageModule],
        paragraphLoop: true,
        linebreaks: true,
      });

      //Данные для шаблона
      const data = {
        ...counts,
        image: schema.image,
        year: new Date().getFullYear(),
        user: {
          name: user.name,
          surname: user.surname,
          patronymic: user.patronymic,
        },
        num_cabinet: cabinet.cabinet,
        cabinet_year: cabinet.year,
        name_cabinet: cabinet.name,
        head_of_cabinet: `${user.surname} ${user.name} ${user.patronymic}`,
        head_of_cab: `${user.name[0]}. ${user.patronymic[0]}. ${user.surname}`,
        S: cabinet.S,
        umk: umks.map((umk) => ({ name: umk.name, year: umk.year })),
        spec: specs.map((spec) => ({ name: spec.name })),
      };

      // Рендер
      doc.render(data);

      //Генерация файла
      const buf = doc.getZip().generate({ type: "nodebuffer" });

      const pasport = new Pasport({
        cabinets: [cabinetId],
        UMK: umkIds,
        specs: specIds,
        createdBy: userId,
        schema: schemaId,
        file: buf,
      });

      await User.findByIdAndUpdate(
        userId,
        { $push: { pasports: pasport._id } },
        { new: true, useFindAndModify: false }
      );

      const fileName = `cabinet-${cabinet.cabinet}-pasport-${Date.now()}.docx`;
      const filePath = path.resolve(`media/doc/${fileName}`);
      fs.writeFileSync(filePath, buf);

      //Обновление записи паспорта
      pasport.file = fileName;
      await pasport.save();

      res.setHeader("Content-Disposition", "attachment; filename=document.docx");
      res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
      res.send(buf);
    } catch (error) {
      console.error("Document generation error:", error);
      res.status(500).json({ error: "Document generation failed", details: error.message });
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
      console.error("Ошибка загрузки:", error);
      res.status(500).json({ 
        error: "Ошибка при скачивании паспорта",
        details: error.message 
      });
    }
  }
}