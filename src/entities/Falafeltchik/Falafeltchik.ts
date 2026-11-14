import * as THREE from 'three';
import { FalafelBody } from './Body';
import { FalafelFace } from './Face';
import { FalafelHeadband } from './Headband';
import { FalafelToppings } from './Toppings';
import { FalafelBackpack } from './Backpack';
import { FalafelLimbs } from './Limbs';

export class Falafeltchik {
  public root: THREE.Group;
  public physicsGroup: THREE.Group;
  public bodyCenter: THREE.Group;

  public body: FalafelBody;
  public face: FalafelFace;
  public headband: FalafelHeadband;
  public toppings: FalafelToppings;
  public backpack: FalafelBackpack;
  public limbs: FalafelLimbs;

  constructor() {
    this.root = new THREE.Group();

    this.physicsGroup = new THREE.Group();
    this.root.add(this.physicsGroup);

    this.bodyCenter = new THREE.Group();
    this.bodyCenter.position.set(0, 1.05, 0);
    this.physicsGroup.add(this.bodyCenter);

    this.body = new FalafelBody();
    this.bodyCenter.add(this.body.group);

    this.face = new FalafelFace();
    this.bodyCenter.add(this.face.group);

    this.headband = new FalafelHeadband();
    this.bodyCenter.add(this.headband.group);

    this.toppings = new FalafelToppings();
    this.bodyCenter.add(this.toppings.group);

    this.backpack = new FalafelBackpack();
    this.bodyCenter.add(this.backpack.group);

    this.limbs = new FalafelLimbs();
    this.bodyCenter.add(
      this.limbs.leftArm,
      this.limbs.rightArm,
      this.limbs.leftLeg,
      this.limbs.rightLeg
    );
  }

  public update(dt: number, elapsed: number, isSitting: boolean, windBoost: number): void {
    this.face.update(dt);
    this.headband.update(elapsed, isSitting, windBoost);
  }
}
