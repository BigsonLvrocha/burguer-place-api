import { NestFactory } from '@nestjs/core';
import { Context, Handler } from 'aws-lambda';
import express from 'express';

import { configure } from '@codegenie/serverless-express';
import { ExpressAdapter } from '@nestjs/platform-express';

import { AppModule } from '../../app.module.js';

let builtHandler: Handler;

async function resolveHandler(): Promise<Handler> {
  if (builtHandler) {
    return builtHandler;
  }

  const expressApp = express();
  const nestApp = await NestFactory.create(
    AppModule,
    new ExpressAdapter(expressApp),
  );

  await nestApp.init();
  builtHandler = configure({ app: expressApp });

  return builtHandler;
}

export const handler: Handler = async (event, context: Context) => {
  const handler = await resolveHandler();
  const result = await handler(event, context, undefined);
  return result;
};
