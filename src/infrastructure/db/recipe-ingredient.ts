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
import { StoreModel, StoreModelStatic, storeModelToken } from './store.js';

export class RecipeIngredientModel extends Model<
  InferAttributes<RecipeIngredientModel>,
  InferCreationAttributes<RecipeIngredientModel>
> {
  declare id: CreationOptional<string>;
  declare ingredientId: string;
  declare recipeId: string;
  declare storeId: string;
  declare amount: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export type RecipeIngredientModelStatic = typeof RecipeIngredientModel;

async function initRecipeIngredientModel(
  sequelize: Sequelize,
  storeModel: StoreModelStatic,
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
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'stores',
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
      modelName: 'recipe',
      timestamps: false,
      underscored: true,
    },
  );

  RecipeIngredientModel.belongsTo(storeModel, { foreignKey: 'storeId' });
  StoreModel.hasMany(RecipeIngredientModel, { foreignKey: 'storeId' });

  RecipeIngredientModel.belongsTo(recipeModel, { foreignKey: 'recipeId' });
  RecipeModel.hasMany(RecipeIngredientModel, { foreignKey: 'recipeId' });

  RecipeIngredientModel.belongsTo(ingredientModel, {
    foreignKey: 'ingredientId',
  });
  IngredientModel.hasMany(RecipeIngredientModel, {
    foreignKey: 'ingredientId',
  });

  IngredientModel.belongsToMany(RecipeModel, {
    through: RecipeIngredientModel,
  });

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
  inject: [
    sequelizeToken,
    storeModelToken,
    ingredientModelToken,
    recipeModelToken,
  ],
};
