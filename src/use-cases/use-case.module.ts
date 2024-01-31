import { Module } from '@nestjs/common';

import { InfrastructureModule } from '../infrastructure/infrastructure.module.js';
import { CreateOrUpdateRecipeUseCase } from './create-or-update-recipe-use-case.js';

@Module({
  imports: [InfrastructureModule],
  providers: [CreateOrUpdateRecipeUseCase],
  exports: [CreateOrUpdateRecipeUseCase],
})
export class UseCaseModule {}
