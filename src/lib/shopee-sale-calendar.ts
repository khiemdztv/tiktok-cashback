type Sale = { name: string; slug: string; month: number | null; day: number | null };

export function featuredShopeeCampaign(campaigns: readonly Sale[], now = new Date()) {
  const vietnam = new Date(now.getTime() + 7 * 3_600_000);
  const year = vietnam.getUTCFullYear();
  const today = Date.UTC(year, vietnam.getUTCMonth(), vietnam.getUTCDate());
  return campaigns.flatMap((item) => {
    if (!item.month || !item.day) return [];
    let eventDay = Date.UTC(year, item.month - 1, item.day);
    const isLive = eventDay === today;
    if (eventDay < today) eventDay = Date.UTC(year + 1, item.month - 1, item.day);
    return [{ ...item, isLive, date: new Date(eventDay - 7 * 3_600_000), eventDay }];
  }).sort((a, b) => a.eventDay - b.eventDay)[0] ?? null;
}
