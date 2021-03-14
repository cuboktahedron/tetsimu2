export const getItemOrDefault = <T>(key: string, defaultValue: T): T => {
  try {
    const itemJSON = localStorage.getItem(key);
    if (itemJSON) {
      return JSON.parse(itemJSON) as T;
    } else {
      return defaultValue;
    }
  } catch (e) {
    console.error(e);
    return defaultValue;
  }
};
