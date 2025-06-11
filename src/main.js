import Phaser from 'phaser'
import Bootloader from './scenes/bootloader'
import Game from './scenes/game'
import GameOver from './scenes/gameover'

const config = {
  width: 1000,
  height: 800,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false,
  parent: 'contenedor',
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 0 },
      debug: false
    }
  },
  scene: [Bootloader, Game, GameOver]
}

const game = new Phaser.Game(config)
