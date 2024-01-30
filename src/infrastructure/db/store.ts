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

export class StoreModel extends Model<
  InferAttributes<StoreModel>,
  InferCreationAttributes<StoreModel>
> {
  declare id: CreationOptional<string>;
  declare name: string;

  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
}

export type StoreModelStatic = typeof StoreModel;

async function initStoreModel(sequelize: Sequelize) {
  StoreModel.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      name: DataTypes.STRING,
      createdAt: DataTypes.DATE,
      updatedAt: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: 'store',
      timestamps: true,
      underscored: true,
    },
  );

  // TODO: create a migration for this
  await StoreModel.sync();

  return StoreModel;
}

export const storeModelToken = Symbol('STORE_MODEL');

export const storeModelProvider: FactoryProvider<Promise<StoreModelStatic>> = {
  provide: storeModelToken,
  useFactory: initStoreModel,
  inject: [sequelizeToken],
};
