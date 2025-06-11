import SceneEffect from '../gameobjects/scene_effect'

class GameOver extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOver' })
  }

  init(data) {
    this.score = data.score
    this.highScore = this.getHighScore()

    // Update high score if needed
    if (this.score > this.highScore) {
      this.highScore = this.score
      localStorage.setItem('starshakeHighScore', this.score)
    }
  }

  create() {
    // Add scene transition effect
    this.sceneEffect = new SceneEffect(this)

    // Open scene with transition
    this.sceneEffect.simpleOpen(() => {
      // Show game over content after transition
      this.showGameOverContent()
    })
  }

  showGameOverContent() {
    // Game Over text
    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 - 100,
        'GAME OVER',
        {
          fontSize: '64px',
          fill: '#fff'
        }
      )
      .setOrigin(0.5)

    // Score display
    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2,
        `Score: ${this.score}`,
        {
          fontSize: '32px',
          fill: '#fff'
        }
      )
      .setOrigin(0.5)

    // High Score display
    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 50,
        `High Score: ${this.highScore}`,
        {
          fontSize: '32px',
          fill: '#fff'
        }
      )
      .setOrigin(0.5)

    // Restart prompt
    this.add
      .text(
        this.game.config.width / 2,
        this.game.config.height / 2 + 150,
        'Press SPACE to restart',
        {
          fontSize: '24px',
          fill: '#fff'
        }
      )
      .setOrigin(0.5)

    // Add space key handler with transition
    this.input.keyboard.once('keydown-SPACE', () => {
      this.sceneEffect.simpleClose(() => {
        this.scene.start('Game')
      })
    })
  }

  getHighScore() {
    const highScore = localStorage.getItem('starshakeHighScore')
    return highScore ? parseInt(highScore) : 0
  }
}

export default GameOver
