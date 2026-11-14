import * as THREE from 'three';
import { StageConfig, StageKey } from '../types/game';
import { EventBus } from '../core/EventBus';
import { EnvironmentManager } from '../environments/EnvironmentManager';
import { Hummuson } from '../entities/Hummuson/Hummuson';
import { ShadowCage } from '../entities/Hummuson/Cage';
import { KingCrumbs } from '../entities/KingCrumbs/KingCrumbs';
import { ParticleSystem } from './ParticleSystem';

export const STORY_STAGES: StageConfig[] = [
  {
    env: 'jaffa',
    badge: 'שלב 1 מתוך 4 • יפו העתיקה',
    title: 'בעקבות הכוכב האבוד',
    story: 'מלך הפירורים חטף את חומוסון (שקופץ ומסתובב בלי שליטה כשהוא מתרגש) כדי לבנות ממלכה בלי פיתה, פלאפל או טחינה! סמטאות יפו מוארות באור ירח — אספו 3 כוכבים בין הסמטאות, החתולים והנמל כדי להפעיל את מפתח השחרור הראשון!',
    transitionTitle: 'מעבר לשלב 2: מסע בעקבות הרוח',
    transitionStory: 'הכלוב מהבהב וחומוסון קופץ בהתרגשות! פתאום רוח חזקה מהים מרימה את פלאפלוצ׳יק עם התרמיל שלו — הוא מתגלגל באוויר ונוחת... בתוך סירה קטנה בדרך לכנרת!',
    text: 'יפו העתיקה: אספו 3 כוכבים!',
    color: '#f59e0b',
    stars: [
      new THREE.Vector3(-1.9, 1.35, 1.4),
      new THREE.Vector3(1.8, 1.65, -0.8),
      new THREE.Vector3(0.1, 2.25, -1.9)
    ],
    cagePos: new THREE.Vector3(2.2, 0.0, -2.5),
    kingPos: new THREE.Vector3(2.9, 0.0, -3.4),
    skyTopDim: '#1e293b', skyTopBright: '#3b82f6',
    skyBotDim: '#475569', skyBotBright: '#fde68a',
    fogDim: '#334155', fogBright: '#fef3c7'
  },
  {
    env: 'kinneret',
    badge: 'שלב 2 מתוך 4 • הכנרת',
    title: 'התעלומה שבמים',
    story: 'השמש שוקעת מעל הכנרת והר ארבל, ודגים סקרנים וברווז אחד (שמנסה לגנוב כובעים) מציצים מהמים! אספו 3 כוכבי ברקת באזור החוף והסירות כדי לשבור את החותם השני!',
    transitionTitle: 'מעבר לשלב 3: לאן נעלמה הסירה?',
    transitionStory: 'החותם מתפוצץ בניצוץ ירוק וחומוסון מנופף מתוך הכלוב! פלאפלוצ׳יק עולה על סירה, המנוע משתעל, והוא מגלה ששטה בכלל למדבר — והנעליים שלו מלאות בחול!',
    text: 'הכנרת: אספו 3 כוכבי ברקת!',
    color: '#22c55e',
    stars: [
      new THREE.Vector3(1.9, 1.45, 1.2),
      new THREE.Vector3(-1.8, 1.85, -0.9),
      new THREE.Vector3(0.4, 2.35, 1.9)
    ],
    cagePos: new THREE.Vector3(-2.1, 0.0, -2.6),
    kingPos: new THREE.Vector3(-2.9, 0.0, -3.5),
    skyTopDim: '#1e3a5f', skyTopBright: '#2589e6',
    skyBotDim: '#335c67', skyBotBright: '#fed7aa',
    fogDim: '#2d4a53', fogBright: '#e0f2fe'
  },
  {
    env: 'masada',
    badge: 'שלב 3 מתוך 4 • מצדה',
    title: 'ההרפתקה על ההר',
    story: 'השמש זורחת מעל מדבר יהודה ומצדה! פלאפלוצ׳יק מטפס בשבילים, מפסיד בתחרות טיפוס ליעל הרים עקשן, ומגלה שכדור פלאפל לא נועד לשטח. אספו 3 כוכבי ספיר כדי לשבור את החותם השלישי!',
    transitionTitle: 'מעבר לשלב 4: האור בקצה הדרך',
    transitionStory: 'הכלוב מתחיל לרעוד — נשאר רק מנעול אחד! שלושת הכוכבים מאירים את הדרך לירושלים. פלאפלוצ׳יק מתיישב על התרמיל, נושם עמוק וממשיך להציל את חומוסון!',
    text: 'מצדה: אספו 3 כוכבי ספיר!',
    color: '#38bdf8',
    stars: [
      new THREE.Vector3(-1.8, 1.55, 1.3),
      new THREE.Vector3(1.7, 2.15, -1.4),
      new THREE.Vector3(-0.3, 2.45, -2.0)
    ],
    cagePos: new THREE.Vector3(2.1, 0.0, -2.4),
    kingPos: new THREE.Vector3(2.9, 0.0, -3.3),
    skyTopDim: '#312e81', skyTopBright: '#1e69c4',
    skyBotDim: '#9a3412', skyBotBright: '#fcd9a8',
    fogDim: '#7c2d12', fogBright: '#ffedd5'
  },
  {
    env: 'kotel',
    badge: 'שלב 4 מתוך 4 • ירושלים',
    title: 'החילוץ הגדול!',
    story: 'מלך הפירורים מחכה ברחבת הכותל עם הכובע הענקי שלו (ומודה שהוא פשוט רצה אוסף כוכבים גדול משל כולם)! אספו 3 כוכבי זהב כדי לנטרל את הקסם, לפרק את הכלוב ולשחרר את חומוסון!',
    transitionTitle: '',
    transitionStory: '',
    text: 'ירושלים: אספו 3 כוכבי זהב!',
    color: '#fde047',
    stars: [
      new THREE.Vector3(1.7, 1.55, 1.2),
      new THREE.Vector3(-1.9, 1.9, -1.1),
      new THREE.Vector3(0.0, 2.55, -1.8)
    ],
    cagePos: new THREE.Vector3(-2.0, 0.0, -2.4),
    kingPos: new THREE.Vector3(2.1, 0.0, -3.1),
    skyTopDim: '#1e3a8a', skyTopBright: '#2874c9',
    skyBotDim: '#92400e', skyBotBright: '#fde68a',
    fogDim: '#475569', fogBright: '#fef3c7'
  }
];

export interface StageStarItem {
  mesh: THREE.Group;
  basePos: THREE.Vector3;
  collected: boolean;
}

export class StageManager {
  public stageIndex = 0;
  public storyCompleted = false;
  public starsCollected = 0;
  public stageStars: StageStarItem[] = [];

  private scene: THREE.Scene;
  private envManager: EnvironmentManager;
  private hummuson: Hummuson;
  private shadowCage: ShadowCage;
  private king: KingCrumbs;
  private particles: ParticleSystem;
  private eventBus: EventBus;

  public finaleBenchGroup: THREE.Group;
  public isTransitioning = false;
  public pendingStageAdvance = false;

  constructor(
    scene: THREE.Scene,
    envManager: EnvironmentManager,
    hummuson: Hummuson,
    shadowCage: ShadowCage,
    king: KingCrumbs,
    particles: ParticleSystem,
    eventBus: EventBus
  ) {
    this.scene = scene;
    this.envManager = envManager;
    this.hummuson = hummuson;
    this.shadowCage = shadowCage;
    this.king = king;
    this.particles = particles;
    this.eventBus = eventBus;

    // Finale Bench
    this.finaleBenchGroup = new THREE.Group();
    this.finaleBenchGroup.position.set(0.55, 0, -0.35);
    this.finaleBenchGroup.visible = false;

    const benchWood = new THREE.MeshStandardMaterial({ color: '#854d0e', roughness: 0.85 });
    const benchSeat = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.12, 0.65), benchWood);
    benchSeat.position.y = 0.42;
    benchSeat.castShadow = true;
    const benchBack = new THREE.Mesh(new THREE.BoxGeometry(2.1, 0.48, 0.10), benchWood);
    benchBack.position.set(0, 0.72, -0.28);
    benchBack.rotation.x = -0.15;
    [-0.85, 0.85].forEach((bx) => {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.42, 0.55), new THREE.MeshStandardMaterial({ color: '#334155' }));
      leg.position.set(bx, 0.21, 0);
      this.finaleBenchGroup.add(leg);
    });

    const giantPita = new THREE.Mesh(
      new THREE.TorusGeometry(0.32, 0.12, 10, 20, Math.PI * 1.15),
      new THREE.MeshStandardMaterial({ color: '#e6c589', roughness: 0.85 })
    );
    giantPita.position.set(0.45, 0.54, 0.02);
    giantPita.rotation.x = Math.PI * 0.42;
    this.finaleBenchGroup.add(benchSeat, benchBack, giantPita);
    this.scene.add(this.finaleBenchGroup);
  }

  private createStarMesh(colorHex: string): THREE.Group {
    const starGroup = new THREE.Group();
    const starMat = new THREE.MeshStandardMaterial({
      color: colorHex,
      emissive: colorHex,
      emissiveIntensity: 0.7,
      roughness: 0.2,
      metalness: 0.6
    });

    const t1 = new THREE.Mesh(new THREE.TetrahedronGeometry(0.26, 0), starMat);
    const t2 = new THREE.Mesh(new THREE.TetrahedronGeometry(0.26, 0), starMat);
    t2.rotation.y = Math.PI;
    t2.rotation.z = Math.PI;

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.35, 0.025, 8, 22),
      new THREE.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.7 })
    );
    starGroup.add(t1, t2, halo);
    return starGroup;
  }

  public clearStageStars(): void {
    this.stageStars.forEach((item) => {
      this.scene.remove(item.mesh);
    });
    this.stageStars = [];
  }

  public loadStage(idx: number, showModal = true): void {
    this.stageIndex = idx;
    this.storyCompleted = false;
    this.starsCollected = 0;
    this.clearStageStars();

    const st = STORY_STAGES[idx];
    st.stars.forEach((pos) => {
      const mesh = this.createStarMesh(st.color);
      mesh.position.copy(pos);
      this.scene.add(mesh);
      this.stageStars.push({ mesh, basePos: pos.clone(), collected: false });
    });

    this.hummuson.group.position.copy(st.cagePos);
    this.king.group.position.copy(st.kingPos);
    this.king.group.visible = true;
    this.king.setCostume(st.env);
    this.finaleBenchGroup.visible = false;
    this.shadowCage.setVisible(true);
    this.hummuson.setHappy(false);

    this.envManager.buildEnv(st.env);
    this.applyAtmosphere(st);

    this.eventBus.emit('stage:changed', {
      stageIndex: this.stageIndex,
      config: st,
      showModal
    });
  }

  public applyAtmosphere(st: StageConfig): void {
    const progress = st.stars.length > 0 ? this.starsCollected / st.stars.length : 1;
    const cTop = new THREE.Color(st.skyTopDim).lerp(new THREE.Color(st.skyTopBright), progress);
    const cBot = new THREE.Color(st.skyBotDim).lerp(new THREE.Color(st.skyBotBright), progress);
    const cFog = new THREE.Color(st.fogDim).lerp(new THREE.Color(st.fogBright), progress);

    this.envManager.skyDome.setColors(cTop.getHexString(), cBot.getHexString());
    this.scene.background = cTop;
    if (this.scene.fog && 'near' in this.scene.fog) {
      const fog = this.scene.fog as THREE.Fog;
      fog.color.copy(cFog);
      fog.near = 11 + progress * 7;
      fog.far = 42 + progress * 22;
    }
  }

  public checkStarCollection(charPos: THREE.Vector3): void {
    if (this.storyCompleted || this.isTransitioning) return;

    for (let i = 0; i < this.stageStars.length; i++) {
      const star = this.stageStars[i];
      if (!star.collected && star.mesh.position.distanceTo(charPos) < 0.65) {
        star.collected = true;
        this.starsCollected++;
        this.scene.remove(star.mesh);

        this.particles.spawnSparkles(star.mesh.position.x, star.mesh.position.y, star.mesh.position.z, '#fde047');
        this.eventBus.emit('sound:bell', 520 + this.starsCollected * 140);
        this.eventBus.emit('stage:starCollected', {
          starsCollected: this.starsCollected,
          total: this.stageStars.length
        });

        this.applyAtmosphere(STORY_STAGES[this.stageIndex]);

        if (this.starsCollected >= this.stageStars.length) {
          this.completeCurrentStage();
        }
      }
    }
  }

  public completeCurrentStage(): void {
    if (this.storyCompleted || this.isTransitioning) return;

    this.particles.spawnSparkles(
      this.hummuson.group.position.x,
      0.6,
      this.hummuson.group.position.z,
      '#fde047'
    );

    if (this.stageIndex < STORY_STAGES.length - 1) {
      this.eventBus.emit('sound:rescueFanfare', false);
      const curSt = STORY_STAGES[this.stageIndex];
      this.pendingStageAdvance = true;
      this.eventBus.emit('stage:complete', {
        stageIndex: this.stageIndex,
        isFinale: false,
        transitionTitle: curSt.transitionTitle,
        transitionStory: curSt.transitionStory
      });
    } else {
      this.isTransitioning = true;
      this.eventBus.emit('sound:rescueFanfare', true);
      this.eventBus.emit('stage:curtain', true);

      setTimeout(() => {
        this.storyCompleted = true;
        this.shadowCage.setVisible(false);
        this.hummuson.setHappy(true);
        this.finaleBenchGroup.visible = true;

        this.hummuson.group.position.set(1.0, 0.52, -0.33);
        this.king.group.position.set(-2.5, 0, -2.6);
        this.king.kingHat.rotation.z = 0.65;

        this.envManager.buildEnv('kotel');
        if (this.scene.fog && 'near' in this.scene.fog) {
          const fog = this.scene.fog as THREE.Fog;
          fog.near = 18;
          fog.far = 65;
        }

        this.eventBus.emit('stage:complete', {
          stageIndex: this.stageIndex,
          isFinale: true,
          transitionTitle: 'סוף טוב, טחינה בשפע!',
          transitionStory: 'פלאפלוצ׳יק וחומוסון ניצחו! כלוב הצללים התפרק לאלפי פירורים זוהרים!'
        });
      }, 1150);

      setTimeout(() => {
        this.eventBus.emit('stage:curtain', false);
        this.isTransitioning = false;
      }, 2350);
    }
  }

  public advanceStage(): void {
    if (!this.pendingStageAdvance) return;
    this.pendingStageAdvance = false;
    this.isTransitioning = true;

    this.eventBus.emit('stage:curtain', true);
    this.eventBus.emit('sound:spooky');
    this.stageIndex++;

    setTimeout(() => {
      this.loadStage(this.stageIndex, false);
    }, 1150);

    setTimeout(() => {
      this.eventBus.emit('stage:curtain', false);
      this.isTransitioning = false;
      const nextSt = STORY_STAGES[this.stageIndex];
      this.eventBus.emit('story:modal', {
        badge: nextSt.badge,
        title: nextSt.title,
        body: nextSt.story
      });
    }, 2300);
  }

  public update(elapsed: number): void {
    // Floating stars animation
    for (let i = 0; i < this.stageStars.length; i++) {
      const star = this.stageStars[i];
      if (!star.collected) {
        star.mesh.position.y = star.basePos.y + Math.sin(elapsed * 2.8 + i * 1.5) * 0.12;
        star.mesh.rotation.y = elapsed * 1.4 + i;
        star.mesh.rotation.x = Math.sin(elapsed * 1.8 + i) * 0.2;
      }
    }
  }
}
