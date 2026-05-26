class RateLimiter {
  private timestamps: number[] = [];
  private limit = 30;

  async throttle(): Promise<void> {
    const now = Date.now();
    this.timestamps = this.timestamps.filter(t => now - t < 60000);
    if (this.timestamps.length >= this.limit) {
      const wait = 60000 - (now - this.timestamps[0]);
      await new Promise(res => setTimeout(res, wait));
    }
    this.timestamps.push(Date.now());
  }
}

export const rateLimiter = new RateLimiter();