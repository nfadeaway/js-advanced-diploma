import Swordsman from '../js/characters/Swordsman';

test('Правильно создается объект класса Swordsman', () => {
  const swordsmanChar = new Swordsman(1);
  const correctStats = {
    type: 'swordsman',
    attack: 40,
    defence: 10,
    move: 4,
    attackRadius: 1,
    health: 50,
    level: 1,
  };
  expect(swordsmanChar).toEqual(correctStats);
});
