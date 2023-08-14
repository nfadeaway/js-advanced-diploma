import Character from '../js/Character';

test('Правильно отрабатывает throw при создании экземпляра класса Character', () => {
  expect(() => {
    const char = new Character(1);
  }).toThrow();
});
