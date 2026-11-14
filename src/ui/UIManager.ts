import { EventBus } from '../core/EventBus';
import { Toast } from './Toast';
import { MotionMode, StageConfig, StageKey } from '../types/game';

export class UIManager {
  private eventBus: EventBus;
  private toast: Toast;

  private modeButtons: NodeListOf<HTMLButtonElement>;
  private envButtons: NodeListOf<HTMLButtonElement>;
  private btnJump: HTMLButtonElement | null;
  private btnSound: HTMLButtonElement | null;
  private btnResetCam: HTMLButtonElement | null;
  private btnStoryInfo: HTMLButtonElement | null;
  private btnStoryGo: HTMLButtonElement | null;
  private btnStoryReplay: HTMLButtonElement | null;

  private iconSoundOn: HTMLElement | null;
  private iconSoundOff: HTMLElement | null;

  private storyDotsEl: HTMLElement | null;
  private starCounterEl: HTMLElement | null;
  private storyTextEl: HTMLElement | null;
  private storyModalBackdrop: HTMLElement | null;
  private storyCardBadge: HTMLElement | null;
  private storyCardTitle: HTMLElement | null;
  private storyCardBody: HTMLElement | null;
  private transitionCurtain: HTMLElement | null;

  constructor(eventBus: EventBus) {
    this.eventBus = eventBus;
    this.toast = new Toast('location-toast');

    this.modeButtons = document.querySelectorAll('[data-mode]');
    this.envButtons = document.querySelectorAll('[data-env]');
    this.btnJump = document.getElementById('btn-jump') as HTMLButtonElement;
    this.btnSound = document.getElementById('btn-sound') as HTMLButtonElement;
    this.btnResetCam = document.getElementById('btn-reset-cam') as HTMLButtonElement;
    this.btnStoryInfo = document.getElementById('btn-story-info') as HTMLButtonElement;
    this.btnStoryGo = document.getElementById('btn-story-go') as HTMLButtonElement;
    this.btnStoryReplay = document.getElementById('btn-story-replay') as HTMLButtonElement;

    this.iconSoundOn = document.getElementById('icon-sound-on');
    this.iconSoundOff = document.getElementById('icon-sound-off');

    this.storyDotsEl = document.getElementById('story-dots');
    this.starCounterEl = document.getElementById('star-counter');
    this.storyTextEl = document.getElementById('story-text');
    this.storyModalBackdrop = document.getElementById('story-modal-backdrop');
    this.storyCardBadge = document.getElementById('story-card-badge');
    this.storyCardTitle = document.getElementById('story-card-title');
    this.storyCardBody = document.getElementById('story-card-body');
    this.transitionCurtain = document.getElementById('transition-curtain');

    this.bindEvents();
    this.bindBusListeners();
  }

  private bindEvents(): void {
    // Motion modes
    this.modeButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const mode = btn.dataset.mode as MotionMode;
        this.eventBus.emit('ui:setMode', mode);
        this.setModeActive(mode);
      });
    });

    // Jump
    if (this.btnJump) {
      this.btnJump.addEventListener('click', () => {
        this.eventBus.emit('ui:jump');
      });
    }

    // Environments
    this.envButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const env = btn.dataset.env as StageKey;
        this.setEnvActive(env);
        this.toast.show(env);
        this.eventBus.emit('ui:switchEnv', env);
      });
    });

    // Sound toggle
    if (this.btnSound) {
      this.btnSound.addEventListener('click', () => {
        this.eventBus.emit('ui:toggleSound');
      });
    }

    // Camera reset
    if (this.btnResetCam) {
      this.btnResetCam.addEventListener('click', () => {
        this.eventBus.emit('ui:resetCamera');
      });
    }

    // Story dialog continue
    if (this.btnStoryGo) {
      this.btnStoryGo.addEventListener('click', () => {
        this.closeStoryModal();
        this.eventBus.emit('ui:storyGo');
      });
    }

    // Story info
    if (this.btnStoryInfo) {
      this.btnStoryInfo.addEventListener('click', () => {
        this.eventBus.emit('ui:storyInfo');
      });
    }

    // Story replay
    if (this.btnStoryReplay) {
      this.btnStoryReplay.addEventListener('click', () => {
        this.eventBus.emit('ui:storyReplay');
      });
    }
  }

  private bindBusListeners(): void {
    this.eventBus.on('stage:changed', (data: { stageIndex: number; config: StageConfig; showModal: boolean }) => {
      this.setEnvActive(data.config.env);
      this.toast.show(data.config.env);
      this.updateStoryUI(data.stageIndex, 0, data.config.stars.length, data.config.text, false);
      if (data.showModal) {
        this.openStoryModal(data.config.badge, data.config.title, data.config.story);
      }
    });

    this.eventBus.on('stage:starCollected', (data: { starsCollected: number; total: number }) => {
      if (this.starCounterEl) {
        this.starCounterEl.textContent = `★ ${data.starsCollected}/${data.total}`;
      }
    });

    this.eventBus.on('stage:complete', (data: { stageIndex: number; isFinale: boolean; transitionTitle: string; transitionStory: string }) => {
      if (data.isFinale) {
        this.updateStoryUI(3, 3, 3, 'סוף טוב, טחינה בשפע!', true);
      }
      this.openStoryModal(data.isFinale ? 'סוף טוב!' : 'החותם נשבר!', data.transitionTitle, data.transitionStory);
    });

    this.eventBus.on('story:modal', (data: { badge: string; title: string; body: string }) => {
      this.openStoryModal(data.badge, data.title, data.body);
    });

    this.eventBus.on('stage:curtain', (active: boolean) => {
      if (this.transitionCurtain) {
        this.transitionCurtain.classList.toggle('active', active);
      }
    });

    this.eventBus.on('sound:state', (enabled: boolean) => {
      if (this.iconSoundOn) this.iconSoundOn.style.display = enabled ? 'block' : 'none';
      if (this.iconSoundOff) this.iconSoundOff.style.display = enabled ? 'none' : 'block';
    });
  }

  public setModeActive(mode: MotionMode): void {
    this.modeButtons.forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.mode === mode);
    });
  }

  public setEnvActive(env: StageKey): void {
    this.envButtons.forEach((btn) => {
      btn.classList.toggle('env-active', btn.dataset.env === env);
    });
  }

  public openStoryModal(badge: string, title: string, body: string): void {
    if (this.storyCardBadge) this.storyCardBadge.textContent = badge;
    if (this.storyCardTitle) this.storyCardTitle.textContent = title;
    if (this.storyCardBody) this.storyCardBody.textContent = body;
    if (this.storyModalBackdrop) this.storyModalBackdrop.classList.add('open');
  }

  public closeStoryModal(): void {
    if (this.storyModalBackdrop) {
      this.storyModalBackdrop.classList.remove('open');
    }
  }

  public updateStoryUI(stageIdx: number, collected: number, total: number, text: string, isFinished: boolean): void {
    if (this.storyDotsEl) {
      const dots = this.storyDotsEl.querySelectorAll('.story-dot');
      dots.forEach((dot, i) => {
        dot.classList.remove('done', 'current');
        if (isFinished || i < stageIdx) dot.classList.add('done');
        else if (i === stageIdx) dot.classList.add('current');
      });
    }

    if (this.starCounterEl) {
      this.starCounterEl.textContent = `★ ${collected}/${total}`;
    }

    if (this.storyTextEl) {
      this.storyTextEl.textContent = text;
    }

    if (this.btnStoryReplay) {
      this.btnStoryReplay.classList.toggle('visible', isFinished);
    }
  }
}
