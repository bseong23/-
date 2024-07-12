import { model } from "mongoose";
import { CategorySchema } from "../schemas/category-schema.js";

const Category = model("category", CategorySchema);

export class CategoryModel {
    async create(categoryInfo) {
        const createdNewCategory = await Category.create(categoryInfo);
        return createdNewCategory;
    }

    async findAll() {
        const category = await Category.find({});
        return category;
    }

    async countDocuments(filter = {}) {
        const count = await Category.countDocuments(filter);
        return count;
    }

    async delete(categoryName) {
        try {
            const category = await Category.findOne({ category: categoryName });

            if (!category) {
                throw new Error('없는 카테고리입니다.');
            }
    
            await Category.deleteOne({ _id: category._id });
            console.log(`${categoryName}가 삭제되었습니다.`);
        } catch (error) {
            console.error(error);
        }
    }

    async update(categoryName, newCategoryName) {
        const updatedCategory = await Category.findOneAndUpdate(
            { category: categoryName },
            { $set: { category: newCategoryName } },
            { new: true }
        );
        return updatedCategory;
    }
    


}
const categoryModel = new CategoryModel();

export { categoryModel };
