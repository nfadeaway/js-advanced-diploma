import Magician from '../js/characters/Magician';

test('Правильно создается объект класса Magician', () => {
  const magicianChar = new Magician(1);
  const correctStats = {
    type: 'magician',
    attack: 10,
    defence: 40,
    move: 1,
    attackRadius: 4,
    health: 50,
    level: 1,
  };
  expect(magicianChar).toEqual(correctStats);
});
