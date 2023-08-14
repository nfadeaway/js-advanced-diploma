import Team from './Team';
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes, maxLevel) {
  // TODO: write logic here
  while (true) {
    const randomClass = allowedTypes[Math.floor(Math.random() * allowedTypes.length)];
    const randomLevel = Math.floor(Math.random() * (Math.floor(maxLevel) - Math.ceil(1) + 1)) + 1;
    yield new randomClass(randomLevel);
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей.
 * Количество персонажей в команде - characterCount
 * */
export default function generateTeam(allowedTypes, maxLevel, characterCount) {
  // TODO: write logic here
  const teamArr = [];
  for (let i = 0; characterCount > i; i += 1) {
    const playerGenerator = characterGenerator(allowedTypes, maxLevel);
    const character = playerGenerator.next().value;
    for (let j = 1; j < character.level; j += 1) {
      character.attack = Math.max(character.attack, character.attack * ((80 + character.health) / 100));
      character.defence = Math.max(character.defence, character.defence * ((80 + character.health) / 100));
    }
    teamArr.push(character);
  }
  return new Team(teamArr);
}
