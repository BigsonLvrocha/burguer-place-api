import { NestFactory } from '@nestjs/core';
import { Handler } from 'aws-lambda';
import express from 'express';

import { configure } from '@codegenie/serverless-express';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from './app.module.js';

async function buildHandler(): Promise<Handler> {
  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );
  nestApp.init();
  return configure({ app: expressApp });
}

export const handler = await buildHandler();
