import themes from './themes';
import heroTypes from './heroTypes';
import generateTeam from './generators';
import {
  calcAvailablePositions,
  calcAttackRadius,
  calcStartPositions,
  getStats,
  calcActionRadius,
  getCurrentPositions,
} from './utils';
import cursors from './cursors';
import PositionedCharacter from './PositionedCharacter';
import GamePlay from './GamePlay';
import GameState from './GameState';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.playerPositions = [];
    this.enemyPositions = [];
    this.positionedCharacters = [];
    this.selectedCharacter = undefined;
    this.selectedCharacterAvailableMoves = [];
    this.selectedCharacterAvailableAttacks = [];
    this.currentLevel = themes.prairie;
    this.gameTurn = 'player';
    this.lastGameScore = 0;
    this.maxScore = 0;
  }

  init() {
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
    this.playerPositions = [];
    this.enemyPositions = [];
    this.positionedCharacters = [];
    this.selectedCharacter = undefined;
    this.selectedCharacterAvailableMoves = [];
    this.selectedCharacterAvailableAttacks = [];
    this.currentLevel = themes.prairie;
    this.gameTurn = 'player';
    this.lastGameScore = 0;
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
    this.gamePlay.newGameListeners = [];
    this.gamePlay.saveGameListeners = [];
    this.gamePlay.loadGameListeners = [];
    this.gamePlay.drawUi(this.currentLevel);
    const playerTeam = generateTeam(heroTypes.player, 4, this.gamePlay.teamSize);
    const enemyTeam = generateTeam(heroTypes.enemy, 4, this.gamePlay.teamSize);
    this.playerPositions = calcStartPositions(calcAvailablePositions(this.gamePlay.boardSize, 'player'), this.gamePlay.teamSize);
    this.enemyPositions = calcStartPositions(calcAvailablePositions(this.gamePlay.boardSize, 'enemy'), this.gamePlay.teamSize);
    for (let i = 0; i < this.gamePlay.teamSize; i += 1) {
      this.positionedCharacters.push(new PositionedCharacter(playerTeam.characters[i], this.playerPositions[i]));
      this.positionedCharacters.push(new PositionedCharacter(enemyTeam.characters[i], this.enemyPositions[i]));
    }
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.addListeners();
  }

  onCellClick(index) {
    // TODO: react to click
    if (this.playerPositions.includes(index)) {
      for (const playerCharacterPosition of this.playerPositions) {
        if (playerCharacterPosition !== index) {
          this.gamePlay.deselectCell(playerCharacterPosition);
        }
      }

      this.gamePlay.selectCell(index);
      this.selectedCharacter = this.positionedCharacters.find((positionCharacter) => positionCharacter.position === index);
      this.selectedCharacterAvailableMoves = calcActionRadius(this.selectedCharacter, this.playerPositions, this.enemyPositions, this.gamePlay.boardSize);
      this.selectedCharacterAvailableAttacks = calcAttackRadius(this.selectedCharacter, this.enemyPositions, this.gamePlay.boardSize);
    }
    if (!this.selectedCharacterAvailableMoves.includes(index) && !this.selectedCharacterAvailableAttacks.includes(index) && !this.playerPositions.includes(index)) {
      GamePlay.showError('Недопустимое действие');
    }
    if (this.selectedCharacter && this.selectedCharacterAvailableMoves.includes(index)) {
      this.gamePlay.deselectCell(this.selectedCharacter.position);
      this.selectedCharacter.position = index;
      this.gameTurn = 'enemy';
      this.nextRound();
    }
    if (this.selectedCharacter && this.selectedCharacterAvailableAttacks.includes(index)) {
      const enemy = this.positionedCharacters.find((positionCharacter) => positionCharacter.position === index);
      const damage = Math.max(this.selectedCharacter.character.attack - enemy.character.defence, this.selectedCharacter.character.attack * 0.1);
      (async () => {
        const showDamage = await this.gamePlay.showDamage(index, damage);
        enemy.character.health -= damage;
        this.gamePlay.deselectCell(this.selectedCharacter.position);
        this.gamePlay.deselectCell(index);
        this.gameTurn = 'enemy';
        this.nextRound();
      })();
    }
  }

  onCellEnter(index) {
    // TODO: react to mouse enter
    if (this.playerPositions.includes(index) || this.enemyPositions.includes(index)) {
      this.gamePlay.showCellTooltip(getStats(this.positionedCharacters.find((positionCharacter) => positionCharacter.position === index)), index);
    }
    if (this.playerPositions.includes(index)) {
      this.gamePlay.setCursor(cursors.pointer);
    } else if (this.selectedCharacter && this.selectedCharacterAvailableMoves.includes(index)) {
      this.gamePlay.selectCell(index, 'green');
      this.gamePlay.setCursor(cursors.pointer);
    } else if (this.selectedCharacter && this.selectedCharacterAvailableAttacks.includes(index)) {
      this.gamePlay.selectCell(index, 'red');
      this.gamePlay.setCursor(cursors.crosshair);
    } else {
      this.gamePlay.setCursor(cursors.notallowed);
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
    if (this.playerPositions.includes(index) || this.enemyPositions.includes(index)) {
      this.gamePlay.hideCellTooltip(index);
    }
    if (this.gamePlay.cells[index].classList.contains('selected-green') || this.gamePlay.cells[index].classList.contains('selected-red')) {
      this.gamePlay.deselectCell(index);
    }
  }

  onNewGameClick() {
    this.stateService.save(this.getProgressData());
    this.init();
    this.maxScore = this.stateService.load().maxScore;
  }

  onSaveGameClick() {
    this.stateService.save(this.getProgressData());
  }

  onLoadGameClick() {
    const loadedData = this.stateService.load();
    this.lastGameScore = loadedData.lastGameScore;
    this.maxScore = loadedData.maxScore;
    this.playerPositions = loadedData.playerPositions;
    this.enemyPositions = loadedData.enemyPositions;
    this.positionedCharacters = loadedData.positionedCharacters;
    this.selectedCharacter = undefined;
    this.selectedCharacterAvailableMoves = [];
    this.selectedCharacterAvailableAttacks = [];
    this.currentLevel = loadedData.currentLevel;
    this.gameTurn = loadedData.gameTurn;
    this.gamePlay.drawUi(this.currentLevel);
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  addListeners() {
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellLeaveListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.gamePlay.addNewGameListener(this.onNewGameClick.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGameClick.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGameClick.bind(this));
  }

  nextRound() {
    this.positionedCharacters = this.positionedCharacters.filter((positionCharacter) => positionCharacter.character.health > 0);
    [this.playerPositions, this.enemyPositions] = getCurrentPositions(this.positionedCharacters);
    if (this.playerPositions.length === 0) {
      this.gamePlay.redrawPositions(this.positionedCharacters);
      GamePlay.showMessage(`Вы проиграли. Ваш текущий результат: ${this.stateService.load().lastGameScore}, Лучший результат за всё время: ${this.stateService.load().maxScore}`);
      return;
    }
    if (this.enemyPositions.length === 0) {
      this.nextLevel();
    }
    this.gamePlay.redrawPositions(this.positionedCharacters);
    this.selectedCharacterAvailableMoves = [];
    this.selectedCharacterAvailableAttacks = [];
    if (this.gameTurn === 'enemy') {
      this.enemyTurn();
    }
  }

  nextLevel() {
    this.lastGameScore += 1;
    switch (this.currentLevel) {
      case 'prairie':
        this.currentLevel = themes.desert;
        break;
      case 'desert':
        this.currentLevel = themes.arctic;
        break;
      case 'arctic':
        this.currentLevel = themes.mountain;
        break;
      case 'mountain':
        this.currentLevel = themes.prairie;
        break;
      default:
        this.currentLevel = 'prairie';
    }
    this.gamePlay.drawUi(this.currentLevel);
    const enemyTeam = generateTeam(heroTypes.enemy, 4, this.gamePlay.teamSize);
    this.playerPositions = calcStartPositions(calcAvailablePositions(this.gamePlay.boardSize, 'player'), this.playerPositions.length);
    this.enemyPositions = calcStartPositions(calcAvailablePositions(this.gamePlay.boardSize, 'enemy'), this.gamePlay.teamSize);
    for (let i = 0; i < this.playerPositions.length; i += 1) {
      this.positionedCharacters[i].position = this.playerPositions[i];
      if (this.positionedCharacters[i].character.level < 4) {
        this.positionedCharacters[i].character.attack = Math.max(this.positionedCharacters[i].character.attack, this.positionedCharacters[i].character.attack * ((80 + this.positionedCharacters[i].character.health) / 100));
        this.positionedCharacters[i].character.defence = Math.max(this.positionedCharacters[i].character.defence, this.positionedCharacters[i].character.defence * ((80 + this.positionedCharacters[i].character.health) / 100));
      }
      this.positionedCharacters[i].character.health = this.positionedCharacters[i].character.health + 80 > 100 ? 100 : this.positionedCharacters[i].character.health + 80;
      this.positionedCharacters[i].character.level = this.positionedCharacters[i].character.level + 1 > 4 ? 4 : this.positionedCharacters[i].character.level + 1;
    }
    for (let i = 0; i < this.gamePlay.teamSize; i += 1) {
      this.positionedCharacters.push(new PositionedCharacter(enemyTeam.characters[i], this.enemyPositions[i]));
    }
    this.gameTurn = 'player';
    this.gamePlay.redrawPositions(this.positionedCharacters);
  }

  enemyTurn() {
    const enemyCharacters = this.positionedCharacters.filter((character) => ['undead', 'vampire', 'daemon'].includes(character.character.type));
    enemyCharacters.sort((a, b) => b.character.attack - a.character.attack);
    for (const enemyCharacter of enemyCharacters) {
      const enemyCharacterAvailableAttacks = calcAttackRadius(enemyCharacter, this.playerPositions, this.gamePlay.boardSize);
      if (enemyCharacterAvailableAttacks.length > 0) {
        const target = this.positionedCharacters.find((positionCharacter) => positionCharacter.position === enemyCharacterAvailableAttacks[0]);
        const damage = Math.max(enemyCharacter.character.attack - target.character.defence, enemyCharacter.character.attack * 0.1);
        (async () => {
          const showDamage = await this.gamePlay.showDamage(enemyCharacterAvailableAttacks[0], damage);
          target.character.health -= damage;
          this.gameTurn = 'player';
          this.nextRound();
        })();
        return;
      }
    }
    const enemyCharacter = enemyCharacters[0];
    const enemyCharacterAvailableMoves = calcActionRadius(enemyCharacter, this.enemyPositions, this.playerPositions, this.gamePlay.boardSize);
    const closestPlayerCharacter = Array.from(this.playerPositions, (x) => [x, Math.abs(enemyCharacter.position - x)]).sort((a, b) => a[1] - b[1])[0][0];
    const closestAvailableMove = Array.from(enemyCharacterAvailableMoves, (x) => [x, Math.abs(closestPlayerCharacter - x)]).sort((a, b) => a[1] - b[1])[0][0];
    enemyCharacter.position = closestAvailableMove;
    this.gameTurn = 'player';
    this.nextRound();
  }

  getProgressData() {
    if (this.lastGameScore > this.maxScore) {
      this.maxScore = this.lastGameScore;
    }
    return GameState.from({
      maxScore: this.maxScore,
      lastGameScore: this.lastGameScore,
      playerPositions: this.playerPositions,
      enemyPositions: this.enemyPositions,
      positionedCharacters: this.positionedCharacters,
      selectedCharacter: undefined,
      selectedCharacterAvailableMoves: [],
      selectedCharacterAvailableAttacks: [],
      currentLevel: this.currentLevel,
      gameTurn: this.gameTurn,
    });
  }
}
