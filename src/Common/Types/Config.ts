export type Config = {
  type: "onion" | "default";
  database: string;
  cqrs: boolean;
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
  diPath: string;
};
