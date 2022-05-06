import { gsap } from 'gsap'


function lerp(start, end, ease) {
  return start * (1 - ease) + end * t;
}

export default class InfiniteSlider {
  constructor(container, images = []) {
    this.container = container
    this.images = images
    this.padding = 20
    this.rect = {
      width: 700,
      height: 500,
    }
    this.app  = null
    this.timeout = null
    this.isDraged = false
    this.currentMousePosition = { x: null, y: null}
    this.lastMousePosition = { x: null, y: null}
    this.mainSprite = null
    this.velocity = {x: 0, y: 0}
    this.dimension = {
      x: 3,
      y: 2
    }
    this.spritesContainer = new PIXI.Container()
    this.initApp()
    this.loadImages()
    this.addMouseHandlers()
  }
  initApp() {
    this.app = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight,
      resizeTo: window,
      background: 0xff0000
    });
    this.container.appendChild(this.app.view)
  }
  resizeCanvas() {
    if(this.timeout) {
      clearTimeout(this.timeout)
    }
    this.timeout = setTimeout(() => {
     this.app.resize()
    },100)
  }
  loadImages() {
    this.images.forEach(image => {
      this.app.loader.add(image)
    })
    this.app.loader.onComplete.add(this.setupScene.bind(this))
    this.app.loader.load()
  }
  addMouseHandlers() {
    this.app.view.addEventListener('mousedown', this.mouseDownHandler.bind(this))
    this.app.view.addEventListener('mouseup', this.mouseUpHandler.bind(this))
    this.app.view.addEventListener('mouseleave', this.mouseLeaveHandler.bind(this))
    this.app.view.addEventListener('mousemove', this.mouseMoveHandler.bind(this))
    window.addEventListener('mousewheel', this.mouseWheelHandler.bind(this))
  }
  setupScene() {
    const spriteContainer = new PIXI.Container()
    this.images.forEach((image,index) => {
      const texture = this.app.loader.resources[image].texture
      const sprite = new PIXI.Sprite(texture)
      const ratio = this.rect.width / this.rect.height
      const textureRatio = texture.baseTexture.width / texture.baseTexture.height

      const container = new PIXI.Container()

      const mask = new PIXI.Graphics()
      .beginFill(0xffffff)
      .drawRect(this.padding,this.padding,this.rect.width,this.rect.height)
      .endFill()
      container.addChild(mask)
      container.mask = mask
      container.x = this.padding
      container.y = this.padding
      container.width = this.rect.width
      container.height = this.rect.height
      container.addChild(sprite)

      if(ratio > textureRatio) {
        sprite.width = this.rect.width
        sprite.height = this.rect.width / textureRatio
      } else {
        sprite.height = this.rect.height
        sprite.width = this.rect.height * textureRatio
      }
      const wrapper = new PIXI.Container({isMask:true})

      wrapper.width = 2*this.padding + this.rect.width
      wrapper.height = 2*this.padding + this.rect.height
      wrapper.x = (this.rect.width + 2 * this.padding)*(index % this.dimension.x)
      wrapper.y = (this.rect.height + 2 * this.padding)*(Math.floor(index / this.dimension.x) % this.dimension.y)

      const bg = new PIXI.Graphics()
      .beginFill(0xeeeeee)
      .drawRect(0, 0, 2*this.padding + this.rect.width, 2*this.padding + this.rect.height)
      .endFill()
      wrapper.addChild(bg)

      wrapper.addChild(container)
      spriteContainer.addChild(wrapper)


    })
    const generateTexture = this.app.renderer.generateTexture(spriteContainer)
    this.mainSprite = new PIXI.TilingSprite(generateTexture)
    this.mainSprite.width = 2000
    this.mainSprite.height = 2000
    this.app.stage.addChild(this.mainSprite)

    this.app.ticker.add(this.loop.bind(this))

  }
  mouseDownHandler(e) {
    this.isDrag = true;
    this.lastMousePosition.x = e.clientX;
    this.lastMousePosition.y = e.clientY;

    console.log(e.clientX, e.clientY)
  }
  mouseUpHandler() {
    this.isDrag = false;
  }
  mouseMoveHandler(e) {
    if (this.isDrag) {
      this.currentMousePosition.x = e.clientX;
      this.currentMousePosition.y = e.clientY;
      gsap.to(this.velocity, {
        x: this.currentMousePosition.x - this.lastMousePosition.x,
        y: this.currentMousePosition.y - this.lastMousePosition.y,
        duration: 0.5,
      });

      this.lastMousePosition.x = this.currentMousePosition.x;
      this.lastMousePosition.y = this.currentMousePosition.y;
    }
  }
  mouseLeaveHandler() {
    this.isDrag = false;
  }
  mouseWheelHandler(e) {
    console.log(e)
    gsap.to(this.velocity, {
      y: e.deltaY*0.1,
      duration: 0.5,
    });
  }
  loop() {
    this.mainSprite.tilePosition.x += this.velocity.x;
    this.mainSprite.tilePosition.y += this.velocity.y;

    this.velocity.y *= 0.96;
    this.velocity.x *= 0.96;
  }
}
