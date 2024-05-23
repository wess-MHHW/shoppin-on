export function setLsItem<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value));
}
