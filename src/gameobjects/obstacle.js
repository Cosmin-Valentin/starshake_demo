class Obstacle extends Phaser.GameObjects.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y, 'foe') // Reusing the 'foe' sprite temporarily
    this.scene = scene
    scene.add.existing(this)
    scene.physics.add.existing(this)

    // Basic physics setup
    this.body.setAllowGravity(false)
    this.body.setVelocityY(150) // Constant falling speed

    // Set smaller hitbox for better collision detection
    this.body.setSize(32, 32)
    this.body.setOffset(16, 16)
  }

  update() {
    // Remove obstacle when it goes off screen
    if (this.y > this.scene.game.config.height) {
      this.destroy()
    }
  }
}

export default Obstacle
