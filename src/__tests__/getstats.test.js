import { getStats } from '../js/utils';
import { characterGenerator } from '../js/generators';
import Bowman from '../js/characters/Bowman';
import PositionedCharacter from '../js/PositionedCharacter';

test('Правильно работает функция getStats', () => {
  let char = characterGenerator([Bowman], 1);
  char = char.next().value;
  char = new PositionedCharacter(char, 0);
  expect(getStats(char)).toBe('\u{1F396} 1 \u{2694} 25 \u{1F6E1} 25 \u{2764} 50');
});
