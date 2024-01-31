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

export class IngredientModel extends Model<
  InferAttributes<IngredientModel>,
  InferCreationAttributes<IngredientModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare amount: number;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export type IngredientModelStatic = typeof IngredientModel;

async function initIngredientModel(sequelize: Sequelize) {
  IngredientModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'ingredient',
      timestamps: false,
      underscored: true,
    },
  );

  // TODO: create a migration for this
  await IngredientModel.sync();

  return IngredientModel;
}

export const ingredientModelToken = Symbol('INGREDIENT_MODEL');

export const ingredientModelProvider: FactoryProvider<
  Promise<IngredientModelStatic>
> = {
  provide: ingredientModelToken,
  useFactory: initIngredientModel,
  inject: [sequelizeToken],
};
