import generateTeam, { characterGenerator } from '../js/generators';
import heroTypes from '../js/heroTypes';

test('Правильно работает функция generateTeam', () => {
  const team = generateTeam(heroTypes.player, 4, 3);
  expect(team.characters.length).toBe(3);
  expect(team.characters[0].level).toBeLessThanOrEqual(4);
  expect(team.characters[1].level).toBeLessThanOrEqual(4);
  expect(team.characters[2].level).toBeLessThanOrEqual(4);
});
