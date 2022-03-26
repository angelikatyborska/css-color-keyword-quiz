function shuffle<T>(array: Array<T>): Array<T> {
  return array.sort(() => Math.random() - 0.5);
}

function range(start: number, end: number): Array<number> {
  const length = end - start + 1;
  return [...Array(length).keys()].map(n => n + start);
}

function unique<T>(array: Array<T>): Array<T> {
  return array.filter((el, index, self) => self.indexOf(el) === index);
}

export { shuffle, range, unique };
