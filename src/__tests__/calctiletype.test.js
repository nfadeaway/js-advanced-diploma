import { calcTileType } from '../js/utils';

test('Правильно работает функция calcTileType', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
  expect(calcTileType(3, 8)).toBe('top');
  expect(calcTileType(7, 8)).toBe('top-right');
  expect(calcTileType(40, 8)).toBe('left');
  expect(calcTileType(43, 8)).toBe('center');
  expect(calcTileType(47, 8)).toBe('right');
  expect(calcTileType(56, 8)).toBe('bottom-left');
  expect(calcTileType(59, 8)).toBe('bottom');
  expect(calcTileType(63, 8)).toBe('bottom-right');
});
