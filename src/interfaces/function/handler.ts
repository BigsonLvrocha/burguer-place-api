import { NestFactory } from '@nestjs/core';
import express from 'express';

import { configure } from '@codegenie/serverless-express';
import { ExpressAdapter } from '@nestjs/platform-express';

import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module.js';

export async function initHandler() {
  const expressApp = express();
  expressApp.use(
    express.json({
      type: ['application/vnd.api+json', 'application/json'],
    }),
  );

  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
    { bodyParser: false, rawBody: true },
  );

  nestApp.useGlobalPipes(new ValidationPipe());

  await nestApp.init();

  const baseHandler = configure({ app: expressApp });

  const handler = async (event: any, context: any, cb: any) => {
    console.log('event', event);
    const result = await baseHandler(event, context, cb);
    return result;
  };

  return {
    expressApp,
    nestApp,
    handler,
  };
}
