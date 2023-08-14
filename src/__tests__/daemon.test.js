import Daemon from '../js/characters/Daemon';

test('Правильно создается объект класса Daemon', () => {
  const daemonChar = new Daemon(1);
  const correctStats = {
    type: 'daemon',
    attack: 10,
    defence: 10,
    move: 1,
    attackRadius: 4,
    health: 50,
    level: 1,
  };
  expect(daemonChar).toEqual(correctStats);
});
