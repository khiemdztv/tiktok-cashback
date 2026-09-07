export const FACEBOOK_URL = "https://facebook.com/DoGiaKhiemOfficial";
export const ZALO_URL = "https://zalo.me/0388347480";

export function FacebookIcon({ className = "size-5" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>;
}

export function ZaloIcon({ className = "size-8" }: { className?: string }) {
  return <svg className={className} viewBox="0 0 40 40" aria-hidden="true"><path d="M20 3C10 3 3 9.6 3 18c0 4.4 1.8 8 5 10.7L6 35l8-3c2 .7 4 1 6 1 10 0 17-6.4 17-15S30 3 20 3Z" fill="#0878ed" /><text x="20" y="23" textAnchor="middle" fill="white" fontFamily="Arial,sans-serif" fontSize="12" fontWeight="700" letterSpacing="-.6">Zalo</text></svg>;
}

export function SocialFloating() {
  return <aside aria-label="Liên hệ hỗ trợ" className="social-floating fixed bottom-24 right-4 z-40 flex flex-col gap-3 lg:bottom-7 lg:right-6">
    <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="Liên hệ qua Facebook" className="social-button grid size-12 place-items-center rounded-full bg-[#2863f1] text-white shadow-lg"><FacebookIcon className="size-6" /><span className="social-tooltip">Facebook</span></a>
    <a href={ZALO_URL} target="_blank" rel="noopener noreferrer" aria-label="Liên hệ qua Zalo" className="social-button grid size-12 place-items-center rounded-full bg-white shadow-lg"><ZaloIcon className="size-9" /><span className="social-tooltip">Zalo</span></a>
  </aside>;
}
