import GameStateService from '../js/GameStateService';

test('Правильно работает метод load класса GameStateService', () => {
  const localStorageMock = (function () {
    const store = {};
    return {
      getItem(key) {
        return store[key];
      },

      setItem(key, value) {
        store[key] = value;
      },
    };
  })();

  const progressData = {
    lastGameScore: 0,
    maxScore: 5,
    playerPositions: [41, 33, 25],
    enemyPositions: [47, 38, 30],
    positionedCharacters: [],
    currentLevel: 'prairie',
    gameTurn: 'player',
  };
  const gameStateService = new GameStateService(localStorageMock);
  gameStateService.save(progressData);
  expect(progressData).toEqual(gameStateService.load());
});

test('Правильно обрабатывается ошибка при вызове метода load класса GameStateService', () => {
  expect(() => {
    const localStorageMock = '';
    const gameStateService = new GameStateService(localStorageMock);
    gameStateService.load();
  }).toThrow();
});
