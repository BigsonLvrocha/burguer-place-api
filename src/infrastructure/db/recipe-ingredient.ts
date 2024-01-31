import { FactoryProvider } from '@nestjs/common';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import {
  IngredientModel,
  IngredientModelStatic,
  ingredientModelToken,
} from './ingredient.js';
import { RecipeModel, RecipeModelStatic, recipeModelToken } from './recipe.js';
import { sequelizeToken } from './sequelize.js';

export class RecipeIngredientModel extends Model<
  InferAttributes<RecipeIngredientModel>,
  InferCreationAttributes<RecipeIngredientModel>
> {
  declare id: CreationOptional<string>;
  declare ingredientId: string;
  declare recipeId: string;
  declare amount: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;

  declare ingredient?: IngredientModel;
  declare recipe?: RecipeModel;
}

export type RecipeIngredientModelStatic = typeof RecipeIngredientModel;

async function initRecipeIngredientModel(
  sequelize: Sequelize,
  ingredientModel: IngredientModelStatic,
  recipeModel: RecipeModelStatic,
) {
  RecipeIngredientModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      ingredientId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'ingredients',
          key: 'id',
        },
      },
      recipeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'recipes',
          key: 'id',
        },
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'recipeIngredients',
      timestamps: false,
      underscored: true,
      indexes: [{ fields: ['ingredient_id', 'recipe_id'], unique: true }],
    },
  );

  ingredientModel.belongsToMany(recipeModel, {
    through: RecipeIngredientModel,
  });

  RecipeIngredientModel.belongsTo(ingredientModel);
  RecipeIngredientModel.belongsTo(recipeModel);

  // TODO: create a migration for this
  await RecipeIngredientModel.sync();

  return RecipeIngredientModel;
}

export const recipeIngredientModelToken = Symbol('RECIPE_MODEL');

export const recipeIngredientModelProvider: FactoryProvider<
  Promise<RecipeIngredientModelStatic>
> = {
  provide: recipeIngredientModelToken,
  useFactory: initRecipeIngredientModel,
  inject: [sequelizeToken, ingredientModelToken, recipeModelToken],
};
