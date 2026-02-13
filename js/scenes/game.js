"use srict";

class GameScene extends Phaser.Scene {
    constructor() {
        super('GameScene');

        this.estat = "jugant";
        this.nom = "";

        this.escala_personatge = 0.3;
        this.player = null;
        this.cursors = null;
        this.edificis = null;
        this.conos = null;
        this.bales_aliades = null;
        this.bales_enemigues = null;
        this.cotxes = null;
        this.ncotxes = 12;
        this.cotxes_buits = 0;
        this.colisio_cotxe = false;
        this.cotxe_actual = null;
        this.cotxe_personal = null;


        this.temps = 600;
        this.text_temps = null;
        this.punts = 0;
        this.text_punts = null;
        this.text_vida = null;
        this.text_arma = null;
        this.text_municio = null;
        this.text_benzina = null;

        this.zones_spawn = [];
        this.enemics = null;
        this.n_enemics = 0;
        this.n_enemics_maxim = 40;
        this.dificultat = 1;

        this.loot = null;

        this.pistola = {
            nom: "pistola",
            pos_relativa: new Phaser.Math.Vector2(128, 76).scale(this.escala_personatge), //punta arma respecte al centre del cos
            centre_cos: new Phaser.Math.Vector2(128, 108).scale(this.escala_personatge),
            bales: 16,
            dany: 1,
            municio: 32,
            mida_cartutxo: 16,
            cadencia: 500,
            min_cadencia: 150,
            vel_bala: 900,
            dispersio: 7,
            rang: 600,
            velocitat_recarrega: 2500,
            velocitat_recarrega_min: 800
        }; //per guardar estadistiques
        this.escopeta = {
            nom: "escopeta",
            pos_relativa: new Phaser.Math.Vector2(157, 45).scale(this.escala_personatge),
            centre_cos: new Phaser.Math.Vector2(156, 103).scale(this.escala_personatge),
            bales: 0,
            dany: 1,
            municio: 0,
            mida_cartutxo: 6,
            cadencia: 900,
            min_cadencia: 400,
            vel_bala: 900,
            dispersio: 18,
            rang: 500,
            velocitat_recarrega: 2500,
            velocitat_recarrega_min: 1000
        }; //per guardar estadistiques
        this.rifle = {
            nom: "rifle",
            pos_relativa: new Phaser.Math.Vector2(157, 45).scale(this.escala_personatge),
            centre_cos: new Phaser.Math.Vector2(156, 103).scale(this.escala_personatge),
            bales: 0,
            dany: 2,
            municio: 0,
            mida_cartutxo: 12,
            cadencia: 1500,
            min_cadencia: 700,
            vel_bala: 2000,
            dispersio: 3,
            rang: 1000,
            velocitat_recarrega: 2500,
            velocitat_recarrega_min: 1000
        }; //per guardar estadistiques
        this.ganivet = {//al final no hi haurà mecànica cos a cos pq no em sembla viable amb el temps que em queda
            nom: "ganivet",
            centre_cos: new Phaser.Math.Vector2(128, 108).scale(this.escala_personatge),
            cadencia: 800,
            min_cadencia: 400
        }; //per guardar estadístiques segons es pujen
    }

    preload() {
        this.load.image('vorera', '../resources/mapa/background.png');

        this.load.image('boto', '../resources/mapa/blue_button00.png');

        this.load.image('bala_aliada_pistola', '../resources/bales/bala_aliada_pistola.png');
        this.load.image('bala_enemiga_pistola', '../resources/bales/bala_enemiga_pistola.png');
        this.load.image('bala_enemiga_rifle', '../resources/bales/bala_enemiga_rifle.png');
        this.load.image('bala_aliada_rifle', '../resources/bales/bala_aliada_rifle.png');
        this.load.image('bala_enemiga_escopeta', '../resources/bales/bala_enemiga_escopeta.png');
        this.load.image('municio', '../resources/bales/municio.png');
        this.load.image('escopeta', '../resources/bales/shotgun4.png');
        this.load.image('rifle', '../resources/bales/assaultrifle3.png');
        this.load.image('pistola', '../resources/bales/pistol1.png');

        this.load.spritesheet('ma_caminar', '../resources/sense_arma/caminar_ma.png', { frameWidth: 279, frameHeight: 219 });
        this.load.spritesheet('ma_quiet', '../resources/sense_arma/quiet_ma.png', { frameWidth: 289, frameHeight: 224 });
        this.load.spritesheet('ma_atac', '../resources/sense_arma/atacar_ma.png', { frameWidth: 329, frameHeight: 300 });
        this.load.spritesheet('pistola_caminar', '../resources/pistola/caminar_pistola.png', { frameWidth: 258, frameHeight: 220 });
        this.load.spritesheet('pistola_quiet', '../resources/pistola/quiet_pistola.png', { frameWidth: 253, frameHeight: 216 });
        this.load.spritesheet('pistola_atac', '../resources/pistola/atacar_pistola.png', { frameWidth: 255, frameHeight: 215 });
        this.load.spritesheet('pistola_cop', '../resources/pistola/golpejar_pistola.png', { frameWidth: 291, frameHeight: 256 });
        this.load.spritesheet('pistola_recarregar', '../resources/pistola/recarregar_pistola.png', { frameWidth: 260, frameHeight: 230 });
        this.load.spritesheet('escopeta_caminar', '../resources/escopeta/caminar_escopeta.png', { frameWidth: 313, frameHeight: 206 });
        this.load.spritesheet('escopeta_recarregar', '../resources/escopeta/recarregar_escopeta.png', { frameWidth: 322, frameHeight: 217 });
        this.load.spritesheet('escopeta_quiet', '../resources/escopeta/quiet_escopeta.png', { frameWidth: 313, frameHeight: 207 });
        this.load.spritesheet('escopeta_atac', '../resources/escopeta/atac_escopeta.png', { frameWidth: 312, frameHeight: 206 });
        this.load.spritesheet('rifle_caminar', '../resources/rifle/caminar_rifle.png', { frameWidth: 313, frameHeight: 206 });
        this.load.spritesheet('rifle_recarregar', '../resources/rifle/recarregar_rifle.png', { frameWidth: 322, frameHeight: 217 });

        this.load.spritesheet('enemic1', '../resources/sense_arma/caminar_ma.png', { frameWidth: 279, frameHeight: 219 });
        this.load.spritesheet('enemic2', '../resources/pistola/caminar_pistola.png', { frameWidth: 258, frameHeight: 220 });
        this.load.spritesheet('enemic3', '../resources/escopeta/caminar_escopeta.png', { frameWidth: 313, frameHeight: 206 });
        this.load.spritesheet('enemic4', '../resources/rifle/caminar_rifle.png', { frameWidth: 313, frameHeight: 206 });

        this.load.image('carretera1', '../resources/mapa/carretera1.png');
        this.load.image('carretera2', '../resources/mapa/carretera2.png');
        this.load.image('interseccio', '../resources/mapa/carretera_buida.png');

        this.load.image('edifici1', '../resources/mapa/edifici1.png');
        this.load.image('edifici2', '../resources/mapa/edifici2.png');
        this.load.image('cono', '../resources/mapa/cono.png');

        this.load.image('cotxe1_esquerra', '../resources/mapa/cotxe1_esquerra.png');
        this.load.image('cotxe1_amunt', '../resources/mapa/cotxe1_amunt.png');
        this.load.image('cotxe2_esquerra', '../resources/mapa/cotxe2_esquerra.png');
        this.load.image('cotxe2_avall', '../resources/mapa/cotxe2_avall.png');
        this.load.image('cotxe3', '../resources/mapa/cotxe3.png');

    }
    create() {

        let l_partida = null;
        if (sessionStorage.idPartida && localStorage.partides) {
            let arrayPartides = JSON.parse(localStorage.partides);
            if (sessionStorage.idPartida < arrayPartides.length)
                l_partida = arrayPartides[sessionStorage.idPartida];
        }

        this.nom = sessionStorage.getItem("username");

        {//mapa
            this.mapGroup = this.add.group();

            this.mapGroup.create(-2100, -4700, "vorera").setTint(0x636869);
            this.mapGroup.create(300, -4700, "vorera").setTint(0x636869);
            this.mapGroup.create(2700, -4700, "vorera").setTint(0x636869);
            this.mapGroup.create(-2100, -2300, "vorera").setTint(0x636869);
            this.mapGroup.create(300, -2300, "vorera").setTint(0x636869);
            this.mapGroup.create(2700, -2300, "vorera").setTint(0x636869);
            this.mapGroup.create(-2100, 100, "vorera").setTint(0x636869);
            this.mapGroup.create(300, 100, "vorera").setTint(0x636869);
            this.mapGroup.create(2700, 100, "vorera").setTint(0x636869);
            this.mapGroup.create(-2100, 2500, "vorera").setTint(0x636869);
            this.mapGroup.create(300, 2500, "vorera").setTint(0x636869);
            this.mapGroup.create(2700, 2500, "vorera").setTint(0x636869);


            this.mapGroup.create(600, 0, "carretera1").setTint(0x888e94);
            this.mapGroup.create(600, -1680, "carretera1").setTint(0x888e94);
            this.mapGroup.create(-240, -840, "carretera2").setTint(0x888e94);
            this.mapGroup.create(1200, 0, "carretera1").setTint(0x888e94);
            this.mapGroup.create(-1200, 0, "carretera1").setTint(0x888e94);
            this.mapGroup.create(-1200, 1280, "carretera1").setTint(0x888e94);
            this.mapGroup.create(1200, -1680, "carretera1").setTint(0x888e94);
            this.mapGroup.create(1200, -2940, "carretera1").setTint(0x888e94);
            this.mapGroup.create(-1200, -1680, "carretera1").setTint(0x888e94);
            this.mapGroup.create(-1200, -3480, "carretera1").setTint(0x888e94);
            this.mapGroup.create(1200, -4200, "carretera1").setTint(0x888e94);
            this.mapGroup.create(-400, 2180, "carretera2").setTint(0x888e94);
            this.mapGroup.create(880, 2180, "carretera2").setTint(0x888e94);
            this.mapGroup.create(1840, 2140, "carretera1").setTint(0x888e94);
            this.mapGroup.create(600, -2940, "carretera1").setTint(0x888e94);
            this.mapGroup.create(600, -4200, "carretera1").setTint(0x888e94);
            this.mapGroup.create(-2000, -2640, "carretera2").setTint(0x888e94);
            this.mapGroup.create(2040, -4632, "carretera2").setTint(0x888e94);
            this.mapGroup.create(2940, -4200, "carretera1").setTint(0x888e94);
            this.mapGroup.create(2040, -3400, "carretera2").setTint(0x888e94);


            this.mapGroup.create(600, -840, "interseccio").setTint(0x888e94);
            this.mapGroup.create(1200, -840, "interseccio").setTint(0x888e94);
            this.mapGroup.create(-1200, -840, "interseccio").setTint(0x888e94);
            this.mapGroup.create(-1000, -840, "interseccio").setTint(0x888e94);
            this.mapGroup.create(-1200, 2180, "interseccio").setTint(0x888e94);
            this.mapGroup.create(-1200, 2120, "interseccio").setTint(0x888e94);
            this.mapGroup.create(1720, 2180, "interseccio").setTint(0x888e94);
            this.mapGroup.create(1840, 2180, "interseccio").setTint(0x888e94);
            this.mapGroup.create(1840, 2980, "interseccio").setTint(0x888e94);
            this.mapGroup.create(-1200, -2640, "interseccio").setTint(0x888e94);
            this.mapGroup.create(-1200, -2440, "interseccio").setTint(0x888e94);
            this.mapGroup.create(1200, -4600, "interseccio").setTint(0x888e94);
            this.mapGroup.create(2880, -4632, "interseccio").setTint(0x888e94);
            this.mapGroup.create(2940, -3400, "interseccio").setTint(0x888e94);
            this.mapGroup.create(2840, -3400, "interseccio").setTint(0x888e94);
            this.mapGroup.create(1200, -3400, "interseccio").setTint(0x888e94);


            this.edificis = this.physics.add.staticGroup();
            this.edificis.create(0, 1010, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(0, 400, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(0, 1620, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1220, 1620, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1830, 1010, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(2440, 1010, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(2440, 1620, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(2440, 2230, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(2440, 2840, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(2440, 3450, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1830, 3450, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1220, 3450, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1220, 2840, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(610, 2840, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(0, 2840, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-610, 2840, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1210, 2840, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, 2840, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, 2230, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, 1620, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, 1010, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, 400, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, -210, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, -820, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, -1430, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, -2040, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-2430, -2040, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-3040, -2040, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-3040, -2650, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-3040, -3260, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-2430, -3260, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, -3260, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, -3870, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1820, -4480, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-1210, -4580, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-600, -4580, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-600, -3870, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-600, -3260, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-600, -2650, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-600, -2040, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-600, -1430, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-600, 1620, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-600, 1010, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-600, 400, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(0, -210, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(10, -1430, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(10, -2040, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(10, -2650, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(10, -3260, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(10, -3870, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(10, -4580, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(10, -5190, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(620, -5190, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1230, -5190, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1840, -5190, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(2450, -5190, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(3060, -5190, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(3670, -5190, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(3670, -4580, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(3670, -3970, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(3670, -3360, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(3670, -2750, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(3060, -2750, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(2450, -2750, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1840, -2750, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(2380, -4020, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1770, -4020, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1840, -2140, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1840, -1530, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1840, -920, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1840, -310, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(610, 1010, "edifici2").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1220, 1010, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(1830, 400, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.create(-610, -210, "edifici1").setScale(this.escala_personatge * 2).refreshBody();
            this.edificis.children.iterate(child => child.setSize(570, 570));//per ajustar les colisions

            this.conos = this.physics.add.staticGroup();
            this.conos.create(1680, 20, "cono").setTint(0x888e94);
            this.conos.create(1680, 70, "cono").setTint(0x888e94);
        }

        this.cotxes = this.physics.add.staticGroup();
        var cotxe;
        //cotxes grans
        cotxe = this.cotxes.create(2300, -3300, "cotxe1_esquerra").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 6.0;
        cotxe = this.cotxes.create(-2300, -2560, "cotxe1_esquerra").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 6.0;
        cotxe = this.cotxes.create(480, -4600, "cotxe1_amunt").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 6.0;
        cotxe = this.cotxes.create(1320, -2200, "cotxe1_amunt").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 6.0;
        //cotxes petits
        cotxe = this.cotxes.create(250, -960, "cotxe2_esquerra").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 2.0;
        cotxe = this.cotxes.create(-580, 2060, "cotxe2_esquerra").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 2.0;
        cotxe = this.cotxes.create(2180, -4750, "cotxe2_esquerra").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 2.0;
        cotxe = this.cotxes.create(700, -3400, "cotxe2_avall").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 2.0;
        cotxe = this.cotxes.create(-1100, -980, "cotxe2_avall").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 2.0;
        cotxe = this.cotxes.create(-1080, 450, "cotxe2_avall").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 2.0;
        cotxe = this.cotxes.create(-1080, -3900, "cotxe2_avall").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 2.0;
        cotxe = this.cotxes.create(1950, 1680, "cotxe2_avall").setScale(this.escala_personatge * 2).refreshBody().setTint(0x888e94);
        cotxe.diposit = 2.0;

        this.omplir_cotxes();



        this.cotxe_personal = this.physics.add.image(1830, 3000, "cotxe3").setScale(this.escala_personatge * 2).setImmovable().refreshBody().setTint(0x888e94); //no se si es lo correcte, pero no trobo com afegir un static body sense grup 
        this.cotxe_personal.litres = 0;
        this.cotxe_personal.diposit = 15;
        this.cotxe_personal.text_afegit = false;

        var rect1 = new Phaser.Geom.Rectangle(350, -4830, 1060, 5470);
        var rect2 = new Phaser.Geom.Rectangle(-1500, -4240, 600, 6740);
        var rect3 = new Phaser.Geom.Rectangle(-970, 1940, 2560, 600);
        var rect4 = new Phaser.Geom.Rectangle(-910, -1080, 1270, 560);
        var rect5 = new Phaser.Geom.Rectangle(-2700, -2920, 1200, 600);
        var rect6 = new Phaser.Geom.Rectangle(1480, -3680, 1850, 600);
        this.zones_spawn = [rect3, rect4, rect5, rect6, rect1, rect2];


        this.loot = this.physics.add.staticGroup();


        this.player = this.physics.add.sprite(2000, 3000, 'pistola_quiet').setScale(this.escala_personatge).refreshBody(); //Hauré de posar una imatge diferent perquè no afecti el braç a la hitbox per exemple
        this.player.body.setSize(220, 200);//canvio la mida per que les colisions siguin menys molestes a l'hora d'esquivar bales
        this.player.onCollide = true;
        this.player.setBounce(0);

        this.cameras.main.setZoom(0.75);
        this.cameras.main.startFollow(this.player);

        this.enemics = this.physics.add.group();
        if (!l_partida) {
            for (let i = 0; i < 40; i++) {
                this.spawnear_enemics();
            }
        }


        this.physics.add.collider(this.enemics, this.edificis, (enemic, edifici) => {
            let n = Phaser.Math.RND.integerInRange(0, 1);
            if (enemic.dir_general == "dreta" || enemic.dir_general == "esquerra") {
                if (n == 0) enemic.dir_general = "avall";
                else enemic.dir_general = "amunt";
            }
            else {
                if (n == 1) enemic.dir_general = "dreta";
                else enemic.dir_general = "esquerra";
            }
        });


        this.physics.add.collider(this.player, this.edificis, () => {
            this.player.setAcceleration(0, 0);
        });

        this.physics.add.collider(this.player, this.conos, () => {
            this.player.setAcceleration(0, 0);
        });

        this.physics.add.collider(this.player, this.cotxes, (jug, cotxe) => {
            this.player.setAcceleration(0, 0);
            this.tocant_cotxe(cotxe);
        });

        this.physics.add.collider(this.enemics, this.cotxes);

        this.physics.add.collider(this.player, this.enemics, () => {
            if (this.player.estat == "mortal") {
                this.player.vida--;
                this.player.estat = "inmortal";
                this.player.setTint(0x3b3a38, 0x3b3a38, 0x8a8988, 0x8a8988);
                var timedEvent = new Phaser.Time.TimerEvent({ delay: 1500, callback: this.tornar_mortal, callbackScope: this });
                this.time.addEvent(timedEvent);
                if (this.player.vida <= 0) {
                    this.acabar_partida();
                }
            }
        });

        this.physics.add.collider(this.player, this.cotxe_personal, (jug, cotxe) => {
            this.player.setAcceleration(0, 0);
            this.tocant_cotxe_pers(cotxe);
        });

        // Pre-calculate static bounds for faster spawn checks
        this.staticBounds = [];
        this.edificis.getChildren().forEach(e => this.staticBounds.push(e.getBounds()));
        this.cotxes.getChildren().forEach(c => this.staticBounds.push(c.getBounds()));

        this.bales_aliades = this.physics.add.group();
        this.bales_enemigues = this.physics.add.group();
        this.physics.add.overlap(this.bales_aliades, this.edificis, (bala, edifici) => {
            bala.destroy();
        });

        this.physics.add.overlap(this.bales_enemigues, this.edificis, (bala, edifici) => {
            bala.destroy();
        });

        this.physics.add.overlap(this.bales_aliades, this.cotxes, (bala, cotxe) => {
            bala.destroy();
        });

        this.physics.add.overlap(this.bales_enemigues, this.cotxes, (bala, cotxe) => {
            bala.destroy();
        });

        this.physics.add.overlap(this.enemics, this.bales_aliades, (enemic, bala) => {
            enemic.vida -= bala.dany;
            if (enemic.vida <= 0) {
                this.punts++;
                this.afegir_loot(enemic);
                this.n_enemics--;
                enemic.destroy();
            }
            else {
                enemic.setTint(0xfa0202);
                var timedEvent = new Phaser.Time.TimerEvent({ delay: 50, args: [enemic], callback: this.treure_tint, callbackScope: this });
                this.time.addEvent(timedEvent);
            }
            if (bala.tipus != "perforadora") bala.destroy();
        });

        this.physics.add.overlap(this.player, this.bales_enemigues, (jug, bala) => {
            if (this.player.estat == "mortal") {
                this.player.vida -= bala.dany;
                if (this.player.vida <= 0) {
                    this.acabar_partida();
                }
                else {
                    this.player.estat = "inmortal";
                    this.player.setTint(0xfa0202, 0xfa0202, 0x8a8988, 0x8a8988);
                    var timedEvent = new Phaser.Time.TimerEvent({ delay: 1500, callback: this.tornar_mortal, callbackScope: this });
                    this.time.addEvent(timedEvent);
                }
            }
            bala.destroy();

        });

        this.physics.add.overlap(this.player, this.loot, (jug, loot) => {
            if (this.cursors.E.isDown) this.recollir_loot(loot);
        });

        //atributs player
        this.player.accio = "quiet";
        this.player.estat = "mortal";
        this.player.vida = 6;
        this.player.omplint_benzina = false;
        this.player.ampolla_max = 0.5;
        this.player.ampolla = 0;
        this.player.temps_omplir = 0;
        this.player.temps_omplir_max = 120;
        this.player.velocitat = 350; //350 inicial 
        this.player.cooldown_disparar = false;
        this.player.cooldown_animacio = false;
        this.player.arma = this.pistola;
        this.player.dash = {
            cooldown: false,
            direccio: new Phaser.Math.Vector2(),
            temps_cooldown: 800,
            upgradeat: false,
            upgrade_temps_dasheant: 1000,
            upgrade_començat: false,
            upgrade_acabar: false
        };




        this.anims.create({
            key: 'caminar_ma',
            frames: this.anims.generateFrameNumbers('ma_caminar', { start: 0, end: 19 }),
            frameRate: 30,
            repeat: -1
        });

        this.anims.create({
            key: 'quiet_ma',
            frames: this.anims.generateFrameNumbers('ma_quiet', { start: 0, end: 19 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'atac_ma',
            frames: this.anims.generateFrameNumbers('ma_atac', { start: 0, end: 14 }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create({
            key: 'caminar_pistola',
            frames: this.anims.generateFrameNumbers('pistola_caminar', { start: 0, end: 19 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'quiet_pistola',
            frames: this.anims.generateFrameNumbers('pistola_quiet', { start: 0, end: 19 }),
            frameRate: 20,
            repeat: -1
        });
        this.anims.create({
            key: 'atac_pistola',
            frames: this.anims.generateFrameNumbers('pistola_atac', { start: 0, end: 2 }),
            frameRate: 20,
            repeat: 0
        });
        this.anims.create({
            key: 'cop_pistola',
            frames: this.anims.generateFrameNumbers('pistola_cop', { start: 0, end: 13 }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create({
            key: 'recarregar_pistola',
            frames: this.anims.generateFrameNumbers('pistola_recarregar', { start: 0, end: 13 }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create({
            key: 'caminar_escopeta',
            frames: this.anims.generateFrameNumbers('escopeta_caminar', { start: 0, end: 19 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'recarregar_escopeta',
            frames: this.anims.generateFrameNumbers('escopeta_recarregar', { start: 0, end: 19 }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create({
            key: 'quiet_escopeta',
            frames: this.anims.generateFrameNumbers('escopeta_quiet', { start: 0, end: 19 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'atac_escopeta',
            frames: this.anims.generateFrameNumbers('escopeta_atac', { start: 0, end: 2 }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create({
            key: 'caminar_rifle',
            frames: this.anims.generateFrameNumbers('rifle_caminar', { start: 0, end: 19 }),
            frameRate: 30,
            repeat: -1
        });
        this.anims.create({
            key: 'recarregar_rifle',
            frames: this.anims.generateFrameNumbers('rifle_recarregar', { start: 0, end: 19 }),
            frameRate: 30,
            repeat: 0
        });
        this.anims.create({
            key: 'quiet_rifle',
            frames: this.anims.generateFrameNumbers('rifle_caminar', { start: 0, end: 19 }),
            frameRate: 20,
            repeat: -1
        });
        this.player.anims.play('quiet_pistola');



        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.D = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D, true, true);
        this.cursors.A = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A, true, true);
        this.cursors.S = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S, true, true);
        this.cursors.W = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W, true, true);
        this.cursors.R = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R, true, true);
        this.cursors.E = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E, true, true);
        this.cursors.P = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.P, true, true);

        this.input.on('pointerdown', (pointer) => {
            if (this.estat == "jugant") {
                var top_left_x = this.cameras.main.midPoint.x - (1800 / 2); //relatius al mon
                var top_left_y = this.cameras.main.midPoint.y - (850 / 2);
                var pos_rel_mon_x = pointer.x + top_left_x;
                var pos_rel_mon_y = pointer.y + top_left_y;
                this.disparar(pos_rel_mon_x, pos_rel_mon_y);
            }


        }, this);



        // --- TIME TRACKING ---
        this.temps = 0;
        this.timer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                if (this.estat === "jugant") {
                    this.temps++;
                }
            },
            callbackScope: this,
            loop: true
        });

        // --- VISUAL HUD (Moved to UIScene) ---
        // Launch UI Scene
        // Launch UI Scene
        this.scene.launch('UIScene', { gameScene: this });
        this.scene.bringToTop('UIScene');










        if (l_partida) {
            this.nom = l_partida.nom;
            var obj_jug = JSON.parse(l_partida.player)
            var camps_jug = [
                'vida',
                'ampolla_max',
                'ampolla',
                'temps_omplir_max',
                'arma',
                'dash',
                'x',
                'y'
            ]
            for (var i in camps_jug) {
                let camp = camps_jug[i];
                this.player[camp] = obj_jug[camp];
            }
            if (this.player.arma.nom == "pistola") {
                this.player.arma.centre_cos = this.pistola.centre_cos;
                this.player.arma.pos_relativa = this.pistola.pos_relativa;
            }
            else if (this.player.arma.nom == "escopeta") {
                this.player.arma.centre_cos = this.escopeta.centre_cos;
                this.player.arma.pos_relativa = this.escopeta.pos_relativa;
            }
            else {
                this.player.arma.centre_cos = this.rifle.centre_cos;
                this.player.arma.pos_relativa = this.rifle.pos_relativa;
            }

            var cotxes = JSON.parse(l_partida.cotxes)
            var n = 0
            this.cotxes.children.iterate((child) => {
                child.benzina = cotxes[n].benzina;
                child.diposit = cotxes[n].diposit;
                n++;
            });
            this.cotxes_buits = l_partida.cotxes_buits;

            var camps_cotxe_pers = [
                'litres',
                'diposit'
            ]
            var obj_cotxe_pers = JSON.parse(l_partida.cotxe_personal)
            for (var i in camps_cotxe_pers) {
                let camp = camps_cotxe_pers[i];
                this.cotxe_personal[camp] = obj_cotxe_pers[camp];
            }


            this.temps = l_partida.temps;
            this.punts = l_partida.punts;

            this.n_enemics = l_partida.n_enemics;
            this.n_enemics_maxim = l_partida.n_enemics_maxim;
            var enemics = JSON.parse(l_partida.enemics)
            for (let i = 0; i < this.n_enemics; i++) {
                var tipus = enemics[i].tipus;
                var graphics;
                if (tipus == "melee") graphics = "enemic1";
                else if (tipus == "pistola") graphics = "enemic2";
                else if (tipus == "escopeta") graphics = "enemic3";
                else graphics = "enemic4";
                var enemic = this.enemics.create(enemics[i].x, enemics[i].y, graphics).setScale(this.escala_personatge).refreshBody();
                enemic.tipus = enemics[i].tipus;
                enemic.velocitat = enemics[i].velocitat;
                enemic.vida = enemics[i].vida;
                enemic.perseguir_rang = enemics[i].perseguir_rang;
                enemic.cadencia = enemics[i].cadencia;
                enemic.dispersio = enemics[i].dispersio;
                enemic.dany = enemics[i].dany;
                enemic.tipus_moviment = enemics[i].tipus_moviment;
                enemic.dir_general = enemics[i].dir_general;
                enemic.cooldown = false;
                if (enemic.dany == 1) enemic.setTint(0xfaf202);
                else enemic.setTint(0xa66b12);
                if (tipus == "pistola") {
                    enemic.pos_relativa = new Phaser.Math.Vector2(128, 76).scale(this.escala_personatge);
                    enemic.centre_cos = new Phaser.Math.Vector2(128, 108).scale(this.escala_personatge);
                }
                else if (tipus == "escopeta") {
                    enemic.pos_relativa = new Phaser.Math.Vector2(157, 45).scale(this.escala_personatge);
                    enemic.centre_cos = new Phaser.Math.Vector2(156, 103).scale(this.escala_personatge);
                }
                else {
                    enemic.pos_relativa = new Phaser.Math.Vector2(157, 45).scale(this.escala_personatge);
                    enemic.centre_cos = new Phaser.Math.Vector2(156, 103).scale(this.escala_personatge);
                }
            }


            this.dificultat = l_partida.dificultat;



            var loot = JSON.parse(l_partida.loot)
            for (var i in loot) {
                if (loot[i].tipus == "municio") {
                    var loot_act = this.loot.create(loot[i].x, loot[i].y, loot[i].tipus).setScale(this.escala_personatge * 0.1).refreshBody().setTint(0x888e94);
                    loot_act.tipus = loot[i].tipus;
                }
                else {
                    var loot_act = this.loot.create(loot[i].x, loot[i].y, loot[i].tipus).setScale(3).refreshBody().setTint(0x888e94);
                    loot_act.tipus = loot[i].tipus;
                }
            }

        }
    }



    // acabar_partida moved to be near menu_pausa for better organization

    treure_tint(enemic) {
        if (enemic) {
            if (enemic.dany == 1) enemic.setTint(0xfaf202);
            else enemic.setTint(0xa66b12);

        }
    }

    afegir_loot(enemic) {
        var n = Phaser.Math.RND.integerInRange(0, 100);
        if (n < 50) {
            if (enemic.body) {
                var loot = this.loot.create(enemic.body.position.x, enemic.body.position.y, "municio").setScale(this.escala_personatge * 0.1).refreshBody().setTint(0x888e94);
                loot.tipus = "municio";
                if (n < 15 && (enemic.tipus == "escopeta" || enemic.tipus == "rifle")) {
                    if (enemic.tipus == "escopeta") {
                        loot = this.loot.create(enemic.body.position.x + 30, enemic.body.position.y + 30, "escopeta").setScale(3).refreshBody().setTint(0x888e94);
                        loot.tipus = "escopeta";
                    }
                    else if (enemic.tipus == "rifle") {
                        loot = this.loot.create(enemic.body.position.x + 30, enemic.body.position.y + 30, "rifle").setScale(3).refreshBody().setTint(0x888e94);
                        loot.tipus = "rifle";
                    }
                    else {
                        loot = this.loot.create(enemic.body.position.x + 30, enemic.body.position.y + 30, "pistola").setScale(3).refreshBody().setTint(0x888e94);
                        loot.tipus = "pistola";
                    }
                }
            }

        }

    }

    recollir_loot(loot) {
        if (!loot || !loot.active) return;

        if (loot.tipus == "municio") {
            this.player.arma.municio += this.player.arma.mida_cartutxo * 2;
        }
        else if (loot.tipus == "pistola") {
            this.player.arma = this.pistola;
            this.player.arma.municio += this.player.arma.mida_cartutxo;
        }
        else if (loot.tipus == "escopeta") {
            this.player.arma = this.escopeta;
            this.player.arma.municio += this.player.arma.mida_cartutxo;
        }
        else if (loot.tipus == "rifle") {
            this.player.arma = this.rifle;
            this.player.arma.municio += this.player.arma.mida_cartutxo;
        }
        loot.destroy();
    }

    clearCarUI(car) {
        if (car.ui_group) {
            car.ui_group.destroy(true); // destroy children too
            car.ui_group = null;
        }
    }

    updateCarUI(car, isPersonal) {
        if (!car.ui_group) {
            car.ui_group = this.add.group();
        }

        // Position relative to car
        const x = car.body.position.x + car.body.width / 2;
        const y = car.body.position.y - 60; // Higher up

        // Clear previous frame elements
        car.ui_group.clear(true, true);

        // Styles
        const textStyle = { fontFamily: '"Share Tech Mono", monospace', fontSize: '35px', fill: '#ffffff', stroke: '#000000', strokeThickness: 4 };
        const hintStyle = { fontFamily: '"Share Tech Mono", monospace', fontSize: '28px', fill: '#eb631b', stroke: '#000000', strokeThickness: 4 };

        // 1. Interaction Progress (Sampling/Refueling)
        if (this.player.omplint_benzina) {
            // Progress Bar
            const barW = 200;
            const barH = 25;
            const progress = this.player.temps_omplir / this.player.temps_omplir_max;

            // Text: Action Name
            const actionText = isPersonal ? "REFUELING..." : "SIPHONING...";
            const txt = this.add.text(x, y - 35, actionText, hintStyle).setOrigin(0.5).setDepth(200);
            car.ui_group.add(txt);

            // Bar Background
            const bg = this.add.rectangle(x, y, barW + 6, barH + 6, 0x000000).setStrokeStyle(2, 0xffffff).setDepth(200);
            car.ui_group.add(bg);

            // Bar Fill
            const color = isPersonal ? 0x00ff00 : 0xeb631b;
            const fill = this.add.rectangle(x - barW / 2, y, barW * progress, barH, color).setOrigin(0, 0.5).setDepth(200);
            car.ui_group.add(fill);

        } else {
            // 2. Idle State - Show Info & Hint
            let infoText = "";
            let hintText = "";
            let infoColor = '#ffffff';

            if (isPersonal) {
                infoText = `${car.litres}/${car.diposit} L`;
                if (this.player.ampolla > 0 && car.litres < car.diposit) {
                    hintText = "[E] REFUEL";
                }
            } else {
                infoText = `${car.benzina} L`;
                if (car.benzina > 0 && this.player.ampolla < this.player.ampolla_max) {
                    hintText = "[E] SIPHON";
                } else if (car.benzina <= 0) {
                    infoText = "EMPTY";
                    infoColor = '#888888';
                } else if (this.player.ampolla >= this.player.ampolla_max) {
                    hintText = "FULL BOTTLE";
                    hintStyle.fill = '#ff0000';
                }
            }

            textStyle.fill = infoColor;
            const txtInfo = this.add.text(x, y - 15, infoText, textStyle).setOrigin(0.5).setDepth(200);
            car.ui_group.add(txtInfo);

            if (hintText) {
                const txtHint = this.add.text(x, y + 25, hintText, hintStyle).setOrigin(0.5).setDepth(200);
                car.ui_group.add(txtHint);
            }
        }
    }

    tocant_cotxe_pers(cotxe) {
        this.cotxe_actual = cotxe;
        this.colisio_cotxe = true;

        // Interaction Logic
        if (this.player.ampolla > 0 && cotxe.diposit > cotxe.litres && this.player.accio != "recarregar" && this.player.accio != "dash") {
            if (this.cursors.E.isDown) {
                this.player.omplint_benzina = true;
            }
            else {
                this.player.omplint_benzina = false;
                this.player.temps_omplir = 0;
            }
            if (this.player.omplint_benzina) {
                this.player.temps_omplir += 1;

                if (this.player.temps_omplir >= this.player.temps_omplir_max) {
                    this.player.omplint_benzina = false;
                    this.player.temps_omplir = 0;
                    if ((cotxe.diposit - cotxe.litres) >= this.player.ampolla) {
                        cotxe.litres += this.player.ampolla;
                        this.player.ampolla = 0;
                    }
                    else {
                        this.player.ampolla = cotxe.diposit - cotxe.litres;
                        cotxe.litres += cotxe.diposit;
                    }
                }
            }
        }

        // Update UI
        this.updateCarUI(cotxe, true);
    }

    omplir_cotxes() {
        this.cotxes.children.iterate((child) => {
            var n = Phaser.Math.RND.integerInRange(1, child.diposit);
            child.benzina = n;
            child.text_afegit = false;
        });
    }

    tocant_cotxe(cotxe) {
        this.cotxe_actual = cotxe;
        this.colisio_cotxe = true;

        // Interaction Logic
        if (cotxe.benzina > 0 && this.player.ampolla < this.player.ampolla_max && this.player.accio != "recarregar" && this.player.accio != "dash") {
            if (this.cursors.E.isDown) {
                this.player.omplint_benzina = true;
            }
            else {
                this.player.omplint_benzina = false;
                this.player.temps_omplir = 0;
            }
            if (this.player.omplint_benzina) {
                this.player.temps_omplir += 1;

                if (this.player.temps_omplir >= this.player.temps_omplir_max) {
                    this.player.omplint_benzina = false;
                    this.player.temps_omplir = 0;
                    if (cotxe.benzina >= (this.player.ampolla_max - this.player.ampolla)) {
                        cotxe.benzina = cotxe.benzina - (this.player.ampolla_max - this.player.ampolla);
                        this.player.ampolla = this.player.ampolla_max;
                        if (cotxe.benzina == 0) this.cotxes_buits++;
                    }
                    else {
                        this.player.ampolla = this.player.ampolla + cotxe.benzina;
                        cotxe.benzina = 0;
                        this.cotxes_buits++;
                    }
                    if (this.cotxes_buits == this.ncotxes) this.omplir_cotxes();
                }
            }
        }

        // Update UI
        this.updateCarUI(cotxe, false);
    }

    tornar_mortal() {
        this.player.clearTint();
        this.player.estat = "mortal";
    }

    disparar(posx, posy) {
        if (!this.player.cooldown_disparar && this.player.accio != "dash") {
            this.player.cooldown_disparar = true;
            this.player.cooldown_animacio = true;
            this.player.accio = "atacar";
            var posicio = new Phaser.Math.Vector2(posx, posy);
            var direccio = new Phaser.Math.Vector2();
            var centre_cos = this.player.arma.centre_cos.clone();
            centre_cos.add(this.player.body.position);
            direccio = posicio.subtract(centre_cos);
            direccio.normalize();
            var angle = direccio.angle();
            angle = angle / Math.PI * 180;
            if (this.player.arma.nom == "ganivet" || (this.player.arma.bales == 0 && this.player.arma.municio == 0)) {//si s'ha de fer atac cos
                this.player.angle = angle;
                this.atac_cos(direccio);
            }
            else {
                if (this.player.arma.bales == 0) {
                    this.player.accio = "recarregar";
                    this.recarregar();
                }
                else {
                    this.player.angle = angle;
                    var pos_pistola = this.player.arma.pos_relativa.clone();
                    pos_pistola.rotate((this.player.angle / 180) * Math.PI);
                    pos_pistola = pos_pistola.add(centre_cos);
                    posicio = new Phaser.Math.Vector2(posx, posy);
                    direccio = posicio.subtract(pos_pistola);
                    this.atac_distancia(direccio, pos_pistola);
                }
            }
        }
    }

    recarregar() {
        if (this.player.arma.nom == "pistola") {
            this.player.anims.play('recarregar_pistola');
        }
        else if (this.player.arma.nom == "escopeta") {
            this.player.anims.play('recarregar_escopeta');
        }
        else {
            this.player.anims.play('recarregar_rifle');
        }
        this.player.anims.msPerFrame = this.player.arma.velocitat_recarrega / 12;
        var timedEvent = new Phaser.Time.TimerEvent({ delay: this.player.arma.velocitat_recarrega, callback: this.cooldown_animacio_reset, callbackScope: this });
        var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.player.arma.velocitat_recarrega, callback: this.cooldown_disparar_reset, callbackScope: this });
        this.time.addEvent(timedEvent);
        this.time.addEvent(timedEvent2);
        if (this.player.arma.municio >= this.player.arma.mida_cartutxo) {
            if (this.player.arma.bales > 0) {
                this.player.arma.municio = this.player.arma.municio - (this.player.arma.mida_cartutxo - this.player.arma.bales);
                this.player.arma.bales = this.player.arma.mida_cartutxo;
            }
            else {
                this.player.arma.municio -= this.player.arma.mida_cartutxo;
                this.player.arma.bales += this.player.arma.mida_cartutxo;
            }
        }
        else {
            if (this.player.arma.bales + this.player.arma.municio >= this.player.arma.mida_cartutxo) {
                this.player.arma.municio -= this.player.arma.mida_cartutxo - this.player.arma.bales;
                this.player.arma.bales = this.player.arma.mida_cartutxo;
            }
            else {
                this.player.arma.bales += this.player.arma.municio;
                this.player.arma.municio = 0;
            }
        }

    }

    cooldown_animacio_reset() {
        this.player.cooldown_animacio = false;
    }
    cooldown_disparar_reset() {
        this.player.cooldown_disparar = false;
    }

    atac_cos(dir) {
        if (this.player.arma.nom == "ganivet") {
            this.player.anims.play('atac_ma');
            var timedEvent = new Phaser.Time.TimerEvent({ delay: this.player.arma.min_cadencia, callback: this.cooldown_animacio_reset, callbackScope: this });
            var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.player.arma.cadencia, callback: this.cooldown_disparar_reset, callbackScope: this });
            this.time.addEvent(timedEvent);
            this.time.addEvent(timedEvent2);
        }
        if (this.player.arma.nom == "pistola") {
            this.player.anims.play('cop_pistola');
            var timedEvent = new Phaser.Time.TimerEvent({ delay: this.ganivet.min_cadencia, callback: this.cooldown_animacio_reset, callbackScope: this });
            var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.ganivet.cadencia, callback: this.cooldown_disparar_reset, callbackScope: this });
            this.time.addEvent(timedEvent);
            this.time.addEvent(timedEvent2);
        }

    }

    afegir_bala(pos_inicial, dir, vel, rang, bando, tipus, dany, imatge) {
        var angle = dir.angle();
        if (bando == "aliada") var bala = this.bales_aliades.create(pos_inicial.x, pos_inicial.y, imatge).setScale(this.escala_personatge * 1.9).setRotation(angle).refreshBody();
        else var bala = this.bales_enemigues.create(pos_inicial.x, pos_inicial.y, imatge).setScale(this.escala_personatge * 1.9).setRotation(angle).refreshBody();
        bala.setVelocity(dir.x * vel, dir.y * vel);
        bala.tipus = tipus;
        bala.pos_inicial = pos_inicial;
        bala.rang = rang;
        bala.dany = dany;
    }

    atac_distancia(dir, pos) {
        if (this.player.arma.nom == "pistola") {
            this.player.arma.bales--;
            this.player.anims.play('atac_pistola');
            var timedEvent = new Phaser.Time.TimerEvent({ delay: this.player.arma.cadencia, callback: this.cooldown_animacio_reset, callbackScope: this });
            var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.player.arma.cadencia, callback: this.cooldown_disparar_reset, callbackScope: this });
            this.time.addEvent(timedEvent);
            this.time.addEvent(timedEvent2);
            var angle = Phaser.Math.RND.frac() * this.player.arma.dispersio;
            var negatiu = Phaser.Math.RND.between(0, 1);
            var direccio_final = dir.clone();
            if (negatiu == 0) direccio_final.rotate((-angle / 180) * Math.PI);
            else direccio_final.rotate((angle / 180) * Math.PI);
            direccio_final.normalize();
            this.afegir_bala(pos, direccio_final, this.player.arma.vel_bala, this.player.arma.rang, "aliada", "normal", this.player.arma.dany, "bala_aliada_pistola");
        }
        else if (this.player.arma.nom == "escopeta") {
            this.player.arma.bales--;
            this.player.anims.play('atac_escopeta');
            var timedEvent = new Phaser.Time.TimerEvent({ delay: this.player.arma.min_cadencia, callback: this.cooldown_animacio_reset, callbackScope: this });
            var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.player.arma.cadencia, callback: this.cooldown_disparar_reset, callbackScope: this });
            this.time.addEvent(timedEvent);
            this.time.addEvent(timedEvent2);
            for (let i = 0; i < 8; i++) {
                var angle = Phaser.Math.RND.frac() * this.player.arma.dispersio;
                var negatiu = Phaser.Math.RND.between(0, 1);
                var direccio_final = dir.clone();
                if (negatiu == 0) direccio_final.rotate((-angle / 180) * Math.PI);
                else direccio_final.rotate((angle / 180) * Math.PI);
                direccio_final.normalize();
                let vel = Phaser.Math.RND.integerInRange(700, this.player.arma.vel_bala);
                this.afegir_bala(pos, direccio_final, vel, this.player.arma.rang, "aliada", "normal", this.player.arma.dany, "bala_aliada_pistola");
            }
        }
        else {
            this.player.arma.bales--;
            var timedEvent = new Phaser.Time.TimerEvent({ delay: this.player.arma.min_cadencia, callback: this.cooldown_animacio_reset, callbackScope: this });
            var timedEvent2 = new Phaser.Time.TimerEvent({ delay: this.player.arma.cadencia, callback: this.cooldown_disparar_reset, callbackScope: this });
            this.time.addEvent(timedEvent);
            this.time.addEvent(timedEvent2);
            var angle = Phaser.Math.RND.frac() * this.player.arma.dispersio;
            var negatiu = Phaser.Math.RND.between(0, 1);
            var direccio_final = dir.clone();
            if (negatiu == 0) direccio_final.rotate((-angle / 180) * Math.PI);
            else direccio_final.rotate((angle / 180) * Math.PI);
            direccio_final.normalize();
            this.afegir_bala(pos, direccio_final, this.player.arma.vel_bala, this.player.arma.rang, "aliada", "perforadora", this.player.arma.dany, "bala_aliada_rifle");
        }
    }

    dash_cooldown() {
        this.player.dash.cooldown = false;
    }

    dash_acabar_upgrade() {
        if (this.player.dash.upgrade_començat) {
            this.player.dash.upgrade_acabar = true;
        }
    }

    dash_acabar() {
        this.player.setAcceleration(0, 0);
        this.player.setVelocity(0, 0);
        this.player.clearTint();
        if (this.player.cooldown_animacio) this.player.accio = "recarregar";
        else this.player.accio = "quiet";
        this.player.estat = "mortal";
        var timedEvent = new Phaser.Time.TimerEvent({ delay: this.player.dash.temps_cooldown, callback: this.dash_cooldown, callbackScope: this });
        this.time.addEvent(timedEvent);
    }

    dash_etapa2() {
        if (!this.player.dash.upgradeat) {
            if (this.player.body.velocity.length() != 0) this.player.setAcceleration(-this.player.dash.direccio.x * 2, -this.player.dash.direccio.y * 2);
            var timedEvent = new Phaser.Time.TimerEvent({ delay: 300, callback: this.dash_acabar, callbackScope: this });
            this.time.addEvent(timedEvent);
        }
        else {
            if (this.cursors.space.isUp || this.player.dash.upgrade_acabar) {
                this.player.dash.cooldown = true;
                if (this.player.body.velocity.length() != 0) this.player.setAcceleration(-this.player.dash.direccio.x * 2, -this.player.dash.direccio.y * 2);
                var timedEvent = new Phaser.Time.TimerEvent({ delay: 300, callback: this.dash_acabar, callbackScope: this });
                this.time.addEvent(timedEvent);
                this.player.dash.upgrade_començat = false;
                this.player.dash.upgrade_acabar = false;
            }
            else {
                this.player.accio = "quiet";
                this.player.estat = "mortal";
            }
        }

    }



    isValidSpawn(x, y) {
        // 1. Distance from Player - Avoid spawning too close
        if (!this.player) return false;
        const dist = Phaser.Math.Distance.Between(x, y, this.player.x, this.player.y);
        if (dist < 700) return false;

        // 2. Camera Check - Use worldView to check visibility
        const cam = this.cameras.main;
        if (x >= cam.worldView.x && x <= cam.worldView.right &&
            y >= cam.worldView.y && y <= cam.worldView.bottom) {
            return false;
        }

        // 3. Static Bounds Check (Buildings + Cars) - Use pre-calculated rects
        const collision = this.staticBounds.some(rect => rect.contains(x, y));
        if (collision) return false;

        return true;
    }

    spawnear_enemics() {

        if (this.n_enemics < this.n_enemics_maxim) {
            var n = Phaser.Math.RND.integerInRange(0, 300);
            if (n < (this.dificultat * 2)) {
                let punt = null;
                let valid = false;
                const maxAttempts = 15;

                for (let attempt = 0; attempt < maxAttempts; attempt++) {
                    n = Phaser.Math.RND.integerInRange(0, 7);
                    if (n > 5) n = 5;
                    else if (n == 5) n = 4;

                    let zona = this.zones_spawn[n];
                    let tempPunt = zona.getRandomPoint();

                    if (this.isValidSpawn(tempPunt.x, tempPunt.y)) {
                        punt = tempPunt;
                        valid = true;
                        break;
                    }
                }

                if (!valid) return; // Skip spawning this frame if no valid spot found

                n = Phaser.Math.RND.integerInRange(0, 3);
                var graphics;
                if (n == 0) graphics = "enemic1";
                else if (n == 1) graphics = "enemic2";
                else if (n == 2) graphics = "enemic3";
                else graphics = "enemic4";
                var enemic = this.enemics.create(punt.x, punt.y, graphics).setScale(this.escala_personatge).refreshBody();
                var dificultat_enemic = Phaser.Math.RND.integerInRange(1, this.dificultat);
                if (graphics == "enemic1") {
                    enemic.tipus = "melee";
                    enemic.velocitat = 200 + (20 * dificultat_enemic);
                    enemic.vida = dificultat_enemic;
                    enemic.perseguir_rang = 300;
                    enemic.cadencia = 400 - dificultat_enemic * 15;
                }
                else if (graphics == "enemic2") {
                    enemic.tipus = "pistola";
                    enemic.velocitat = 100 + (20 * dificultat_enemic);
                    enemic.vida = 1 + dificultat_enemic;
                    enemic.perseguir_rang = 600;
                    enemic.pos_relativa = new Phaser.Math.Vector2(128, 76).scale(this.escala_personatge);
                    enemic.centre_cos = new Phaser.Math.Vector2(128, 108).scale(this.escala_personatge);
                    enemic.cadencia = 500 - dificultat_enemic * 35;
                    enemic.dispersio = 8;
                }
                else if (graphics == "enemic3") {
                    enemic.tipus = "escopeta";
                    enemic.velocitat = 150 + (20 * dificultat_enemic);
                    enemic.vida = 2 + dificultat_enemic;
                    enemic.perseguir_rang = 450;
                    enemic.setSize(250, 200);
                    enemic.pos_relativa = new Phaser.Math.Vector2(157, 45).scale(this.escala_personatge);
                    enemic.centre_cos = new Phaser.Math.Vector2(156, 103).scale(this.escala_personatge);
                    enemic.cadencia = 1800 - dificultat_enemic * 70;
                    enemic.dispersio = 30;
                }
                else {
                    enemic.tipus = "rifle";
                    enemic.velocitat = 50 + (20 * dificultat_enemic);
                    enemic.vida = 2 + dificultat_enemic;
                    enemic.setSize(250, 200);
                    enemic.perseguir_rang = 800;
                    enemic.pos_relativa = new Phaser.Math.Vector2(157, 45).scale(this.escala_personatge);
                    enemic.centre_cos = new Phaser.Math.Vector2(156, 103).scale(this.escala_personatge);
                    enemic.cadencia = 2000 - dificultat_enemic * 35;
                    enemic.dispersio = 0;
                }
                if (dificultat_enemic < 6) {
                    enemic.dany = 1;
                    enemic.setTint(0xfaf202);
                }
                else {
                    enemic.dany = 2;
                    enemic.setTint(0xa66b12);
                }
                enemic.cooldown = false;
                enemic.tipus_moviment = "deambular";
                n = Phaser.Math.RND.integerInRange(0, 3);
                if (n == 0) {
                    enemic.dir_general = "dreta";
                    this.canviar_angle(enemic);
                }
                else if (n == 1) {
                    enemic.dir_general = "esquerra";
                    this.canviar_angle(enemic);
                }
                else if (n == 2) {
                    enemic.dir_general = "avall";
                    this.canviar_angle(enemic);
                }
                else {
                    enemic.dir_general = "amunt";
                    this.canviar_angle(enemic);
                }
                this.n_enemics++;
            }
        }
    }

    canviar_angle(enemic) {
        if (!enemic || !enemic.active) return;

        // STOP existing timer to prevent exponential growth!
        if (enemic.event_angle) {
            enemic.event_angle.remove();
        }

        if (enemic.tipus_moviment == "deambular") {
            var direccio;
            if (enemic.dir_general == "dreta") direccio = new Phaser.Math.Vector2(1, 0);
            else if (enemic.dir_general == "esquerra") direccio = new Phaser.Math.Vector2(-1, 0);
            else if (enemic.dir_general == "avall") direccio = new Phaser.Math.Vector2(0, -1);
            else direccio = new Phaser.Math.Vector2(0, 1);

            let angle = Phaser.Math.RND.frac() * 45;
            var negatiu = Phaser.Math.RND.between(0, 1);
            if (negatiu == 0) direccio.rotate((-angle / 180) * Math.PI);
            else direccio.rotate((angle / 180) * Math.PI);
            direccio.normalize();

            enemic.direccio = direccio;
            var rotacio = direccio.angle();
            enemic.setRotation(rotacio);
            enemic.setVelocity(enemic.direccio.x * enemic.velocitat, enemic.direccio.y * enemic.velocitat);

            // Create next timer
            enemic.event_angle = this.time.addEvent({
                delay: 2000,
                callback: this.canviar_angle,
                args: [enemic],
                callbackScope: this
            });
        }
    }

    cooldown_enemic_reset(enemic) {
        enemic.cooldown = false;
    }

    disparar_enemic(enemic) {
        var pos_pistola = enemic.pos_relativa.clone();
        var centre_cos = enemic.centre_cos.clone();
        centre_cos.add(enemic.body.position);
        pos_pistola.rotate((enemic.angle / 180) * Math.PI);
        pos_pistola = pos_pistola.add(centre_cos);
        var posicio = new Phaser.Math.Vector2(this.player.body.position.x, this.player.body.position.y);
        var direccio = posicio.subtract(pos_pistola);
        if (enemic.tipus == "pistola") {
            var angle = Phaser.Math.RND.frac() * enemic.dispersio;
            var negatiu = Phaser.Math.RND.between(0, 1);
            var direccio_final = direccio.clone();
            if (negatiu == 0) direccio_final.rotate((-angle / 180) * Math.PI);
            else direccio_final.rotate((angle / 180) * Math.PI);
            direccio_final.normalize();
            enemic.cooldown = true;
            var timedEvent = new Phaser.Time.TimerEvent({ delay: enemic.cadencia, args: [enemic], callback: this.cooldown_enemic_reset, callbackScope: this });
            this.time.addEvent(timedEvent);
            this.afegir_bala(pos_pistola, direccio_final, 400, 1000, "enemiga", "normal", enemic.dany, "bala_enemiga_pistola");
        }
        else if (enemic.tipus == "escopeta") {
            enemic.cooldown = true;
            var timedEvent = new Phaser.Time.TimerEvent({ delay: enemic.cadencia, args: [enemic], callback: this.cooldown_enemic_reset, callbackScope: this });
            this.time.addEvent(timedEvent);
            for (let i = 0; i < 8; i++) {
                var angle = Phaser.Math.RND.frac() * enemic.dispersio;
                var negatiu = Phaser.Math.RND.between(0, 1);
                var direccio_final = direccio.clone();
                if (negatiu == 0) direccio_final.rotate((-angle / 180) * Math.PI);
                else direccio_final.rotate((angle / 180) * Math.PI);
                direccio_final.normalize();
                let vel = Phaser.Math.RND.integerInRange(400, 600);
                this.afegir_bala(pos_pistola, direccio_final, vel, 1000, "enemiga", "normal", enemic.dany, "bala_enemiga_pistola");
            }

        }
        else {
            var angle = Phaser.Math.RND.frac() * enemic.dispersio;
            var negatiu = Phaser.Math.RND.between(0, 1);
            var direccio_final = direccio.clone();
            if (negatiu == 0) direccio_final.rotate((-angle / 180) * Math.PI);
            else direccio_final.rotate((angle / 180) * Math.PI);
            direccio_final.normalize();
            enemic.cooldown = true;
            var timedEvent = new Phaser.Time.TimerEvent({ delay: enemic.cadencia, args: [enemic], callback: this.cooldown_enemic_reset, callbackScope: this });
            this.time.addEvent(timedEvent);
            this.afegir_bala(pos_pistola, direccio_final, 1000, 1500, "enemiga", "normal", enemic.dany, "bala_enemiga_rifle");
        }
    }

    tractar_enemics() {
        this.enemics.children.iterate((child) => {


            var distancia = child.body.position.distance(this.player.body.position);
            if (child.tipus_moviment == "deambular") {
                if (distancia < 700) child.tipus_moviment = "perseguir";
            }
            else if (child.tipus_moviment == "perseguir") {
                if (distancia > 1000) child.tipus_moviment = "deambular";
                else if (distancia < child.perseguir_rang) child.tipus_moviment = "atacar";
                else {
                    var pos_jug = this.player.body.position.clone();
                    var direccio = pos_jug.subtract(child.body.position);
                    direccio.normalize();
                    var rotacio = direccio.angle();
                    child.setRotation(rotacio);
                    child.setVelocity(direccio.x * child.velocitat, direccio.y * child.velocitat);
                }
            }
            else {
                if (distancia > child.perseguir_rang) child.tipus_moviment = "perseguir";
                else {
                    if (child.tipus == "melee") {
                        var pos_jug = this.player.body.position.clone();
                        var direccio = pos_jug.subtract(child.body.position);
                        direccio.normalize();
                        var rotacio = direccio.angle();
                        child.setRotation(rotacio);
                        child.setVelocity(direccio.x * child.velocitat * 2, direccio.y * child.velocitat * 2);
                    }
                    else {
                        if (!child.cooldown) {
                            this.disparar_enemic(child);
                        }
                        var pos_jug = this.player.body.position.clone();
                        var direccio = pos_jug.subtract(child.body.position);
                        direccio.normalize();
                        var rotacio = direccio.angle();
                        child.setRotation(rotacio);
                        child.setVelocity(direccio.x * child.velocitat * 0.7, direccio.y * child.velocitat * 0.7);
                    }
                }
            }

        });
    }

    save() {
        var camps_jug = [
            'vida',
            'ampolla_max',
            'ampolla',
            'temps_omplir_max',
            'arma',
            'dash',
            'x',
            'y'
        ];
        var obj_jug = {};
        for (var i in camps_jug) {
            let camp_jug = camps_jug[i];
            obj_jug[camp_jug] = this.player[camp_jug];
        }

        var camps_cotxe_pers = [
            'litres',
            'diposit'
        ];
        var obj_cotxe_pers = {};
        for (var i in camps_cotxe_pers) {
            let camp_cotxe_pers = camps_cotxe_pers[i];
            obj_cotxe_pers[camp_cotxe_pers] = this.cotxe_personal[camp_cotxe_pers];
        }
        var cotxes = [];
        this.cotxes.children.iterate((child) => {
            let cotxe = {
                benzina: child.benzina,
                diposit: child.diposit
            };
            cotxes.push(cotxe);

        });


        var enemics = [];
        this.enemics.children.iterate((child) => {
            let enemic = {
                x: child.x,
                y: child.y,
                tipus: child.tipus,
                velocitat: child.velocitat,
                vida: child.vida,
                perseguir_rang: child.perseguir_rang,
                cadencia: child.cadencia,
                dispersio: child.dispersio,
                dany: child.dany,
                tipus_moviment: child.tipus_moviment,
                dir_general: child.dir_general
            };
            enemics.push(enemic);

        });








        var loots = [];
        this.loot.children.iterate((child) => {
            let loot = {
                x: child.x,
                y: child.y,
                tipus: child.tipus
            };
            loots.push(loot);

        });

        let partida = {

            nom: this.nom,
            player: JSON.stringify(obj_jug),
            cotxes: JSON.stringify(cotxes),
            cotxes_buits: this.cotxes_buits,
            cotxe_personal: JSON.stringify(obj_cotxe_pers),


            temps: this.temps,
            punts: this.punts,

            enemics: JSON.stringify(enemics),
            n_enemics: this.n_enemics,
            n_enemics_maxim: this.n_enemics_maxim,
            dificultat: this.dificultat,

            loot: JSON.stringify(loots),
        }
        let arrayPartides = [];
        if (localStorage.partides) {
            arrayPartides = JSON.parse(localStorage.partides);
            if (!Array.isArray(arrayPartides)) arrayPartides = [];
        }
        arrayPartides.push(partida);
        localStorage.partides = JSON.stringify(arrayPartides);
    }

    acabar_partida() {
        this.estat = "pause";
        this.physics.pause();
        this.scene.get('UIScene').showGameOverMenu(this.cotxe_personal.litres);
    }

    menu_pausa() {
        this.scene.get('UIScene').showPauseMenu();
    }



    update() {

        this.spawnear_enemics();

        if (this.cursors.P.isDown && this.estat == "jugant") {
            this.estat = "pause";
            this.physics.pause();
            this.menu_pausa();
        }
        if (this.estat == "jugant") {



            this.tractar_enemics();

            if (!this.colisio_cotxe) {
                if (this.cotxe_actual) {
                    this.clearCarUI(this.cotxe_actual);
                }
                if (this.player.omplint_benzina) this.player.omplint_benzina = false;
            }
            this.colisio_cotxe = false;
            //tractament inputs
            //dash
            if (this.cursors.space.isDown && this.player.accio != "dash" && !this.player.dash.cooldown) {
                this.player.accio = "dash";
                this.player.estat = "inmortal";
                if (!this.player.dash.upgradeat) {
                    this.player.setTint(0x3b3a38, 0x3b3a38, 0x8a8988, 0x8a8988);
                    this.player.dash.cooldown = true; //si no està upgradeat, vull que només fagi dash un cop
                }
                else {
                    if (!this.player.dash.upgrade_començat) {
                        this.player.setTint(0x3b3a38, 0x3b3a38, 0x8a8988, 0x8a8988);
                        this.player.dash.upgrade_començat = true;
                        let timedEvent3 = new Phaser.Time.TimerEvent({ delay: this.player.dash.upgrade_temps_dasheant, callback: this.dash_acabar_upgrade, callbackScope: this });
                        this.time.addEvent(timedEvent3);
                    }
                }
                if (this.cursors.D.isDown) {
                    if (this.cursors.S.isDown) {
                        this.player.dash.direccio = new Phaser.Math.Vector2(Math.sqrt(Math.pow(this.player.velocitat * 4, 2) / 2), Math.sqrt(Math.pow(this.player.velocitat * 4, 2) / 2));
                    }
                    else if (this.cursors.W.isDown) {
                        this.player.dash.direccio = new Phaser.Math.Vector2(Math.sqrt(Math.pow(this.player.velocitat * 4, 2) / 2), -Math.sqrt(Math.pow(this.player.velocitat * 4, 2) / 2));
                    }
                    else {
                        this.player.dash.direccio = new Phaser.Math.Vector2(this.player.velocitat * 4, 0);
                    }
                }
                else if (this.cursors.A.isDown) {
                    if (this.cursors.S.isDown) {
                        this.player.dash.direccio = new Phaser.Math.Vector2(-Math.sqrt(Math.pow(this.player.velocitat * 4, 2) / 2), Math.sqrt(Math.pow(this.player.velocitat * 4, 2) / 2));
                    }
                    else if (this.cursors.W.isDown) {
                        this.player.dash.direccio = new Phaser.Math.Vector2(-Math.sqrt(Math.pow(this.player.velocitat * 4, 2) / 2), -Math.sqrt(Math.pow(this.player.velocitat * 4, 2) / 2));
                    }
                    else {
                        this.player.dash.direccio = new Phaser.Math.Vector2(-this.player.velocitat * 4, 0);
                    }
                }
                else if (this.cursors.S.isDown) {
                    this.player.dash.direccio = new Phaser.Math.Vector2(0, this.player.velocitat * 4);
                }
                else {
                    this.player.dash.direccio = new Phaser.Math.Vector2(0, -this.player.velocitat * 4);
                }
                this.player.setVelocity(this.player.dash.direccio.x, this.player.dash.direccio.y);
                var timedEvent = new Phaser.Time.TimerEvent({ delay: 75, callback: this.dash_etapa2, callbackScope: this });
                this.time.addEvent(timedEvent);
            }




            else if (this.player.accio != "dash") {
                //recarrega
                if (this.cursors.R.isDown && this.player.accio != "recarregar" && !this.player.cooldown_animacio) {
                    if (this.player.arma.bales < this.player.arma.mida_cartutxo && this.player.arma.municio > 0) {
                        this.player.cooldown_disparar = true;
                        this.player.cooldown_animacio = true;
                        this.player.accio = "recarregar";
                        this.recarregar();
                    }
                }



                //moures
                if (this.cursors.D.isDown) {
                    if (this.player.accio == "quiet" || (this.player.accio == "atacar" && this.player.cooldown_animacio == false)) {
                        if (this.player.arma.nom == "ganivet") this.player.anims.play('caminar_ma');
                        else if (this.player.arma.nom == "pistola") this.player.anims.play('caminar_pistola');
                        else if (this.player.arma.nom == "escopeta") this.player.anims.play('caminar_escopeta');
                        else this.player.anims.play('caminar_rifle');
                        this.player.accio = "dreta";
                    }
                    if (this.cursors.S.isDown) {
                        if (!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio == "recarregar")) this.player.angle = 45;
                        this.player.setVelocityX(Math.sqrt(Math.pow(this.player.velocitat, 2) / 2)); //perque el modul de la velocitat sigui el que ha de ser ja que sino aniria mes ràpid en diagonal
                        this.player.setVelocityY(Math.sqrt(Math.pow(this.player.velocitat, 2) / 2));
                    }
                    else if (this.cursors.W.isDown) {
                        if (!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio == "recarregar")) this.player.angle = -45;
                        this.player.setVelocityX(Math.sqrt(Math.pow(this.player.velocitat, 2) / 2));
                        this.player.setVelocityY(-Math.sqrt(Math.pow(this.player.velocitat, 2) / 2));
                    }
                    else {
                        if (!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio == "recarregar")) this.player.angle = 0;
                        this.player.setVelocityX(this.player.velocitat);
                        this.player.setVelocityY(0);
                    }
                }
                else if (this.cursors.A.isDown) {
                    if (this.player.accio == "quiet" || (this.player.accio == "atacar" && this.player.cooldown_animacio == false)) {
                        if (this.player.arma.nom == "ganivet") this.player.anims.play('caminar_ma');
                        else if (this.player.arma.nom == "pistola") this.player.anims.play('caminar_pistola');
                        else if (this.player.arma.nom == "escopeta") this.player.anims.play('caminar_escopeta');
                        else this.player.anims.play('caminar_rifle');
                        this.player.accio = "esquerra";
                    }
                    if (this.cursors.S.isDown) {
                        if (!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio == "recarregar")) this.player.angle = 135;
                        this.player.setVelocityX(-Math.sqrt(Math.pow(this.player.velocitat, 2) / 2));
                        this.player.setVelocityY(Math.sqrt(Math.pow(this.player.velocitat, 2) / 2));
                    }
                    else if (this.cursors.W.isDown) {
                        if (!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio == "recarregar")) this.player.angle = 225;
                        this.player.setVelocityX(-Math.sqrt(Math.pow(this.player.velocitat, 2) / 2));
                        this.player.setVelocityY(-Math.sqrt(Math.pow(this.player.velocitat, 2) / 2));
                    }
                    else {
                        if (!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio == "recarregar")) this.player.angle = 180;
                        this.player.setVelocityX(-this.player.velocitat);
                        this.player.setVelocityY(0);
                    }
                }
                else if (this.cursors.S.isDown) {
                    if (this.player.accio == "quiet" || (this.player.accio == "atacar" && this.player.cooldown_animacio == false)) {
                        if (this.player.arma.nom == "ganivet") this.player.anims.play('caminar_ma');
                        else if (this.player.arma.nom == "pistola") this.player.anims.play('caminar_pistola');
                        else if (this.player.arma.nom == "escopeta") this.player.anims.play('caminar_escopeta');
                        else this.player.anims.play('caminar_rifle');
                        this.player.accio = "avall";
                    }
                    if (!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio == "recarregar")) this.player.angle = 90;
                    this.player.setVelocityY(this.player.velocitat);
                    this.player.setVelocityX(0);
                }
                else if (this.cursors.W.isDown) {
                    if (this.player.accio == "quiet" || (this.player.accio == "atacar" && this.player.cooldown_animacio == false)) {
                        if (this.player.arma.nom == "ganivet") this.player.anims.play('caminar_ma');
                        else if (this.player.arma.nom == "pistola") this.player.anims.play('caminar_pistola');
                        else if (this.player.arma.nom == "escopeta") this.player.anims.play('caminar_escopeta');
                        else this.player.anims.play('caminar_rifle');
                        this.player.accio = "amunt";
                    }
                    if (!this.player.cooldown_animacio || (this.player.cooldown_animacio && this.player.accio == "recarregar")) this.player.angle = -90;
                    this.player.setVelocityY(-this.player.velocitat);
                    this.player.setVelocityX(0);
                }
                else {//no es presiona cap tecla de moviment
                    if (this.player.accio != "quiet") {
                        if ((this.player.accio != "atacar" || this.player.cooldown_animacio == false) && (this.player.accio != "recarregar" || this.player.cooldown_animacio == false)) {
                            if (this.player.arma.nom == "ganivet") this.player.anims.play('quiet_ma');
                            else if (this.player.arma.nom == "pistola") this.player.anims.play('quiet_pistola');
                            else if (this.player.arma.nom == "escopeta") this.player.anims.play('quiet_escopeta');
                            else this.player.anims.play('quiet_rifle');
                            this.player.accio = "quiet";
                        }
                        this.player.setVelocityY(0);
                        this.player.setVelocityX(0);
                    }
                }
            }








            this.bales_aliades.children.iterate((child) => {
                if (child) {//he fet això perquè per alguna raó iterava sobre child ja destruit, que valien undefined i petava al accedir al body
                    var pos = child.body.position.clone();
                    pos.subtract(child.pos_inicial);
                    var distancia = pos.length();
                    if (distancia >= child.rang) child.destroy();
                }

            });
            this.bales_enemigues.children.iterate((child) => {
                if (child) {//he fet això perquè per alguna raó iterava sobre child ja destruit, que valien undefined i petava al accedir al body
                    var pos = child.body.position.clone();
                    pos.subtract(child.pos_inicial);
                    var distancia = pos.length();
                    if (distancia >= child.rang) child.destroy();
                }

            });
        }
    }
}

