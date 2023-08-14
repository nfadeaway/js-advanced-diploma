import { characterGenerator } from '../js/generators';
import heroTypes from '../js/heroTypes';

test('Правильно работает функция characterGenerator', () => {
  const playerGenerator = characterGenerator(heroTypes.player, 4);
  expect(['swordsman', 'bowman', 'magician']).toContain(playerGenerator.next().value.type);
  expect(playerGenerator.next().value.level).toBeLessThanOrEqual(4);
  const enemyGenerator = characterGenerator(heroTypes.enemy, 4);
  expect(['daemon', 'undead', 'vampire']).toContain(enemyGenerator.next().value.type);
  expect(enemyGenerator.next().value.level).toBeLessThanOrEqual(4);
});
