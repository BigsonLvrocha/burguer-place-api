import { FactoryProvider } from '@nestjs/common';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { IngredientModel } from './ingredient.js';
import { RecipeIngredientModel } from './recipe-ingredient.js';
import { sequelizeToken } from './sequelize.js';

export class RecipeModel extends Model<
  InferAttributes<RecipeModel>,
  InferCreationAttributes<RecipeModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare ingredients?: IngredientModel[];
  declare recipeIngredients?: RecipeIngredientModel;
}

export type RecipeModelStatic = typeof RecipeModel;

async function initRecipeModel(sequelize: Sequelize) {
  RecipeModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'recipes',
      timestamps: false,
      underscored: true,
    },
  );

  // TODO: create a migration for this
  await RecipeModel.sync();

  return RecipeModel;
}

export const recipeModelToken = Symbol('RECIPE_MODEL');

export const recipeModelProvider: FactoryProvider<Promise<RecipeModelStatic>> =
  {
    provide: recipeModelToken,
    useFactory: initRecipeModel,
    inject: [sequelizeToken],
  };
