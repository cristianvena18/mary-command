# mary-command
Bootstrapping node app to backend and CLI to create classes

## usage:

There are two ways to use the application:

With the init command:
This command is the initiator of the bootstrapping function, this is executed with `mary-command init`, 
you can also pass some parameters to it, such as` --type` to specify what type of architecture you will use 
(only supports 'onion' and 'default'), 
another parameter is `--cqrs` to specify that the responsibility of command and query should segregate them.


With existing project:

You must be created a `config.json` file into root directory with the next fields:

```
{
  type: "onion" | "default"; //Only you choose one
  database: string; //Type of database you use
  cqrs: boolean; //Must differentiate command and queries
  shouldCreateRepositoryInterface: boolean; 
  shouldCreateQueryResult: boolean;

  // Paths
  repositoryInterfacePath: string;
  repositoryPath: string;
  queryInputPath?: string;
  commandInputPath: string;
  adapterPath: string;
  controllerPath: string;
  modelPath: string;
  commandHandlerPath: string;
  queryHandlerPath?: string;
  resultFilePath?: string;
  diPath: string; //DI file path with filename included
}
```

Based on the routes that are set in the configuration file, 
the application will rely on this to generate the different model files, 
controllers and services.

The listed commands supported so far are:
- `mary-command make:model`
this command will generate the model with parameters and types specified
- `mary-command make:repository`
this command will generate a repository with basic functions of that, 
  (based on the expected configuration, this can generate the interface of the same) 
  and in the DI, this command will binding the class with the import
- `mary-command make:test` only to generate the structure of the test, either unitary or integration, being integration the default
- `mary-command make:controller` will generate the basic controller and binding into DI with the import
- `mary-command make:usecase` this will generate a complete use case with action, adapter, input and handler files binding into the DI container
