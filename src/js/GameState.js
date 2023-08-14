export default class GameState {
  static from(object) {
    // TODO: create object
    return {
      lastGameScore: object.lastGameScore,
      maxScore: object.maxScore,
      playerPositions: object.playerPositions,
      enemyPositions: object.enemyPositions,
      positionedCharacters: object.positionedCharacters,
      currentLevel: object.currentLevel,
      gameTurn: object.gameTurn,
    };
  }
}
