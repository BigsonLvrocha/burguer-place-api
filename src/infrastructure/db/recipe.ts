import { FactoryProvider } from '@nestjs/common';
import {
  CreationOptional,
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
  Sequelize,
} from 'sequelize';
import { sequelizeToken } from './sequelize.js';
import { StoreModel, StoreModelStatic, storeModelToken } from './store.js';

export class RecipeModel extends Model<
  InferAttributes<RecipeModel>,
  InferCreationAttributes<RecipeModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare storeId: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export type RecipeModelStatic = typeof RecipeModel;

async function initRecipeModel(
  sequelize: Sequelize,
  storeModel: StoreModelStatic,
) {
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
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'stores',
          key: 'id',
        },
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

  RecipeModel.belongsTo(storeModel, { foreignKey: 'storeId' });
  StoreModel.hasMany(RecipeModel, { foreignKey: 'storeId' });

  // TODO: create a migration for this
  await RecipeModel.sync();

  return RecipeModel;
}

export const recipeModelToken = Symbol('RECIPE_MODEL');

export const recipeModelProvider: FactoryProvider<Promise<RecipeModelStatic>> =
  {
    provide: recipeModelToken,
    useFactory: initRecipeModel,
    inject: [sequelizeToken, storeModelToken],
  };
