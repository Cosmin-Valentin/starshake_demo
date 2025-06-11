export default class Bootloader extends Phaser.Scene {
  constructor() {
    super({ key: 'bootloader' })
  }

  preload() {
    // Create loading bar
    this.createBars()
    this.setLoadEvents()

    // Load only essential assets
    this.load.image('background', 'assets/images/background.png')

    // Load sprites
    this.load.spritesheet('player1', 'assets/images/player1.png', {
      frameWidth: 64,
      frameHeight: 64
    })
    this.load.spritesheet('foe0', 'assets/images/foe0.png', {
      frameWidth: 64,
      frameHeight: 64
    })

    // Load sound
    this.load.audio('explosion', 'assets/sounds/explosion.mp3')
  }

  setLoadEvents() {
    this.load.on(
      'progress',
      function (value) {
        this.progressBar.clear()
        this.progressBar.fillStyle(0x0088aa, 1)
      },
      this
    )

    this.load.on('complete', () => {
      this.scene.start('Game')
    })
  }

  createBars() {
    this.loadBar = this.add.graphics()
    this.loadBar.fillStyle(0xd40000, 1)
    this.loadBar.fillRect(
      this.cameras.main.width / 4 - 2,
      this.cameras.main.height / 2 - 18,
      this.cameras.main.width / 2 + 4,
      20
    )
    this.progressBar = this.add.graphics()
  }
}
