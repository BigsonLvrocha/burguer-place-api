# Burguerplace api

## Description

Repository for a serverless application to practice coding skills

## Installation

```bash
$ npm install
```

## Running the app

```bash
# development
$ make local-run
```

## Test

```bash
# unit tests
$ npm run test
```

## Folder structure

The app is divided in layers, each one with it's own responsibilities.

- interface: Contains the entrypoints of the application, acts a layer of translating external interfaces to the application itself
  - http: JSON-api
  - lambda: translate lambda api requests into http calls
- use-case: Application layer, define the application specific interface and uses domain and infrastructure layer to execute, efectivelly hidin implementation details from interface code
- domain: Define application business rules, apply structure data validation.
- infrastructure: implements application interface with the database, hides implementation details from domain and application layers

## Next steps
- Add pagination or listing by id to listing endpoints `/recipes` and `/ingredient-amount`
- Add authentication
- Add dynamic VPC, Subnet and Security group allocation
- Manage SQL schema through migration
