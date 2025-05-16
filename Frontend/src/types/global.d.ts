export {};

declare global {
  interface Global {
    lastProcessTime?: number;
  }

  var lastProcessTime: number | undefined;
}