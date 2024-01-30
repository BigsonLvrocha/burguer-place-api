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

export class IngredientModel extends Model<
  InferAttributes<IngredientModel>,
  InferCreationAttributes<IngredientModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;
  declare amount: number;
  declare storeId: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export type IngredientModelStatic = typeof IngredientModel;

async function initIngredientModel(
  sequelize: Sequelize,
  storeModel: StoreModelStatic,
) {
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
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      storeId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'store',
          key: 'id',
        },
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

  IngredientModel.belongsTo(storeModel, { foreignKey: 'storeId' });
  StoreModel.hasMany(IngredientModel, { foreignKey: 'storeId' });

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
  inject: [sequelizeToken, storeModelToken],
};
