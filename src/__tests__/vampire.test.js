import Vampire from '../js/characters/Vampire';

test('Правильно создается объект класса Vampire', () => {
  const vampireChar = new Vampire(1);
  const correctStats = {
    type: 'vampire',
    attack: 25,
    defence: 25,
    move: 2,
    attackRadius: 2,
    health: 50,
    level: 1,
  };
  expect(vampireChar).toEqual(correctStats);
});
