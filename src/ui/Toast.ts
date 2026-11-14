export const ENV_LABELS: Record<string, string> = {
  kotel: 'הכותל המערבי • ירושלים',
  masada: 'מצדה • מדבר יהודה',
  kinneret: 'הכנרת • הגליל',
  jaffa: 'יפו העתיקה • חוף הים התיכון'
};

export class Toast {
  private el: HTMLElement | null;
  private timer: any = null;

  constructor(elementId = 'location-toast') {
    this.el = document.getElementById(elementId);
  }

  public show(envKey: string): void {
    if (!this.el) return;
    this.el.textContent = ENV_LABELS[envKey] || envKey;
    this.el.classList.add('visible');

    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      if (this.el) this.el.classList.remove('visible');
    }, 2400);
  }
}
