import Swordsman from './characters/Swordsman';
import Bowman from './characters/Bowman';
import Magician from './characters/Magician';
import Daemon from './characters/Daemon';
import Undead from './characters/Undead';
import Vampire from './characters/Vampire';

const heroTypes = {
  player: [Swordsman, Bowman, Magician],
  enemy: [Daemon, Undead, Vampire],
};

export default heroTypes;
