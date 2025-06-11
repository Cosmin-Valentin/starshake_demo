import Player from '../gameobjects/player'
import Obstacle from '../gameobjects/obstacle'
import Explosion from '../gameobjects/explosion'
import SceneEffect from '../gameobjects/scene_effect'

class Game extends Phaser.Scene {
  constructor() {
    super({ key: 'Game' })
    this.score = 0
    this.level = 1
    this.tutorialShown = false
  }

  create() {
    // Add scene transition effect
    this.sceneEffect = new SceneEffect(this)

    // Add scrolling background
    this.bg1 = this.add.tileSprite(
      0,
      0,
      this.game.config.width,
      this.game.config.height,
      'background'
    )
    this.bg1.setOrigin(0, 0)

    // Add tutorial text
    this.tutorialText = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2,
      'Use ← → to move\nAvoid obstacles!\n\nPress SPACE to start',
      {
        fontSize: '32px',
        fill: '#fff',
        align: 'center'
      }
    )
    this.tutorialText.setOrigin(0.5)

    // Initialize game objects but don't start them yet
    this.initializeGameObjects()

    // Wait for space key to start
    this.input.keyboard.once('keydown-SPACE', () => {
      this.startGame()
    })

    // Pause game until player starts
    this.physics.pause()

    // Add opening transition
    this.sceneEffect.simpleOpen(() => {
      // Tutorial is now visible
      console.log('Game scene ready')
    })
  }

  initializeGameObjects() {
    // Create player
    this.player = new Player(
      this,
      this.game.config.width / 2,
      this.game.config.height - 50
    )
    this.player.init()

    // Setup obstacle spawning
    this.obstacles = this.add.group()
    this.spawnObstacle()

    // Setup collision detection
    this.physics.add.collider(
      this.player,
      this.obstacles,
      this.handleCollision,
      null,
      this
    )

    // Setup score text
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      fill: '#fff'
    })

    // Add high score display
    const highScore = localStorage.getItem('starshakeHighScore') || 0
    this.add.text(16, 56, `High Score: ${highScore}`, {
      fontSize: '32px',
      fill: '#fff'
    })

    // Add level text (hidden by default)
    this.levelText = this.add.text(
      this.game.config.width / 2,
      this.game.config.height / 2,
      'LEVEL 2',
      {
        fontSize: '64px',
        fill: '#fff'
      }
    )
    this.levelText.setOrigin(0.5)
    this.levelText.setAlpha(0)
  }

  startGame() {
    this.tutorialShown = true

    // Resume physics instead of the scene
    this.physics.resume()

    // Resume audio context
    if (this.sound.locked) {
      this.sound.once(Phaser.Sound.Events.UNLOCKED, () => {
        // Sound is now unlocked
        console.log('Sound unlocked')
      })
    }

    // Fade out tutorial
    this.tweens.add({
      targets: this.tutorialText,
      alpha: 0,
      duration: 500,
      onComplete: () => {
        this.tutorialText.destroy()
        this.scene.resume()
      }
    })
  }

  update() {
    // Only update game objects if tutorial is dismissed
    if (!this.tutorialShown) return

    this.player.update()

    // Update score based on survival time
    this.score += 1
    this.scoreText.setText('Score: ' + this.score)

    // Level progression
    if (this.score > 1000 && this.level === 1) {
      this.level = 2
      this.showLevelTransition()
    }

    // Scroll background
    this.bg1.tilePositionY -= 2
  }

  showLevelTransition() {
    // Flash level text
    this.levelText.setAlpha(1)

    // Add visual effects
    this.cameras.main.flash(500, 255, 255, 255, true)
    this.cameras.main.shake(500, 0.01)

    // Sequence of events
    this.time.delayedCall(2000, () => {
      this.tweens.add({
        targets: this.levelText,
        alpha: 0,
        duration: 500,
        onComplete: () => {
          this.scene.restart()
        }
      })
    })
  }

  spawnObstacle() {
    // Don't spawn if tutorial is showing or scene is paused
    if (!this.tutorialShown || this.scene.isPaused()) return

    // Random x position
    const x = Phaser.Math.Between(32, this.game.config.width - 32)
    const obstacle = new Obstacle(this, x, -32)
    this.obstacles.add(obstacle)

    // Spawn next obstacle
    const delay = this.level === 1 ? 2000 : 1500 // Faster spawning in level 2
    this.time.delayedCall(delay, () => {
      this.spawnObstacle()
    })
  }

  handleCollision(player, obstacle) {
    // Create explosion at collision point
    new Explosion(this, obstacle.x, obstacle.y, 8)

    // Create larger explosion at player
    this.player.dead()

    // Close scene with transition
    this.sceneEffect.simpleClose(() => {
      this.scene.start('GameOver', { score: this.score })
    })

    // Remove the obstacle
    obstacle.destroy()
  }
}

export default Game
