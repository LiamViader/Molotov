class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene' });
  }

  init(data) {
    this.gameScene = data.gameScene;
  }

  create() {
    // --- 1. Heart Textures (Pixel Art) ---
    // Generate textures if they don't exist
    if (!this.textures.exists('heart_full')) {
      const heartGraphics = this.make.graphics({ x: 0, y: 0, add: false });
      const pixelSize = 3;
      const heartShape = [
        "01100110",
        "11111111",
        "11111111",
        "11111111",
        "01111110",
        "00111100",
        "00011000"
      ];

      // Draw Full Heart
      heartGraphics.fillStyle(0xeb631b, 1); // Molotov Orange
      for (let y = 0; y < heartShape.length; y++) {
        for (let x = 0; x < heartShape[y].length; x++) {
          if (heartShape[y][x] === '1') {
            heartGraphics.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          }
        }
      }
      // Highlight
      heartGraphics.fillStyle(0xffffff, 0.4);
      heartGraphics.fillRect(1 * pixelSize, 1 * pixelSize, pixelSize, pixelSize);
      heartGraphics.fillRect(5 * pixelSize, 1 * pixelSize, pixelSize, pixelSize);

      heartGraphics.generateTexture('heart_full', 8 * pixelSize, 7 * pixelSize);
      heartGraphics.clear();

      // Draw Empty Heart (Outline)
      // Background
      heartGraphics.fillStyle(0x0d1117, 0.5);
      for (let y = 0; y < heartShape.length; y++) {
        for (let x = 0; x < heartShape[y].length; x++) {
          if (heartShape[y][x] === '1') {
            heartGraphics.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          }
        }
      }

      // Outline
      heartGraphics.fillStyle(0xeb631b, 1);
      for (let y = 0; y < heartShape.length; y++) {
        for (let x = 0; x < heartShape[y].length; x++) {
          if (heartShape[y][x] === '1') {
            let isEdge = false;
            if (y == 0 || y == heartShape.length - 1 || x == 0 || x == heartShape[y].length - 1) isEdge = true;
            else if (heartShape[y - 1] && heartShape[y - 1][x] == '0') isEdge = true;
            else if (heartShape[y + 1] && heartShape[y + 1][x] == '0') isEdge = true;
            else if (heartShape[y][x - 1] == '0' || heartShape[y][x + 1] == '0') isEdge = true;

            if (isEdge) heartGraphics.fillRect(x * pixelSize, y * pixelSize, pixelSize, pixelSize);
          }
        }
      }
      heartGraphics.generateTexture('heart_empty', 8 * pixelSize, 7 * pixelSize);
    }

    // --- 2. Time & Score (Top Left) ---
    this.text_temps = this.add.text(40, 30, "00:00", {
      fontFamily: '"Share Tech Mono", monospace', fontSize: '45px', fill: '#ffffff'
    }).setShadow(2, 2, 'rgba(0,0,0,0.8)', 2);

    this.text_punts = this.add.text(40, 80, "SCORE: 0", {
      fontFamily: '"Share Tech Mono", monospace', fontSize: '35px', fill: '#eb631b'
    }).setShadow(2, 2, 'rgba(0,0,0,0.8)', 2);

    // --- 3. Health Hearts (Top Right) ---
    this.hearts = [];
    const maxHearts = 6;
    const startX = 1750;
    for (let i = 0; i < maxHearts; i++) {
      let heart = this.add.image(startX - (i * 40), 50, 'heart_full').setScale(1.2);
      this.hearts.push(heart);
    }

    // --- 4. Weapon Info (Bottom Left) ---
    // Background
    this.weaponBg = this.add.rectangle(220, 780, 400, 100, 0x0d1117, 0.9)
      .setStrokeStyle(2, 0x30363d);

    // Icon (Default, will update)
    this.weaponIcon = this.add.image(90, 780, 'pistola')
      .setScale(2.5);

    // Ammo Label
    this.add.text(160, 740, "AMMO", {
      fontFamily: '"Share Tech Mono", monospace', fontSize: '20px', fill: '#eb631b'
    }).setShadow(1, 1, 'rgba(0,0,0,0.8)', 1);

    // Ammo Bar
    const ammoBarWidth = 200;
    const ammoBarHeight = 15;
    this.ammoBarBg = this.add.rectangle(160, 775, ammoBarWidth, ammoBarHeight, 0x0d1117)
      .setOrigin(0, 0.5).setStrokeStyle(1, 0xeb631b);

    this.ammoBarFill = this.add.rectangle(160, 775, ammoBarWidth, ammoBarHeight, 0xeb631b)
      .setOrigin(0, 0.5);

    // Reserve Text
    this.text_municio_reserva = this.add.text(160, 795, "", {
      fontFamily: '"Share Tech Mono", monospace', fontSize: '22px', fill: '#8b949e'
    }).setShadow(1, 1, 'rgba(0,0,0,0.8)', 1);

    // --- 5. Fuel Bar (Bottom Right) ---
    this.add.text(1420, 780, "FUEL", {
      fontFamily: '"Share Tech Mono", monospace', fontSize: '28px', fill: '#eb631b'
    }).setOrigin(0.5);

    const barWidth = 300;
    const barHeight = 25;
    const barX = 1620;
    const barY = 780;

    this.fuelBarBg = this.add.rectangle(barX, barY, barWidth + 6, barHeight + 6, 0x0d1117)
      .setStrokeStyle(3, 0x30363d);

    this.fuelBarFill = this.add.rectangle(barX - (barWidth / 2), barY, 0, barHeight, 0xeb631b)
      .setOrigin(0, 0.5);

    this.text_benzina = this.add.text(1800, 780, "0%", {
      fontFamily: '"Share Tech Mono", monospace', fontSize: '24px', fill: '#fff'
    }).setOrigin(0, 0.5);
  }

  update() {
    if (!this.gameScene || !this.gameScene.player) return;

    // Time
    let timeVal = this.gameScene.temps || 0;
    let mins = Math.floor(timeVal / 60);
    let secs = timeVal % 60;
    if (secs < 10) secs = "0" + secs;
    if (mins < 10) mins = "0" + mins;
    this.text_temps.setText("TIME " + mins + ":" + secs);

    // Score
    this.text_punts.setText("SCORE " + (this.gameScene.punts || 0));

    // Health
    const playerLife = this.gameScene.player.vida;
    for (let i = 0; i < this.hearts.length; i++) {
      if (i >= (this.hearts.length - playerLife)) {
        this.hearts[i].setTexture('heart_full');
      } else {
        this.hearts[i].setTexture('heart_empty');
      }
    }

    // Weapon
    const currentWeapon = this.gameScene.player.arma;
    if (this.weaponIcon.texture.key !== currentWeapon.nom) {
      this.weaponIcon.setTexture(currentWeapon.nom);
    }

    // Ammo Bar
    const clip = currentWeapon.bales;
    const maxClip = currentWeapon.mida_cartutxo;
    const clipPercent = Phaser.Math.Clamp(clip / maxClip, 0, 1);
    this.ammoBarFill.width = 200 * clipPercent;

    // Reserve Text
    this.text_municio_reserva.setText("TOTAL: " + currentWeapon.municio);

    // Fuel Bar
    const playerFuel = this.gameScene.player.ampolla;
    const maxFuel = this.gameScene.player.ampolla_max;
    const fuelPercent = Phaser.Math.Clamp(playerFuel / maxFuel, 0, 1);
    this.fuelBarFill.width = 300 * fuelPercent;
    this.text_benzina.setText(Math.floor(fuelPercent * 100) + "%");
  }
  // --- Menu Helpers ---

  createMenuButton(x, y, text, callback) {
    const button = this.add.container(x, y);

    // Styles
    const bg = this.add.rectangle(0, 0, 300, 60, 0x0d1117, 0.9);
    const border = this.add.graphics();
    const textObj = this.add.text(0, 0, text, {
      fontFamily: '"Share Tech Mono", "Courier New", monospace',
      fontSize: '28px',
      color: '#8b949e'
    }).setOrigin(0.5);

    button.add([bg, border, textObj]);
    button.setSize(300, 60);
    button.setInteractive({ useHandCursor: true });

    // Draw initial border
    const drawBorder = (color, thickness) => {
      border.clear();
      border.lineStyle(thickness, color);
      border.strokeRect(-150, -30, 300, 60); // Centered relative to container
    };
    drawBorder(0x30363d, 2);

    // Hover effects
    button.on('pointerover', () => {
      drawBorder(0xeb631b, 2); // Molotov Orange
      textObj.setColor('#ffffff');
      textObj.setShadow(0, 0, 15, 'rgba(235, 99, 27, 0.5)', 2);
      // Optional: Background glow
      border.fillStyle(0xeb631b, 0.1);
      border.fillRect(-150, -30, 300, 60);
    });

    button.on('pointerout', () => {
      drawBorder(0x30363d, 2);
      textObj.setColor('#8b949e');
      textObj.setShadow(0, 0, 0, '#000', 0);
      border.clear(); // Clear fill
      drawBorder(0x30363d, 2); // Redraw border
    });

    button.on('pointerup', callback);

    return button;
  }

  showPauseMenu() {
    // Screen center (UI Scene is 1:1 with screen)
    const screenCenterX = this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.height / 2;

    this.menuContainer = this.add.container(0, 0);

    // Darken background
    const overlay = this.add.rectangle(
      screenCenterX,
      screenCenterY,
      1800, 850, 0x0d1117, 0.8
    );
    this.menuContainer.add(overlay);

    const title = this.add.text(screenCenterX, screenCenterY - 150, "PAUSE", {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '60px',
      fill: '#ffffff',
      shadow: { offsetX: 0, offsetY: 0, color: '#eb631b', blur: 10, stroke: true, fill: true }
    }).setOrigin(0.5);
    this.menuContainer.add(title);

    const btnResume = this.createMenuButton(screenCenterX, screenCenterY - 20, "RESUME", () => {
      this.clearMenu();
      if (this.gameScene) {
        this.gameScene.estat = "jugant";
        this.gameScene.physics.resume();
      }
    });
    this.menuContainer.add(btnResume);

    const btnSave = this.createMenuButton(screenCenterX, screenCenterY + 60, "SAVE GAME", () => {
      if (this.gameScene) {
        this.gameScene.save();
        sessionStorage.clear();
        window.location.assign("../index.html");
      }
    });
    this.menuContainer.add(btnSave);

    const btnExit = this.createMenuButton(screenCenterX, screenCenterY + 140, "EXIT", () => {
      sessionStorage.clear();
      window.location.assign("../index.html");
    });
    this.menuContainer.add(btnExit);
  }

  showGameOverMenu(score) {
    // Screen center
    const screenCenterX = this.cameras.main.width / 2;
    const screenCenterY = this.cameras.main.height / 2;

    this.menuContainer = this.add.container(0, 0);

    // Darken background
    const overlay = this.add.rectangle(
      screenCenterX,
      screenCenterY,
      1800, 850, 0x0d1117, 0.95
    );
    this.menuContainer.add(overlay);

    const title = this.add.text(screenCenterX, screenCenterY - 150, "GAME OVER", {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '80px',
      fill: '#FFF',
      shadow: { offsetX: 0, offsetY: 0, color: '#eb631b', blur: 20, stroke: true, fill: true }
    }).setOrigin(0.5);
    this.menuContainer.add(title);

    const scoreText = this.add.text(screenCenterX, screenCenterY - 50, "Fuel Collected: " + score + " L", {
      fontFamily: '"Share Tech Mono", monospace',
      fontSize: '40px',
      fill: '#e6edf3'
    }).setOrigin(0.5);
    this.menuContainer.add(scoreText);

    const btnExit = this.createMenuButton(screenCenterX, screenCenterY + 100, "EXIT TO MENU", () => {
      sessionStorage.clear();
      window.location.assign("../index.html");
    });
    this.menuContainer.add(btnExit);
  }

  clearMenu() {
    if (this.menuContainer) {
      this.menuContainer.destroy();
      this.menuContainer = null;
    }
  }
}
