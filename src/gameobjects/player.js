import Explosion from './explosion'
import { LightParticle } from './particle'

class Player extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'player1')
    this.scene = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Basic physics setup
    this.body.setCollideWorldBounds(true)
    this.body.setAllowGravity(false)

    // Set proper size for collision
    this.body.setSize(48, 48)
    this.body.setOffset(8, 8)

    // Initialize at correct position
    this.setPosition(x, y)
  }

  init() {
    // Create animation only if it doesn't exist
    if (!this.scene.anims.exists('player1')) {
      this.scene.anims.create({
        key: 'player1',
        frames: this.scene.anims.generateFrameNumbers('player1', {
          start: 0,
          end: 0
        }),
        frameRate: 10,
        repeat: -1
      })
    }

    // Play animation
    this.anims.play('player1', true)
  }

  update() {
    const cursors = this.scene.input.keyboard.createCursorKeys()

    // Only horizontal movement
    if (cursors.left.isDown) {
      this.body.setVelocityX(-200)
    } else if (cursors.right.isDown) {
      this.body.setVelocityX(200)
    } else {
      this.body.setVelocityX(0)
    }

    this.scene.trailLayer.add(
      new LightParticle(
        this.scene,
        this.x,
        this.y + this.height / 2,
        0xffffff,
        8,
        0.5
      )
    )
  }

  dead() {
    this.scene.cameras.main.shake(500)
    new Explosion(this.scene, this.x, this.y, 10)
    this.destroy()
  }
}

export default Player
