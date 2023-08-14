import Undead from '../js/characters/Undead';

test('Правильно создается объект класса Undead', () => {
  const undeadChar = new Undead(1);
  const correctStats = {
    type: 'undead',
    attack: 40,
    defence: 10,
    move: 4,
    attackRadius: 1,
    health: 50,
    level: 1,
  };
  expect(undeadChar).toEqual(correctStats);
});
