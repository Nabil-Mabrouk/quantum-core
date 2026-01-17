import { ImageResponse } from 'next/og';
import { getPostBySlug } from '@/app/[locale]/actions/blog';

export const runtime = 'edge';
export const alt = 'Quantum Core Expertise';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(to bottom right, #0f172a, #020617)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '80px',
          fontFamily: 'sans-serif',
        }}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{ background: '#3b82f6', width: '60px', height: '60px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyItems: 'center' }}>
            <span style={{ color: 'white', fontSize: '32px', fontWeight: '900', marginLeft: '12px' }}>QC</span>
          </div>
          <span style={{ color: 'white', fontSize: '32px', fontWeight: 'bold', marginLeft: '20px', letterSpacing: '-0.05em' }}>Quantum Core</span>
        </div>

        {/* Tag */}
        <div style={{ display: 'flex', background: 'rgba(59, 130, 246, 0.1)', border: '1px solid rgba(59, 130, 246, 0.3)', padding: '8px 16px', borderRadius: '10px', marginBottom: '30px' }}>
           <span style={{ color: '#60a5fa', fontSize: '18px', fontWeight: 'bold', textTransform: 'uppercase' }}>
             {post?.tags?.split(',')[0] || 'Expertise'}
           </span>
        </div>

        {/* Title */}
        <div style={{ display: 'flex', fontSize: '72px', fontWeight: '900', color: 'white', lineHeight: '1.1', marginBottom: '20px', letterSpacing: '-0.05em' }}>
          {post?.title}
        </div>

        {/* Footer */}
        <div style={{ display: 'flex', color: '#64748b', fontSize: '24px', fontWeight: '500' }}>
          Analyse Technique & Ingénierie Industrielle
        </div>
      </div>
    ),
    { ...size }
  );
}