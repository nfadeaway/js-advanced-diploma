import Bowman from '../js/characters/Bowman';

test('Правильно создается объект класса Bowman', () => {
  const bowmanChar = new Bowman(1);
  const correctStats = {
    type: 'bowman',
    attack: 25,
    defence: 25,
    move: 2,
    attackRadius: 2,
    health: 50,
    level: 1,
  };
  expect(bowmanChar).toEqual(correctStats);
});
