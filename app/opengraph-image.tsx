import { ImageResponse } from 'next/og';
import { siteConfig } from '@/lib/site';

export const runtime = 'edge';
export const alt = 'BNSH Studio — премиальные сайты и веб-приложения';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '80px',
          background:
            'radial-gradient(60% 60% at 50% 0%, #12162a 0%, #050505 60%)',
          color: '#E7E7E9',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: 14,
              border: '1px solid rgba(255,255,255,0.14)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 30,
              fontWeight: 700,
            }}
          >
            B
          </div>
          <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: '0.24em' }}>
            BNSH STUDIO
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ fontSize: 78, fontWeight: 700, lineHeight: 1.05, maxWidth: 900 }}>
            Premium websites &amp; digital products
          </div>
          <div style={{ fontSize: 34, color: '#B9BAC0', maxWidth: 820 }}>
            Сайты, лендинги и веб-приложения для бизнеса, экспертов и личных брендов.
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 26, color: '#8A8B92' }}>
          <span>{siteConfig.url.replace('https://', '')}</span>
          <span style={{ color: '#C6A15B' }}>Digital craft · precision</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
