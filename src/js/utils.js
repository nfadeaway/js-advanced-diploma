/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */
export function calcTileType(index, boardSize) {
  // TODO: ваш код будет тут
  const tiles = {
    'top-left': [0],
    'top-right': [boardSize - 1],
    'bottom-left': [boardSize * boardSize - boardSize],
    'bottom-right': [boardSize * boardSize - 1],
    top: [...Array(boardSize - 2).keys()].map((i) => i + 1),
    bottom: [...Array(boardSize - 2).keys()].map((i) => i + 1 + boardSize * (boardSize - 1)),
    left: [...Array(boardSize - 2).keys()].map((i) => (i + 1) * boardSize),
    right: [...Array(boardSize - 2).keys()].map((i) => (boardSize * (i + 2)) - 1),
  };
  for (const tile in tiles) {
    if (tiles[tile].includes(index)) {
      return tile;
    }
  }
  return 'center';
}

export function calcAvailablePositions(boardSize, team) {
  if (team === 'player') {
    const lineOne = [...Array(boardSize).keys()].map((i) => i * boardSize);
    const lineTwo = lineOne.map((x) => x + 1);
    return lineOne.concat(lineTwo);
  }
  const lineOne = [...Array(boardSize).keys()].map((i) => (boardSize * (i + 1)) - 1);
  const lineTwo = lineOne.map((x) => x - 1);
  return lineOne.concat(lineTwo);
}

export function calcStartPositions(availablePositions, teamSize) {
  const startPositions = new Set();
  while (startPositions.size !== teamSize) {
    startPositions.add(availablePositions[Math.floor(Math.random() * availablePositions.length)]);
  }
  return Array.from(startPositions);
}

export function getCurrentPositions(positionedCharacters) {
  let playerPositions = positionedCharacters.filter((character) => ['swordsman', 'bowman', 'magician'].includes(character.character.type));
  playerPositions = Array.from(playerPositions, (character) => character.position);
  let enemyPositions = positionedCharacters.filter((character) => ['undead', 'vampire', 'daemon'].includes(character.character.type));
  enemyPositions = Array.from(enemyPositions, (character) => character.position);
  return [playerPositions, enemyPositions];
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}

export function calcActionRadius(playerCharacter, playerPositions, enemyPositions, boardSize) {
  const { position: currentPosition } = playerCharacter;
  const { move } = playerCharacter.character;
  let availableActionPositions = [];
  let step = 1;
  // left
  while (step < move + 1) {
    if ((!['right', 'top-right'].includes(calcTileType(currentPosition - step, boardSize))) && calcTileType(currentPosition, boardSize) !== 'left') {
      availableActionPositions.push(currentPosition - step);
      step += 1;
    } else {
      break;
    }
  }
  step = 1;
  // right
  while (step < move + 1) {
    if ((!['left', 'bottom-left'].includes(calcTileType(currentPosition + step, boardSize))) && calcTileType(currentPosition, boardSize) !== 'right') {
      availableActionPositions.push(currentPosition + step);
      step += 1;
    } else {
      break;
    }
  }
  step = 1;
  // top and bottom
  while (step < move + 1) {
    availableActionPositions.push(currentPosition - boardSize * step);
    availableActionPositions.push(currentPosition + boardSize * step);
    step += 1;
  }
  step = 1;
  // top left
  while (step < move + 1) {
    if ((!['right', 'top-right'].includes(calcTileType(currentPosition - (boardSize + 1) * step, boardSize))) && !['left', 'top-left', 'bottom-left'].includes(calcTileType(currentPosition, boardSize))) {
      availableActionPositions.push(currentPosition - (boardSize + 1) * step);
      step += 1;
    } else {
      break;
    }
  }
  step = 1;
  // bottom left
  while (step < move + 1) {
    if ((!['right', 'bottom-right'].includes(calcTileType(currentPosition + (boardSize - 1) * step, boardSize))) && !['left', 'top-left', 'bottom-left'].includes(calcTileType(currentPosition, boardSize))) {
      availableActionPositions.push(currentPosition + (boardSize - 1) * step);
      step += 1;
    } else {
      break;
    }
  }
  step = 1;
  // top right
  while (step < move + 1) {
    if ((!['left', 'top-left'].includes(calcTileType(currentPosition - (boardSize - 1) * step, boardSize))) && !['right', 'top-right', 'bottom-right'].includes(calcTileType(currentPosition, boardSize))) {
      availableActionPositions.push(currentPosition - (boardSize - 1) * step);
      step += 1;
    } else {
      break;
    }
  }
  step = 1;
  // bottom right
  while (step < move + 1) {
    if ((!['left', 'bottom-left'].includes(calcTileType(currentPosition + (boardSize + 1) * step, boardSize))) && !['right', 'top-right', 'bottom-right'].includes(calcTileType(currentPosition, boardSize))) {
      availableActionPositions.push(currentPosition + (boardSize + 1) * step);
      step += 1;
    } else {
      break;
    }
  }
  availableActionPositions = availableActionPositions.filter((index) => index >= 0 && index < boardSize * boardSize && !playerPositions.includes(index) && !enemyPositions.includes(index));
  return availableActionPositions;
}

export function calcAttackRadius(playerCharacter, enemyPositions, boardSize) {
  const currentPosition = playerCharacter.position;
  const { attackRadius } = playerCharacter.character;
  let availableAttackPositions = [];
  let step = 1;
  const centerPoints = [];
  centerPoints.push(currentPosition);
  while (step < attackRadius + 1) {
    centerPoints.push(currentPosition - boardSize * step);
    centerPoints.push(currentPosition + boardSize * step);
    step += 1;
  }
  step = 1;
  for (const centerPoint of centerPoints) {
    // left
    while (step < attackRadius + 1) {
      if ((!['right', 'top-right', 'bottom-right'].includes(calcTileType(centerPoint - step, boardSize))) && !['left', 'top-left', 'bottom-left'].includes(calcTileType(centerPoint, boardSize))) {
        availableAttackPositions.push(centerPoint - step);
        step += 1;
      } else {
        break;
      }
    }
    step = 1;
    // right
    while (step < attackRadius + 1) {
      if ((!['left', 'bottom-left'].includes(calcTileType(centerPoint + step, boardSize))) && !['right', 'top-right', 'bottom-right'].includes(calcTileType(centerPoint, boardSize))) {
        availableAttackPositions.push(centerPoint + step);
        step += 1;
      } else {
        break;
      }
    }
    step = 1;
  }
  availableAttackPositions = availableAttackPositions.concat(centerPoints);
  availableAttackPositions = availableAttackPositions.filter((i) => enemyPositions.includes(i));
  return availableAttackPositions;
}

export function getStats(hero) {
  return `\u{1F396} ${hero.character.level} \u{2694} ${hero.character.attack} \u{1F6E1} ${hero.character.defence} \u{2764} ${hero.character.health}`;
}
