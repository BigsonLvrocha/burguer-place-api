import { Module } from '@nestjs/common';
import { UseCaseModule } from '../../use-cases/use-case.module.js';
import { RecipeController } from './controllers/recipe.controller.js';

@Module({
  imports: [UseCaseModule],
  controllers: [RecipeController],
})
export class HttpModule {}
