import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import { useLanguage } from '../hooks/useLanguage';
import { useBreakpoint } from '../hooks/useBreakpoint';

/* ── Dummy Google Reviews data ───────────────────────────────── */
const REVIEWS_EN = [
  {
    id: 1,
    name: 'Sarah Mitchell',
    role: 'Founder, Bloom Studio',
    avatar: 'SM',
    color: '#4285F4',
    rating: 5,
    date: '2 months ago',
    text: 'Abid completely transformed our brand identity. His attention to detail and ability to translate our vision into stunning visuals was beyond what we expected. The new UI is clean, modern, and our users absolutely love it.',
  },
  {
    id: 2,
    name: 'James Karimi',
    role: 'CTO, Atlantis Tech',
    avatar: 'JK',
    color: '#34A853',
    rating: 5,
    date: '3 months ago',
    text: 'Working with Abid on our RCM platform was a game-changer. He handled complex multi-role dashboards with ease and delivered a polished, intuitive product. One of the best UI/UX designers I\'ve collaborated with.',
  },
  {
    id: 3,
    name: 'Fatima Al-Rashid',
    role: 'Marketing Director, IMC Qatar',
    avatar: 'FA',
    color: '#FBBC05',
    rating: 5,
    date: '4 months ago',
    text: 'Abid led the full redesign of our pharmacy app and brand touchpoints across 100+ branches. The results were remarkable — a 60% lift in online engagement. Highly professional, creative, and always on time.',
  },
  {
    id: 4,
    name: 'Daniel Torres',
    role: 'Product Manager, RAI App',
    avatar: 'DT',
    color: '#EA4335',
    rating: 5,
    date: '5 months ago',
    text: 'Exceptional work on the RAI AI Chat App. Abid nailed the onboarding experience and created an interaction design that felt natural and engaging. The iOS and Android builds both looked flawless.',
  },
  {
    id: 5,
    name: 'Nadia Hussain',
    role: 'CEO, Marcha Platform',
    avatar: 'NH',
    color: '#9C27B0',
    rating: 5,
    date: '6 months ago',
    text: 'The Marcha app went from a rough concept to a fully realized product thanks to Abid\'s UX thinking. He mapped every user journey meticulously and the final design was something we were proud to ship.',
  },
  {
    id: 6,
    name: 'Oliver Chen',
    role: 'Director, Halfur Tech',
    avatar: 'OC',
    color: '#00BCD4',
    rating: 5,
    date: '1 year ago',
    text: 'Abid led our entire design team for Bfare and set a new standard for how we approach product design. His leadership, strategic UX thinking, and design execution were all top-notch.',
  },
  {
    id: 7,
    name: 'Layla Qureshi',
    role: 'Brand Manager, Khuld Builders',
    avatar: 'LQ',
    color: '#FF5722',
    rating: 5,
    date: '1 year ago',
    text: 'From outdoor campaign visuals to the full website redesign, Abid delivered consistently high-quality work. He understood our real estate audience perfectly and every piece of creative was on point.',
  },
  {
    id: 8,
    name: 'Marcus Adeyemi',
    role: 'Event Director, RAMC Events',
    avatar: 'MA',
    color: '#607D8B',
    rating: 5,
    date: '2 years ago',
    text: 'The Capital Smart City campaign was massive in scale, and Abid handled it brilliantly. The creative output across Islamabad and Lahore was stunning. Our stakeholders were incredibly impressed.',
  },
];

const REVIEWS_AR = [
  {
    id: 1,
    name: 'سارة ميتشل',
    role: 'مؤسسة، Bloom Studio',
    avatar: 'SM',
    color: '#4285F4',
    rating: 5,
    date: 'منذ شهرين',
    text: 'حوّل عابد هوية علامتنا التجارية تماماً. اهتمامه بالتفاصيل وقدرته على ترجمة رؤيتنا إلى مرئيات رائعة تجاوز ما توقعناه. واجهة المستخدم الجديدة نظيفة وعصرية ويحبها مستخدمونا.',
  },
  {
    id: 2,
    name: 'جيمس كاريمي',
    role: 'مدير تقني، أتلانتس تك',
    avatar: 'JK',
    color: '#34A853',
    rating: 5,
    date: 'منذ 3 أشهر',
    text: 'التعاون مع عابد في منصة RCM كان نقطة تحول. تعامل مع لوحات تحكم معقدة متعددة الأدوار بسهولة وقدّم منتجاً متقناً وبديهياً. أحد أفضل مصممي UI/UX الذين تعاملت معهم.',
  },
  {
    id: 3,
    name: 'فاطمة الراشد',
    role: 'مديرة التسويق، IMC قطر',
    avatar: 'FA',
    color: '#FBBC05',
    rating: 5,
    date: 'منذ 4 أشهر',
    text: 'قاد عابد إعادة تصميم تطبيق الصيدلية الكاملة وعبر أكثر من 100 فرع. النتائج كانت ملحوظة — ارتفاع 60٪ في التفاعل الرقمي. محترف للغاية ومبدع ودائماً في الوقت المحدد.',
  },
  {
    id: 4,
    name: 'دانيال توريس',
    role: 'مدير منتجات، تطبيق RAI',
    avatar: 'DT',
    color: '#EA4335',
    rating: 5,
    date: 'منذ 5 أشهر',
    text: 'عمل استثنائي على تطبيق RAI للمحادثة بالذكاء الاصطناعي. أتقن عابد تجربة التهيئة وأنشأ تصميم تفاعلي يبدو طبيعياً وجذاباً. بنيا iOS وAndroid بدا لا تشوبه شائبة.',
  },
  {
    id: 5,
    name: 'نادية حسين',
    role: 'رئيسة تنفيذية، منصة Marcha',
    avatar: 'NH',
    color: '#9C27B0',
    rating: 5,
    date: 'منذ 6 أشهر',
    text: 'انتقل تطبيق Marcha من مفهوم خام إلى منتج متكامل بفضل تفكير عابد في تجربة المستخدم. رسم كل رحلة مستخدم بدقة والتصميم النهائي كان شيئاً افتخرنا بإطلاقه.',
  },
  {
    id: 6,
    name: 'أوليفر تشن',
    role: 'مدير، هالفر تك',
    avatar: 'OC',
    color: '#00BCD4',
    rating: 5,
    date: 'منذ سنة',
    text: 'قاد عابد فريق التصميم بأكمله لـ Bfare ووضع معياراً جديداً لكيفية تعاملنا مع تصميم المنتج. قيادته وتفكيره الاستراتيجي وتنفيذ التصميم كانت كلها في أعلى مستوياتها.',
  },
  {
    id: 7,
    name: 'ليلى قريشي',
    role: 'مديرة العلامة التجارية، خلد للإنشاءات',
    avatar: 'LQ',
    color: '#FF5722',
    rating: 5,
    date: 'منذ سنة',
    text: 'من المرئيات الخارجية إلى إعادة تصميم الموقع الكامل، قدّم عابد عملاً عالي الجودة باستمرار. فهم جمهورنا العقاري تماماً وكل قطعة إبداعية كانت في مكانها الصحيح.',
  },
  {
    id: 8,
    name: 'ماركوس أديمي',
    role: 'مدير الفعاليات، RAMC للفعاليات',
    avatar: 'MA',
    color: '#607D8B',
    rating: 5,
    date: 'منذ سنتين',
    text: 'كانت حملة المدينة الذكية ضخمة في الحجم وتعامل معها عابد ببراعة. المخرجات الإبداعية في إسلام آباد ولاهور كانت رائعة. أصحاب المصلحة لدينا كانوا مذهولين للغاية.',
  },
];

/* ── Google Stars ─────────────────────────────────────────────── */
function Stars({ count = 5 }) {
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <svg
          key={i}
          width="14" height="14" viewBox="0 0 24 24"
          fill={i < count ? '#FBBC05' : 'rgba(255,255,255,0.15)'}
        >
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

/* ── Google G Logo ───────────────────────────────────────────── */
function GoogleLogo({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}

/* ── Single Review Card ──────────────────────────────────────── */
function ReviewCard({ review, cardWidth = 360 }) {
  return (
    <div style={{
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '20px',
      padding: '28px 30px',
      width: `${cardWidth}px`,
      minWidth: `${cardWidth}px`,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px',
      position: 'relative',
      transition: 'border-color 0.3s, transform 0.3s',
      flexShrink: 0,
    }}
      onMouseEnter={e => {
        e.currentTarget.style.borderColor = 'rgba(201,169,110,0.35)';
        e.currentTarget.style.transform = 'translateY(-4px)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.borderColor = 'var(--border)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <div style={{
            width: '44px', height: '44px', borderRadius: '50%',
            background: review.color,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '15px', color: '#fff', flexShrink: 0,
          }}>
            {review.avatar}
          </div>
          <div>
            <p style={{
              fontFamily: 'var(--font-display)', fontWeight: 700,
              fontSize: '14px', color: 'var(--text-light)', lineHeight: 1.2,
            }}>{review.name}</p>
            <p style={{
              fontFamily: 'var(--font-body)', fontSize: '11px',
              color: 'var(--text-muted)', marginTop: '2px',
            }}>{review.role}</p>
          </div>
        </div>
        {/* Google logo badge */}
        <div style={{
          width: '32px', height: '32px', borderRadius: '50%',
          background: 'var(--bg-mid)',
          border: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <GoogleLogo size={16} />
        </div>
      </div>

      {/* Stars + date */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Stars count={review.rating} />
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '11px',
          color: 'var(--text-muted)',
        }}>{review.date}</span>
      </div>

      {/* Review text */}
      <p style={{
        fontFamily: 'var(--font-body)', fontSize: '14px',
        lineHeight: 1.75, color: 'rgba(242,237,232,0.68)',
        display: '-webkit-box',
        WebkitLineClamp: 4,
        WebkitBoxOrient: 'vertical',
        overflow: 'hidden',
      }}>{review.text}</p>

      {/* Subtle quote decoration */}
      <div style={{
        position: 'absolute', top: '22px', right: '58px',
        fontFamily: 'var(--font-serif)', fontSize: '72px',
        color: 'rgba(201,169,110,0.06)',
        lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
      }}>"</div>
    </div>
  );
}

/* ── Marquee Track ───────────────────────────────────────────── */
function MarqueeTrack({ reviews, direction = 1, speed = 35, cardWidth = 360 }) {
  // Duplicate for seamless loop
  const doubled = [...reviews, ...reviews];
  const totalCards = reviews.length;
  const cardW = cardWidth;
  const gap = 24;
  const totalWidth = totalCards * (cardW + gap);
  const dur = totalWidth / speed;

  return (
    <div style={{ overflow: 'hidden', width: '100%' }}>
      <motion.div
        style={{
          display: 'flex',
          gap: `${gap}px`,
          width: 'max-content',
        }}
        animate={{ x: direction > 0 ? [0, -totalWidth] : [-totalWidth, 0] }}
        transition={{
          duration: dur,
          ease: 'linear',
          repeat: Infinity,
          repeatType: 'loop',
        }}
      >
        {doubled.map((review, i) => (
          <ReviewCard key={`${review.id}-${i}`} review={review} cardWidth={cardWidth} />
        ))}
      </motion.div>
    </div>
  );
}

/* ── Summary Bar (Google rating badge) ──────────────────────── */
function RatingSummary({ lang }) {
  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: '20px',
      background: 'var(--bg-card)',
      border: '1px solid var(--border)',
      borderRadius: '100px',
      padding: '14px 28px',
    }}>
      <GoogleLogo size={22} />
      <div style={{ width: '1px', height: '28px', background: 'var(--border)' }} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{
            fontFamily: 'var(--font-display)', fontWeight: 900,
            fontSize: '22px', color: 'var(--text-light)', letterSpacing: '-0.03em',
          }}>5.0</span>
          <Stars count={5} />
        </div>
        <span style={{
          fontFamily: 'var(--font-body)', fontSize: '11px',
          color: 'var(--text-muted)',
        }}>
          {lang === 'ar' ? 'مبني على 8 تقييمات Google' : 'Based on 8 Google reviews'}
        </span>
      </div>
    </div>
  );
}

/* ── Main Section ────────────────────────────────────────────── */
export default function TestimonialsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-8% 0px' });
  const { lang } = useLanguage();
  const { isMobile, isTablet } = useBreakpoint();

  const reviews = lang === 'ar' ? REVIEWS_AR : REVIEWS_EN;
  const mid = Math.ceil(reviews.length / 2);
  const row1 = reviews.slice(0, mid);
  const row2 = reviews.slice(mid);

  const sidePad = isMobile ? '20px' : isTablet ? '40px' : '80px';
  const cardWidth = isMobile ? 290 : 360;

  return (
    <section
      id="testimonials"
      ref={ref}
      style={{
        background: 'var(--bg-mid)',
        padding: '160px 0',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Ghost watermark */}
      <div style={{
        position: 'absolute', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        fontFamily: 'var(--font-display)', fontSize: 'clamp(120px, 22vw, 320px)',
        fontWeight: 900, letterSpacing: '-0.06em',
        color: 'rgba(242,237,232,0.018)',
        whiteSpace: 'nowrap', pointerEvents: 'none', userSelect: 'none', lineHeight: 1,
      }}>REVIEWS</div>

      {/* Header */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `0 ${sidePad}`, position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
          style={{ marginBottom: '72px' }}
        >
          <div style={{ display: 'flex', alignItems: isMobile ? 'flex-start' : 'flex-end', justifyContent: 'space-between', flexDirection: isMobile ? 'column' : 'row', flexWrap: 'wrap', gap: '32px' }}>
            <div>
              <p className="section-label">
                {lang === 'ar' ? '— ماذا يقول العملاء' : '— Client Reviews'}
              </p>
              <h2 style={{
                fontFamily: 'var(--font-display)', fontWeight: 900,
                fontSize: isMobile ? 'clamp(36px, 10vw, 60px)' : 'clamp(42px, 6vw, 86px)',
                lineHeight: 1.0, letterSpacing: '-0.04em',
                color: 'var(--text-light)',
              }}>
                {lang === 'ar' ? (
                  <>
                    الثقة تُبنى<br />
                    بـ<span style={{ color: 'var(--accent)' }}>النتائج.</span>
                  </>
                ) : (
                  <>
                    Trust built<br />
                    through <span style={{ color: 'var(--accent)' }}>results.</span>
                  </>
                )}
              </h2>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={inView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            >
              <RatingSummary lang={lang} />
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Marquee rows */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.35 }}
        style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', zIndex: 1 }}
      >
        {/* Gradient masks left/right */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
          background: `linear-gradient(to right, var(--bg-mid) 0%, transparent ${isMobile ? '5%' : '8%'}, transparent ${isMobile ? '95%' : '92%'}, var(--bg-mid) 100%)`,
        }} />

        <div style={{ paddingLeft: sidePad }}>
          <MarqueeTrack reviews={row1} direction={1} speed={32} cardWidth={cardWidth} />
        </div>
        {!isMobile && (
          <div style={{ paddingLeft: sidePad }}>
            <MarqueeTrack reviews={row2} direction={-1} speed={28} cardWidth={cardWidth} />
          </div>
        )}
      </motion.div>

      {/* Bottom CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.5 }}
        style={{
          maxWidth: '1200px', margin: '72px auto 0',
          padding: `0 ${sidePad}`, position: 'relative', zIndex: 1,
          textAlign: 'center',
        }}
      >
        <a
          href="https://www.google.com/search?q=Abid+Saif+Designer"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '10px',
            fontFamily: 'var(--font-display)', fontWeight: 700,
            fontSize: '13px', letterSpacing: '0.04em',
            color: 'var(--text-muted)',
            border: '1px solid var(--border)',
            borderRadius: '100px', padding: '12px 24px',
            transition: 'color 0.2s, border-color 0.2s',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.color = 'var(--accent)';
            e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.color = 'var(--text-muted)';
            e.currentTarget.style.borderColor = 'var(--border)';
          }}
        >
          <GoogleLogo size={14} />
          {lang === 'ar' ? 'عرض جميع التقييمات على Google ↗' : 'View all reviews on Google ↗'}
        </a>
      </motion.div>
    </section>
  );
}
