export const toKebab = (name: string) => name.replaceAll(" ", "-");

export const toPascal = (name: string) => {
  return name
    .split(" ")
    .map(function (word, index) {
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

export const toCamel = (name: string) => {
  return name
    .split(" ")
    .map(function (word, index) {
      if (index == 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
};

export const toSnake = (name: string) => {
  return name.replaceAll(" ", "_");
};

export const toUpperSnake = (name: string) => {
  return name.replaceAll(" ", "_").toUpperCase();
};

export const stripPath = (classPath: string) => {
  return classPath.substring(classPath.lastIndexOf(".") + 1, classPath.length);
};

export const strip_module_name = (moduleName: string, name: string) => {
  return name.startsWith(moduleName)
    ? name.substring(moduleName.length + 1, name.length)
    : name;
};
