FROM public.ecr.aws/lambda/nodejs:20 as init

COPY package.json package-lock.json ${LAMBDA_TASK_ROOT}/


FROM init as build

RUN cd ${LAMBDA_TASK_ROOT} && npm install

COPY . ${LAMBDA_TASK_ROOT}

RUN cd ${LAMBDA_TASK_ROOT} && npm run build


FROM init as production

RUN cd ${LAMBDA_TASK_ROOT} && npm install --omit=dev

COPY --from=build ${LAMBDA_TASK_ROOT}/dist ${LAMBDA_TASK_ROOT}/dist/

CMD ["dist/interfaces/function/index.handler"]