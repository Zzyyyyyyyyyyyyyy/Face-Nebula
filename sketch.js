// Face Tracking and Particle Nebula Effect - Scene Management System

// Global variables
let sceneManager;
let capturedFaceStates = []; // Store captured face states

function setup() {
  createCanvas(640, 480);
  frameRate(30);
  colorMode(HSB, 360, 100, 100, 100);
  
  // Create scene manager
  sceneManager = new SceneManager();
  
  // Register all scenes
  sceneManager.addScene("Navigation", new IntroScene());
  sceneManager.addScene("Simple Scene", new SimpleBlackScene());
  sceneManager.addScene("Face Nebula", new FaceNebulaScene());
  
  // Switch to the first scene by default
  sceneManager.setCurrentScene("Navigation");
  
  // Add keyboard event listener
  document.addEventListener('keydown', handleKeyPress);
}

function draw() {
  // Update and display current scene
  sceneManager.update();
  sceneManager.display();
  
  // Display scene information
  displaySceneInfo();
}

// Scene information display
function displaySceneInfo() {
  push();
  fill(0, 0, 100, 80);
  noStroke();
  textAlign(LEFT, TOP);
  textSize(14);
  text(`Current Scene: ${sceneManager.currentSceneName} (${sceneManager.currentSceneIndex+1}/${sceneManager.scenes.length})`, 10, 10);
  text("Press 1-3 keys to switch scenes", 10, 30);
  pop();
}

// Keyboard event handling
function handleKeyPress(e) {
  // Number keys 1-3 to switch scenes
  if (e.key >= '1' && e.key <= '3') {
    const sceneIndex = parseInt(e.key) - 1;
    sceneManager.setCurrentSceneByIndex(sceneIndex);
  }
  
  // If in Face Nebula scene, press 's' key to capture current face state
  if (e.key === 's' || e.key === 'S') {
    if (sceneManager.currentSceneIndex === 2 && 
        sceneManager.scenes[2] instanceof FaceNebulaScene) {
      sceneManager.scenes[2].captureFaceState();
    }
  }
}

// Mouse click handling
function mousePressed() {
  // Pass mouse events to the current scene
  if (sceneManager.scenes.length > 0) {
    sceneManager.scenes[sceneManager.currentSceneIndex].mousePressed();
  }
}

// Scene Manager class
class SceneManager {
  constructor() {
    this.scenes = [];
    this.sceneNames = [];
    this.currentSceneIndex = 0;
    this.currentSceneName = "";
  }
  
  addScene(name, scene) {
    this.scenes.push(scene);
    this.sceneNames.push(name);
  }
  
  setCurrentScene(name) {
    const index = this.sceneNames.indexOf(name);
    if (index !== -1) {
      this.currentSceneIndex = index;
      this.currentSceneName = name;
      this.scenes[index].setup();
    }
  }
  
  setCurrentSceneByIndex(index) {
    if (index >= 0 && index < this.scenes.length) {
      this.currentSceneIndex = index;
      this.currentSceneName = this.sceneNames[index];
      this.scenes[index].setup();
    }
  }
  
  update() {
    if (this.scenes.length > 0) {
      this.scenes[this.currentSceneIndex].update();
    }
  }
  
  display() {
    if (this.scenes.length > 0) {
      this.scenes[this.currentSceneIndex].display();
    }
  }
}

// Scene base class
class Scene {
  constructor() {
    // 基础场景属性
  }
  
  setup() {
    // 初始化场景
  }
  
  update() {
    // 更新场景
  }
  
  display() {
    // 显示场景
  }
}

// Navigation Page Scene (First Scene)
class IntroScene extends Scene {
  constructor() {
    super();
    this.particles = [];
    this.startButton = {
      x: 320,
      y: 240,
      width: 120,
      height: 40,
      isHover: false
    };
  }
  
  setup() {
    // 创建240个粒子
    this.particles = [];
    for (let i = 0; i < 240; i++) {
      this.particles.push(new IntroParticle());
    }
  }
  
  update() {
    // 更新粒子
    for (let particle of this.particles) {
      particle.update();
    }
    
    // 检查鼠标是否悬停在按钮上
    this.startButton.isHover = this.isMouseOverButton();
  }
  
  display() {
    // 绘制黑色背景
    background(0);
    
    // 绘制粒子
    for (let particle of this.particles) {
      particle.display();
    }
    
    // 绘制粒子之间的连线
    this.drawParticleConnections();
    
    // 绘制开始按钮
    this.drawStartButton();
    
    // 绘制标题
    this.drawTitle();
  }
  
  drawParticleConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        let p1 = this.particles[i];
        let p2 = this.particles[j];
        let d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
        
        if (d < 30) {
          // 计算连线透明度
          let alpha = map(d, 0, 30, 50, 10);
          
          stroke(200, 70, 80, alpha);
          strokeWeight(0.5);
          line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
        }
      }
    }
  }
  
  drawStartButton() {
    push();
    // 按钮底色
    noStroke();
    if (this.startButton.isHover) {
      fill(200, 80, 90, 90); // 悬停时颜色
    } else {
      fill(200, 60, 70, 80); // 普通状态颜色
    }
    
    // 按钮形状
    rectMode(CENTER);
    rect(this.startButton.x, this.startButton.y, 
         this.startButton.width, this.startButton.height, 10);
    
    // 按钮文字
    textAlign(CENTER, CENTER);
    textSize(20);
    fill(0, 0, 100);
    text("START", this.startButton.x, this.startButton.y);
    pop();
  }
  
  drawTitle() {
    push();
    textAlign(CENTER);
    textSize(36);
    fill(200, 80, 95);
    text("Face Nebula", width/2, 120);
    
    textSize(16);
    fill(0, 0, 100, 80);
    text("", width/2, 160);
    pop();
  }
  
  isMouseOverButton() {
    return mouseX > this.startButton.x - this.startButton.width/2 && 
           mouseX < this.startButton.x + this.startButton.width/2 &&
           mouseY > this.startButton.y - this.startButton.height/2 && 
           mouseY < this.startButton.y + this.startButton.height/2;
  }
  
  mousePressed() {
    // 检查是否点击了开始按钮
    if (this.isMouseOverButton()) {
      // 切换到第二个场景
      sceneManager.setCurrentSceneByIndex(1);
    }
  }
}

// Navigation Page Particle class
class IntroParticle {
  constructor() {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
    this.acc = createVector(0, 0);
    this.size = random(1.5, 3.5);
    this.maxSpeed = 1.0;
    this.hue = random(180, 260); // 蓝紫色调
    this.saturation = random(60, 80);
    this.brightness = random(80, 95);
  }
  
  update() {
    // 添加一点随机性
    if (random(1) < 0.02) {
      let jitter = p5.Vector.random2D();
      jitter.mult(0.1);
      this.vel.add(jitter);
    }
    
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // 边界检查 - 使用边界反弹
    if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -1;
    }
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -1;
    }
    if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y *= -1;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -1;
    }
  }
  
  display() {
    noStroke();
    
    // 发光效果
    for (let i = 2; i >= 0; i--) {
      let size = this.size * (1 + i * 0.5);
      let alpha = map(i, 0, 2, 70, 20);
      
      fill(this.hue, this.saturation, this.brightness, alpha);
      circle(this.pos.x, this.pos.y, size);
    }
    
    // 粒子中心
    fill(this.hue, this.saturation, this.brightness, 80);
    circle(this.pos.x, this.pos.y, this.size);
  }
}

// Simple Black Background Scene (Second Scene)
class SimpleBlackScene extends Scene {
  constructor() {
    super();
    this.grids = [];  // 存储9个网格
    this.gridSize = { width: 0, height: 0 };
    this.gridParticleCount = 60;  // 每个网格的粒子数量
    this.selectedGrid = -1;  // 当前选中的网格，-1表示未选中
  }
  
  setup() {
    // 计算网格大小
    this.gridSize = {
      width: width / 3,
      height: height / 3
    };
    
    // 创建9个网格，每个网格有自己的粒子系统
    this.grids = [];
    for (let i = 0; i < 9; i++) {
      const row = Math.floor(i / 3);
      const col = i % 3;
      
      this.grids.push({
        index: i,
        x: col * this.gridSize.width,
        y: row * this.gridSize.height,
        width: this.gridSize.width,
        height: this.gridSize.height,
        particles: this.createGridParticles(
          col * this.gridSize.width, 
          row * this.gridSize.height, 
          this.gridSize.width, 
          this.gridSize.height
        ),
        isHovered: false,
        hasCapturedFace: false,
        capturedState: null
      });
    }
    
    // 更新网格以包含捕获的面部状态
    this.updateGridsWithCapturedFaces();
  }
  
  createGridParticles(x, y, w, h) {
    // 为每个网格创建粒子
    const particles = [];
    const hueOffset = random(0, 360);  // 为每个网格添加不同的色调偏移
    
    for (let i = 0; i < this.gridParticleCount; i++) {
      particles.push(new GridParticle(
        random(x + 10, x + w - 10),  // 稍微缩小范围，让粒子不要靠近边缘
        random(y + 10, y + h - 10),
        x, y, w, h,
        hueOffset
      ));
    }
    
    return particles;
  }
  
  // 更新网格以显示已捕获的面部状态
  updateGridsWithCapturedFaces() {
    // 遍历所有已捕获的面部状态
    for (let i = 0; i < capturedFaceStates.length && i < this.grids.length; i++) {
      const capturedState = capturedFaceStates[i];
      const grid = this.grids[i];
      
      // 为网格添加捕获的面部状态
      grid.hasCapturedFace = true;
      grid.capturedState = capturedState;
      
      // 根据捕获的面部特征更新粒子
      this.updateGridParticlesWithFaceState(grid, capturedState);
    }
  }
  
  // 根据面部状态更新网格中的粒子
  updateGridParticlesWithFaceState(grid, faceState) {
    if (!grid || !faceState || !faceState.faceOutlinePoints || !faceState.featurePoints) return;
    
    // 创建网格到脸部的映射比例
    const scaleX = grid.width / 640;
    const scaleY = grid.height / 480;
    
    // 更新网格中的粒子类型和位置
    let outlineCount = 0;
    let featureCount = {
      leftEye: 0,
      rightEye: 0,
      nose: 0,
      mouth: 0
    };
    
    // 最大特征点粒子数量
    const maxFeatureParticles = 15;
    
    // 更新粒子状态
    for (let i = 0; i < grid.particles.length; i++) {
      let particle = grid.particles[i];
      
      // 前15个粒子分配给左眼特征
      if (i < 15 && featureCount.leftEye < maxFeatureParticles && faceState.featurePoints.filter(p => p.type === 'leftEye').length > 0) {
        particle.type = 'leftEye';
        let featurePoints = faceState.featurePoints.filter(p => p.type === 'leftEye');
        let point = featurePoints[featureCount.leftEye % featurePoints.length];
        particle.targetPos = createVector(
          grid.x + (point.pos.x * scaleX),
          grid.y + (point.pos.y * scaleY)
        );
        featureCount.leftEye++;
      }
      // 接下来15个粒子分配给右眼特征
      else if (i < 30 && featureCount.rightEye < maxFeatureParticles && faceState.featurePoints.filter(p => p.type === 'rightEye').length > 0) {
        particle.type = 'rightEye';
        let featurePoints = faceState.featurePoints.filter(p => p.type === 'rightEye');
        let point = featurePoints[featureCount.rightEye % featurePoints.length];
        particle.targetPos = createVector(
          grid.x + (point.pos.x * scaleX),
          grid.y + (point.pos.y * scaleY)
        );
        featureCount.rightEye++;
      }
      // 接下来15个粒子分配给鼻子特征
      else if (i < 45 && featureCount.nose < maxFeatureParticles && faceState.featurePoints.filter(p => p.type === 'nose').length > 0) {
        particle.type = 'nose';
        let featurePoints = faceState.featurePoints.filter(p => p.type === 'nose');
        let point = featurePoints[featureCount.nose % featurePoints.length];
        particle.targetPos = createVector(
          grid.x + (point.pos.x * scaleX),
          grid.y + (point.pos.y * scaleY)
        );
        featureCount.nose++;
      }
      // 接下来15个粒子分配给嘴巴特征
      else if (i < 60 && featureCount.mouth < maxFeatureParticles && faceState.featurePoints.filter(p => p.type === 'mouth').length > 0) {
        particle.type = 'mouth';
        let featurePoints = faceState.featurePoints.filter(p => p.type === 'mouth');
        let point = featurePoints[featureCount.mouth % featurePoints.length];
        particle.targetPos = createVector(
          grid.x + (point.pos.x * scaleX),
          grid.y + (point.pos.y * scaleY)
        );
        featureCount.mouth++;
      }
      // 剩余粒子分配给面部轮廓
      else {
        particle.type = 'outline';
        if (faceState.faceOutlinePoints.length > 0) {
          let point = faceState.faceOutlinePoints[outlineCount % faceState.faceOutlinePoints.length];
          particle.targetPos = createVector(
            grid.x + (point.x * scaleX),
            grid.y + (point.y * scaleY)
          );
          outlineCount++;
        }
      }
      
      // 更新粒子颜色
      particle.setColor();
    }
  }
  
  update() {
    // 更新所有网格中的粒子
    for (let grid of this.grids) {
      // 检查鼠标是否悬停在网格上
      grid.isHovered = this.isMouseOverGrid(grid);
      
      // 更新粒子
      for (let particle of grid.particles) {
        // 如果网格有捕获的面部状态，则更新粒子位置向目标位置移动
        if (grid.hasCapturedFace && particle.targetPos) {
          // 向目标位置施加引力
          let force = p5.Vector.sub(particle.targetPos, particle.pos);
          let d = force.mag();
          
          if (d > 0.5) {
            // 捕获状态下的引力更强，但随距离减弱
            force.setMag(0.1 + 1.0 / (1 + d * 0.1));
            particle.applyForce(force);
          }
        }
        
        particle.update(grid.isHovered);
      }
    }
  }
  
  display() {
    // 绘制黑色背景
    background(0);
    
    // 绘制所有网格和粒子
    for (let grid of this.grids) {
      this.drawGrid(grid);
    }
    
    // 绘制说明文字
    this.drawInstructions();
  }
  
  drawGrid(grid) {
    push();
    
    // 绘制网格边框 - 捕获的面部网格有特殊边框
    noFill();
    if (grid.hasCapturedFace) {
      // 捕获的面部网格有特殊边框
      stroke(120, 90, 95, grid.isHovered ? 90 : 70);
      strokeWeight(grid.isHovered ? 3 : 2);
    } else if (grid.isHovered) {
      stroke(200, 80, 90, 80);  // 高亮边框
      strokeWeight(2);
    } else {
      stroke(200, 60, 50, 40);  // 普通边框
      strokeWeight(1);
    }
    
    rect(grid.x, grid.y, grid.width, grid.height);
    
    // 绘制粒子
    for (let particle of grid.particles) {
      particle.display(grid.isHovered);
    }
    
    // 绘制粒子连线
    if (grid.isHovered || grid.hasCapturedFace) {
      this.drawParticleConnections(grid);
    }
    
    // 如果网格被悬停或包含捕获的面部，显示信息
    if (grid.isHovered || grid.hasCapturedFace) {
      textAlign(CENTER, CENTER);
      
      // 如果有捕获的面部
      if (grid.hasCapturedFace) {
        // 显示捕获时间
        textSize(12);
        fill(120, 70, 95, 90);
        text(`Captured at: ${grid.capturedState.timestamp}`, 
             grid.x + grid.width/2, grid.y + 20);
        
        // 如果鼠标悬停，显示查看提示
        if (grid.isHovered) {
          textSize(16);
          fill(0, 0, 100, 90);
          text("Click to view", grid.x + grid.width/2, grid.y + grid.height - 20);
        }
      } else {
        // 网格号
        textSize(24);
        fill(200, 80, 95, 80);
        text(`Grid ${grid.index + 1}`, grid.x + grid.width/2, grid.y + grid.height/2 - 15);
        
        // 点击提示
        textSize(14);
        fill(0, 0, 100, 90);
        text("Click to enter", grid.x + grid.width/2, grid.y + grid.height/2 + 15);
      }
    }
    
    pop();
  }
  
  drawParticleConnections(grid) {
    for (let i = 0; i < grid.particles.length; i++) {
      for (let j = i + 1; j < grid.particles.length; j++) {
        let p1 = grid.particles[i];
        let p2 = grid.particles[j];
        let d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
        
        // 连线最大距离根据网格大小调整
        let maxDist = min(grid.width, grid.height) / 5;
        
        if (d < maxDist) {
          // 计算连线透明度
          let alpha = map(d, 0, maxDist, 50, 10);
          
          stroke(p1.hue, p1.saturation * 0.8, p1.brightness * 0.8, alpha);
          strokeWeight(0.5);
          line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
        }
      }
    }
  }
  
  drawInstructions() {
    push();
    textAlign(CENTER);
    textSize(16);
    fill(0, 0, 100, 80);
    text("Hover over grids to see effects", width/2, height - 60);
    text("Click on empty grid to enter Face Nebula effect", width/2, height - 40);
    text("Press 'S' key in Face Nebula scene to capture current face state", width/2, height - 20);
    pop();
  }
  
  isMouseOverGrid(grid) {
    return mouseX > grid.x && mouseX < grid.x + grid.width &&
           mouseY > grid.y && mouseY < grid.y + grid.height;
  }
  
  mousePressed() {
    // 如果点击了某个网格
    for (let grid of this.grids) {
      if (this.isMouseOverGrid(grid)) {
        // 如果网格有捕获的面部状态，直接加载这个状态（未实现）
        if (grid.hasCapturedFace) {
          console.log(`Clicked on grid with captured face ${grid.index + 1}`);
          // Feature to view captured face can be added here
        } else {
          console.log(`Clicked grid ${grid.index + 1}, jumping to Face Nebula scene`);
          
          // Add click feedback effect
          this.createClickEffect(grid);
          
          // Delay jump slightly to show click effect
          setTimeout(() => {
            sceneManager.setCurrentSceneByIndex(2); // Switch to scene 3 (Face Nebula)
          }, 300);
        }
        
        break;
      }
    }
  }
  
  // 创建点击反馈效果
  createClickEffect(grid) {
    // 在网格中心创建一个圆形扩散效果
    let centerX = grid.x + grid.width/2;
    let centerY = grid.y + grid.height/2;
    
    // 使用p5.js的动画效果
    push();
    noFill();
    stroke(200, 100, 100);
    strokeWeight(3);
    
    // 绘制第一个圆
    circle(centerX, centerY, 20);
    
    // 添加一个更大的圆
    stroke(200, 100, 100, 70);
    strokeWeight(2);
    circle(centerX, centerY, 40);
    
    // 添加第三个最大的圆
    stroke(200, 100, 100, 40);
    strokeWeight(1);
    circle(centerX, centerY, 60);
    pop();
  }
}

// Grid Particle class
class GridParticle {
  constructor(x, y, gridX, gridY, gridWidth, gridHeight, hueOffset) {
    // 粒子位置和运动参数
    this.pos = createVector(x, y);
    this.vel = createVector(random(-0.3, 0.3), random(-0.3, 0.3));
    this.acc = createVector(0, 0);
    this.maxSpeed = 0.8;  // 较慢的移动速度
    this.targetPos = null; // 目标位置，用于捕获的面部状态
    
    // 网格边界
    this.gridX = gridX;
    this.gridY = gridY;
    this.gridWidth = gridWidth;
    this.gridHeight = gridHeight;
    
    // 外观
    this.size = random(1.0, 2.5);
    this.hue = (random(180, 260) + hueOffset) % 360;  // 基于网格的色调偏移
    this.saturation = random(60, 80);
    this.brightness = random(70, 95);
    this.type = 'outline'; // 默认类型
  }
  
  setColor() {
    // 根据类型设置HSB颜色
    switch(this.type) {
      case 'leftEye':
        this.hue = 210; // 蓝色
        this.saturation = 90;
        this.brightness = 95;
        break;
      case 'rightEye':
        this.hue = 180; // 青色
        this.saturation = 85;
        this.brightness = 90;
        break;
      case 'nose':
        this.hue = 120; // 绿色
        this.saturation = 80;
        this.brightness = 90;
        break;
      case 'mouth':
        this.hue = 350; // 红粉色
        this.saturation = 85;
        this.brightness = 95;
        break;
      default: // outline
        this.hue = 270; // 紫色
        this.saturation = 70;
        this.brightness = 95;
    }
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update(isHovered) {
    // 添加一点随机移动
    if (random(1) < 0.03) {
      let jitter = p5.Vector.random2D();
      jitter.mult(isHovered ? 0.1 : 0.05);  // 悬停时增加活跃度
      this.vel.add(jitter);
    }
    
    // 如果网格被悬停，增加粒子速度
    if (isHovered) {
      this.maxSpeed = 1.2;
    } else {
      this.maxSpeed = 0.8;
    }
    
    // 更新位置
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // 边界检查 - 确保粒子留在网格内
    this.checkBounds();
  }
  
  checkBounds() {
    const padding = 5;  // 边界内边距
    
    if (this.pos.x > this.gridX + this.gridWidth - padding) {
      this.pos.x = this.gridX + this.gridWidth - padding;
      this.vel.x *= -1;
    }
    if (this.pos.x < this.gridX + padding) {
      this.pos.x = this.gridX + padding;
      this.vel.x *= -1;
    }
    if (this.pos.y > this.gridY + this.gridHeight - padding) {
      this.pos.y = this.gridY + this.gridHeight - padding;
      this.vel.y *= -1;
    }
    if (this.pos.y < this.gridY + padding) {
      this.pos.y = this.gridY + padding;
      this.vel.y *= -1;
    }
  }
  
  display(isHovered) {
    noStroke();
    
    // 悬停时有发光效果
    if (isHovered) {
      // 外发光
      for (let i = 1; i >= 0; i--) {
        let size = this.size * (1.5 + i * 0.7);
        let alpha = map(i, 0, 1, 40, 20);
        
        fill(this.hue, this.saturation, this.brightness, alpha);
        circle(this.pos.x, this.pos.y, size);
      }
      
      // 主体
      fill(this.hue, this.saturation, this.brightness, 80);
      circle(this.pos.x, this.pos.y, this.size * 1.2);
    } else {
      // 未悬停时的简单显示
      fill(this.hue, this.saturation * 0.8, this.brightness * 0.7, 60);
      circle(this.pos.x, this.pos.y, this.size);
    }
  }
}

// Face Nebula Scene
class FaceNebulaScene extends Scene {
  constructor() {
    super();
    this.app = null;
    this.captureMessage = ""; // 捕获消息
    this.captureMessageTime = 0; // 消息显示时间
  }
  
  setup() {
    // 创建主应用实例
    this.app = new FaceNebulaApp();
  }
  
  update() {
    if (this.app) {
      this.app.update();
    }
  }
  
  display() {
    if (this.app) {
      this.app.display();
    }
    
    // 显示捕获相关的信息
    this.displayCaptureInfo();
  }
  
  displayCaptureInfo() {
    // 显示基本操作提示
    push();
    textAlign(CENTER);
    textSize(16);
    fill(0, 0, 100, 70);
    text("Press 'S' key to capture current face state", width/2, height - 20);
    pop();
    
    // 如果有捕获消息，显示一段时间
    if (this.captureMessage && millis() - this.captureMessageTime < 3000) {
      push();
      textAlign(CENTER, CENTER);
      textSize(24);
      fill(120, 90, 95);
      // 创建背景使文字更易读
      noStroke();
      fill(0, 0, 0, 50);
      rectMode(CENTER);
      rect(width/2, height/2, 400, 80, 10);
      
      // 显示消息
      fill(120, 90, 95);
      text(this.captureMessage, width/2, height/2);
      pop();
    }
  }
  
  // 捕获当前面部状态
  captureFaceState() {
    if (!this.app || !this.app.faceTracker || !this.app.faceTracker.faceDetected) {
      this.captureMessage = "No face detected, cannot capture";
      this.captureMessageTime = millis();
      return;
    }
    
    // 创建要保存的面部状态对象
    const faceState = {
      timestamp: this.formatTimestamp(new Date()),
      faceOutlinePoints: [...this.app.faceTracker.faceOutlinePoints], // 复制轮廓点
      featurePoints: JSON.parse(JSON.stringify(this.app.faceTracker.featurePoints)), // 深拷贝特征点
      faceCenter: this.app.faceTracker.faceCenter ? this.app.faceTracker.faceCenter.copy() : null
    };
    
    // 将状态添加到全局数组
    capturedFaceStates.push(faceState);
    
    // 限制最多保存9个状态（对应9个网格）
    if (capturedFaceStates.length > 9) {
      capturedFaceStates.shift(); // 移除最早的状态
    }
    
    // 显示成功消息
    this.captureMessage = `Successfully captured face state #${capturedFaceStates.length}`;
    this.captureMessageTime = millis();
    
    console.log("Face state captured:", faceState);
  }
  
  // 格式化时间戳
  formatTimestamp(date) {
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }
}

// Original Face Nebula Application class
class FaceNebulaApp {
  constructor() {
    this.isP5Loaded = typeof p5 !== 'undefined';
    this.isML5Loaded = typeof ml5 !== 'undefined';
    this.hasError = false;
    this.errorMessage = "";
    this.videoOpacity = 20;
    
    // 初始化组件
    this.initVideo();
    
    // 只有当没有错误时才继续初始化
    if (!this.hasError) {
      this.faceTracker = new FaceTracker(this.video);
      this.particleSystem = new ParticleSystem(240); // 保持240个粒子
    }
  }
  
  initVideo() {
    try {
      // 检查库是否加载
      if (!this.isP5Loaded) {
        this.hasError = true;
        this.errorMessage = "p5.js library not loaded";
        return;
      }
      
      if (!this.isML5Loaded) {
        this.hasError = true;
        this.errorMessage = "ml5.js library not loaded";
        return;
      }
      
      // 初始化视频
      this.video = createCapture(VIDEO, () => {
        console.log("Camera ready!");
      });
      
      this.video.elt.onloadeddata = () => {
        console.log("Video data loaded!");
      };
      
      this.video.elt.onerror = (e) => {
        console.error("Video error:", e);
        this.hasError = true;
        this.errorMessage = "Video loading error: " + e;
      };
      
      this.video.size(640, 480);
      this.video.hide();
      
    } catch(e) {
      console.error("Setup error:", e);
      this.hasError = true;
      this.errorMessage = "Initialization error: " + e.message;
    }
  }
  
  update() {
    // 如果有错误，不更新
    if (this.hasError) return;
    
    // 更新面部跟踪器
    this.faceTracker.update();
    
    // 更新粒子系统
    this.particleSystem.update(
      this.faceTracker.faceDetected, 
      this.faceTracker.faceOutlinePoints, 
      this.faceTracker.featurePoints, 
      this.faceTracker.faceCenter
    );
  }
  
  display() {
    // 绘制深蓝色背景
    background(240, 10, 5);
    
    // 显示错误信息（如果有）
    if (this.hasError) {
      fill(0, 100, 100);
      textAlign(CENTER, CENTER);
      textSize(18);
      text("Error: " + this.errorMessage, width/2, height/2);
      return;
    }
    
    // 绘制视频背景
    this.displayVideo();
    
    // 显示粒子系统
    this.particleSystem.display(this.faceTracker.faceDetected);
  }
  
  displayVideo() {
    if (this.video !== undefined && this.video.loadedmetadata) {
      push();
      translate(width, 0);
      scale(-1, 1);
      tint(0, 0, 100, this.videoOpacity); // 降低视频透明度
      image(this.video, 0, 0, width, height);
      noTint();
      pop();
    }
  }
}

// Face Tracker class
class FaceTracker {
  constructor(video) {
    this.video = video;
    this.faces = [];
    this.faceOutlinePoints = [];
    this.featurePoints = [];
    this.faceCenter = null;
    this.lastFaceUpdate = 0;
    this.lastFeatureUpdate = 0;
    this.showOutline = false;
    this.isModelReady = false;
    
    // 初始化facemesh模型
    this.initFacemesh();
  }
  
  initFacemesh() {
    this.facemesh = ml5.facemesh(this.video, this.modelReady.bind(this));
    
    // 设置facemesh检测到面部时的回调函数
    this.facemesh.on("face", results => {
      this.faces = results;
      this.lastFaceUpdate = millis();
      
      if (this.faces.length > 0) {
        this.extractFacePoints(this.faces[0]);
      }
    });
  }
  
  modelReady() {
    console.log("Model ready!");
    this.isModelReady = true;
  }
  
  update() {
    // 检查是否检测到面部
    this.faceDetected = this.faceOutlinePoints.length > 0 && 
                       millis() - this.lastFeatureUpdate < 1000;
  }
  
  extractFacePoints(face) {
    // 重置点集合
    this.faceOutlinePoints = [];
    this.featurePoints = [];
    this.lastFeatureUpdate = millis();
    
    // 保存所有面部轮廓点
    for (let pt of face.annotations.silhouette) {
      let [x, y] = pt;
      x = width - x; // 翻转x坐标以匹配视频镜像
      this.faceOutlinePoints.push(createVector(x, y));
    }
    
    // 保存左眼特征点
    this.saveFeaturePoints(face.annotations.leftEyeUpper0, 'leftEye');
    this.saveFeaturePoints(face.annotations.leftEyeLower0, 'leftEye');
    
    // 保存右眼特征点
    this.saveFeaturePoints(face.annotations.rightEyeUpper0, 'rightEye');
    this.saveFeaturePoints(face.annotations.rightEyeLower0, 'rightEye');
    
    // 保存鼻子特征点
    this.saveFeaturePoints(face.annotations.noseBottom, 'nose');
    this.saveFeaturePoints(face.annotations.noseTip, 'nose');
    
    // 保存嘴巴特征点
    this.saveFeaturePoints(face.annotations.lipsUpperOuter, 'mouth');
    this.saveFeaturePoints(face.annotations.lipsLowerOuter, 'mouth');
    
    // 计算面部中心点
    this.calculateFaceCenter();
  }
  
  saveFeaturePoints(points, type) {
    for (let pt of points) {
      let [x, y] = pt;
      x = width - x; // 翻转x坐标以匹配视频镜像
      this.featurePoints.push({
        pos: createVector(x, y),
        type: type
      });
    }
  }
  
  calculateFaceCenter() {
    if (this.faceOutlinePoints.length === 0) return;
    
    let sumX = 0, sumY = 0;
    for (let pt of this.faceOutlinePoints) {
      sumX += pt.x;
      sumY += pt.y;
    }
    
    this.faceCenter = createVector(
      sumX / this.faceOutlinePoints.length,
      sumY / this.faceOutlinePoints.length
    );
  }
}

// Particle System class
class ParticleSystem {
  constructor(particleCount) {
    this.particles = [];
    this.particleCount = particleCount;
    this.initParticles();
  }
  
  initParticles() {
    // 创建粒子，为不同区域分配不同颜色
    for (let i = 0; i < this.particleCount; i++) {
      let type;
      // 简单明确分配：左眼15个，右眼15个，鼻子15个，嘴巴15个，轮廓所有剩余粒子
      if (i < 15) {
        type = 'leftEye';
      } else if (i < 30) {
        type = 'rightEye';
      } else if (i < 45) {
        type = 'nose';
      } else if (i < 60) {
        type = 'mouth';
      } else {
        type = 'outline'; // 所有剩余粒子都分配给轮廓
      }
      this.particles.push(new Particle(type));
    }
  }
  
  update(faceDetected, faceOutlinePoints, featurePoints, faceCenter) {
    for (let particle of this.particles) {
      // 如果检测到面部特征
      if (faceDetected) {
        // 面部轮廓粒子
        if (particle.type === 'outline') {
          this.handleOutlineParticle(particle, faceOutlinePoints, faceCenter);
        } 
        // 面部特征粒子（眼睛、鼻子、嘴巴）
        else {
          this.handleFeatureParticle(particle, featurePoints);
        }
      } else {
        // 如果没有检测到面部，粒子随机漂浮
        if (random(1) < 0.05) {
          let randomForce = p5.Vector.random2D();
          randomForce.mult(0.2);
          particle.applyForce(randomForce);
        }
        particle.highlight = false;
      }
      
      particle.update();
    }
  }
  
  display(faceDetected) {
    // 渲染所有粒子
    for (let particle of this.particles) {
      this.renderParticle(particle);
    }
    
    // 粒子间连线
    this.drawParticleConnections(faceDetected);
  }
  
  handleOutlineParticle(particle, faceOutlinePoints, faceCenter) {
    // 如果没有轮廓点或中心点，提前返回
    if (!faceOutlinePoints.length || !faceCenter) return;
    
    // 计算相对于面部中心的角度
    let angle = atan2(particle.pos.y - faceCenter.y, particle.pos.x - faceCenter.x);
    
    // 使用角度找到最接近的轮廓点
    let index = floor(map(angle, -PI, PI, 0, faceOutlinePoints.length));
    index = constrain(index, 0, faceOutlinePoints.length - 1);
    
    let targetPoint = faceOutlinePoints[index];
    
    // 计算粒子到面部中心和轮廓的距离
    let distToCenter = dist(particle.pos.x, particle.pos.y, faceCenter.x, faceCenter.y);
    let outlineDistToCenter = dist(targetPoint.x, targetPoint.y, faceCenter.x, faceCenter.y);
    
    // 确定粒子与轮廓的距离差异
    let distDiff = abs(distToCenter - outlineDistToCenter);
    
    // 如果粒子离轮廓很近（减小了区域范围）
    if (distDiff < 15) {
      // 让粒子沿着轮廓漂浮，添加切向力
      let tangent = createVector(
        -sin(angle + particle.direction * 0.2), 
        cos(angle + particle.direction * 0.2)
      );
      tangent.mult(0.4); // 稍微减小漂浮力度
      particle.applyForce(tangent);
      
      // 使粒子更亮更大
      particle.highlight = true;
      particle.highlightIntensity = map(distDiff, 0, 15, 1.0, 0.5);
    } 
    // 如果粒子离轮廓较远，给予吸引力
    else {
      // 向轮廓点施加引力
      let force = p5.Vector.sub(targetPoint, particle.pos);
    let d = force.mag();
      d = constrain(d, 5, 100);
      let strength = 100 / (d * d);
      force.setMag(strength);
      particle.applyForce(force);
      
      particle.highlight = false;
    }
  }
  
  handleFeatureParticle(particle, featurePoints) {
    // 筛选出匹配类型的特征点
    let targetPoints = [];
    for (let point of featurePoints) {
      if (point.type === particle.type) {
        targetPoints.push(point.pos);
      }
    }
    
    if (targetPoints.length > 0) {
      // 找到最近的特征点
      let closestPoint = null;
      let minDist = Infinity;
      
      for (let pt of targetPoints) {
        let d = dist(particle.pos.x, particle.pos.y, pt.x, pt.y);
        if (d < minDist) {
          minDist = d;
          closestPoint = pt;
        }
      }
      
      // 根据距离应用不同的力（调整作用范围，使粒子更聚集）
      if (minDist < 8) {  // 进一步缩小环绕范围
        // 如果非常近，沿特征周围环绕
        let angle = atan2(particle.pos.y - closestPoint.y, particle.pos.x - closestPoint.x);
        let tangent = createVector(
          -sin(angle + particle.direction * 0.3),
          cos(angle + particle.direction * 0.3)
        );
        tangent.mult(0.3);  // 降低环绕速度
        particle.applyForce(tangent);
        particle.highlight = true;
        particle.highlightIntensity = map(minDist, 0, 8, 1.0, 0.7);
      } else if (minDist < 30) {  // 减小吸引范围
        // 如果较近，被吸引到特征点
        let force = p5.Vector.sub(closestPoint, particle.pos);
        let strength = 100 / (minDist * minDist);  // 增加吸引强度
    force.setMag(strength);
        particle.applyForce(force);
        particle.highlight = minDist < 15;  // 调整高亮范围
        if (particle.highlight) {
          particle.highlightIntensity = map(minDist, 0, 15, 0.7, 0.4);
        }
      } else {
        // 如果太远，给予更强的吸引力
        if (random(1) < 0.15) {  // 增加吸引概率
          let randomFeaturePoint = random(targetPoints);
          let force = p5.Vector.sub(randomFeaturePoint, particle.pos);
          force.setMag(0.25);  // 增加吸引力
          particle.applyForce(force);
        }
        particle.highlight = false;
      }
    }
  }
  
  renderParticle(particle) {
    if (particle.highlight) {
      // 高亮粒子
      noStroke();
      
      // 发光效果
      for (let i = 2; i >= 0; i--) {
        let size = particle.size * (1.5 + i * 0.8);
        let alpha = map(i, 0, 2, 90 * particle.highlightIntensity, 30 * particle.highlightIntensity);
        
        fill(
          particle.hue,
          particle.saturation,
          particle.brightness,
          alpha
        );
        circle(particle.pos.x, particle.pos.y, size);
      }
      
      // 中心点
      fill(
        particle.hue,
        particle.saturation,
        particle.brightness,
        95 * particle.highlightIntensity
      );
      circle(particle.pos.x, particle.pos.y, particle.size * 1.2);
    } else {
      // 普通粒子，降低非高亮粒子的不透明度，使高亮粒子更加突出
      noStroke();
      fill(
        particle.hue,
        particle.saturation * 0.8,
        particle.brightness * 0.7,
        particle.type === 'outline' ? 60 : 50 // 轮廓粒子稍微亮一些
      );
      circle(particle.pos.x, particle.pos.y, particle.size);
    }
  }
  
  drawParticleConnections(faceDetected) {
    if (faceDetected) {
      for (let i = 0; i < this.particles.length; i++) {
        if (!this.particles[i].highlight) continue;
        
        for (let j = i + 1; j < this.particles.length; j++) {
          if (!this.particles[j].highlight) continue;
          
          let p1 = this.particles[i];
          let p2 = this.particles[j];
          let d = dist(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
          
          // 同类型粒子之间的连线最长（减小了连线距离）
          let maxDist = (p1.type === p2.type) ? 30 : 20;
          
          if (d < maxDist) {
            // 计算连线透明度
            let alpha = map(d, 0, maxDist, 70, 10);
            alpha *= min(p1.highlightIntensity, p2.highlightIntensity);
            
            // 计算连线颜色（取两个粒子颜色的中间值）
            let lineHue = (p1.hue + p2.hue) / 2;
            let lineSaturation = (p1.saturation + p2.saturation) / 2;
            let lineBrightness = (p1.brightness + p2.brightness) / 2;
            
            stroke(lineHue, lineSaturation, lineBrightness, alpha);
            strokeWeight(0.8);
            line(p1.pos.x, p1.pos.y, p2.pos.x, p2.pos.y);
          }
        }
      }
    }
  }
}

// Particle class (optimized)
class Particle {
  constructor(type) {
    this.pos = createVector(random(width), random(height));
    this.vel = createVector(random(-0.5, 0.5), random(-0.5, 0.5));
    this.acc = createVector(0, 0);
    this.maxSpeed = 2.0; // 减小最大速度
    
    // 根据粒子类型调整大小
    if (type === 'outline') {
      this.size = random(2.2, 3.8); // 轮廓粒子略大
    } else {
      this.size = random(1.5, 3.0); // 特征粒子略小
    }
    
    this.type = type || 'outline'; // 粒子类型
    this.highlight = false;
    this.highlightIntensity = 0;
    this.direction = random([-1, 1]); // 随机方向（顺时针或逆时针）
    
    // 设置颜色
    this.setColor();
  }
  
  setColor() {
    // 根据类型设置HSB颜色
    switch(this.type) {
      case 'leftEye':
        this.hue = 210; // 蓝色
        this.saturation = 90;
        this.brightness = 95;
        break;
      case 'rightEye':
        this.hue = 180; // 青色
        this.saturation = 85;
        this.brightness = 90;
        break;
      case 'nose':
        this.hue = 120; // 绿色
        this.saturation = 80;
        this.brightness = 90;
        break;
      case 'mouth':
        this.hue = 350; // 红粉色
        this.saturation = 85;
        this.brightness = 95;
        break;
      default: // outline
        this.hue = 270; // 紫色
        this.saturation = 70;
        this.brightness = 95;
    }
  }
  
  applyForce(force) {
    this.acc.add(force);
  }
  
  update() {
    this.vel.add(this.acc);
    this.vel.limit(this.maxSpeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
    
    // 添加一点随机性
    this.addRandomness();
    
    // 边界检查
    this.checkBounds();
  }
  
  addRandomness() {
    // 添加一点随机性，但减小随机性比例
    if (random(1) < 0.02) {
      // 为轮廓粒子增加稍高的随机性以增加视觉变化
      let jitterAmount = this.type === 'outline' ? 0.1 : 0.08;
      let jitter = p5.Vector.random2D();
      jitter.mult(jitterAmount);
      this.vel.add(jitter);
    }
  }
  
  checkBounds() {
    // 边界检查 - 使用边界反弹而不是环绕
    if (this.pos.x > width) {
      this.pos.x = width;
      this.vel.x *= -1;
    }
    if (this.pos.x < 0) {
      this.pos.x = 0;
      this.vel.x *= -1;
    }
    if (this.pos.y > height) {
      this.pos.y = height;
      this.vel.y *= -1;
    }
    if (this.pos.y < 0) {
      this.pos.y = 0;
      this.vel.y *= -1;
    }
  }
} 