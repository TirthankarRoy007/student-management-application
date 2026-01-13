import { Subject } from "../models/Subject.js";
import { Op } from "sequelize";

interface CreateSubjectDTO {
  name: string;
  color?: string;
  icon?: string;
}

class SubjectService {

  static async getAllSubjects() {
    return Subject.findAndCountAll({
      order: [["name", "ASC"]],
    });
  }

  static async createSubject(data: CreateSubjectDTO) {
    const { name, color, icon } = data;

    if (!name || !name.trim()) {
      throw { statusCode: 400, message: "Subject name is required" };
    }

    const existing = await Subject.findOne({
      where: {
        name: { [Op.iLike]: name.trim() },
      },
    });

    if (existing) {
      throw { statusCode: 409, message: "Subject already exists" };
    }

    const subject = await Subject.create({
      name: name.trim(),
      color: color || null,
      icon: icon || null,
    });

    return subject;
  }

  static async updateSubject(subjectId: string, updates: Partial<CreateSubjectDTO>) {
    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      throw { statusCode: 404, message: "Subject not found" };
    }

    if (updates.name) {
      const duplicate = await Subject.findOne({
        where: {
          name: { [Op.iLike]: updates.name.trim() },
          id: { [Op.ne]: subjectId },
        },
      });

      if (duplicate) {
        throw { statusCode: 409, message: "Subject name already exists" };
      }
    }

    await subject.update({
      name: updates.name?.trim() ?? subject.name,
      color: updates.color ?? subject.color,
      icon: updates.icon ?? subject.icon,
    });

    return subject;
  }

  static async deleteSubject(subjectId: string) {
    const subject = await Subject.findByPk(subjectId);

    if (!subject) {
      throw { statusCode: 404, message: "Subject not found" };
    }

    // Hard delete for now (can be soft-delete later)
    await subject.destroy();
  }
}

export default SubjectService;
