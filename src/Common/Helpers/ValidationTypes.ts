export const isNullable = (type: string) => {
  return type.includes("?");
};

export const isLastElement = (type: string, list: string[]) => {
  return list[list.length - 1] === type;
};
