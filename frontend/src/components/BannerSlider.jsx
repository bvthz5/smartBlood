// src/components/BannerSlider.jsx
import React, { useEffect, useRef, useState } from 'react'

const SLIDES = [
  {
    id: 'slide-1',
    title: 'Give Blood. Save Lives.',
    subtitle: 'Join certified donation centers and community drives today.',
    img: 'https://images.unsplash.com/photo-1586772002606-0c6a6a7b7c52?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'slide-2',
    title: 'Find Donors Quickly',
    subtitle: 'Real-time availability and fast matching across nearby centers.',
    img: 'https://images.unsplash.com/photo-1580281657525-12b4a8b3f0ee?q=80&w=1600&auto=format&fit=crop'
  },
  {
    id: 'slide-3',
    title: 'Community Drives & Camps',
    subtitle: 'Organize or join a drive — every pint matters.',
    img: 'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?q=80&w=1600&auto=format&fit=crop'
  }
]

export default function BannerSlider(){
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const liveRef = useRef(null)

  // autoplay with optimized timing
  useEffect(()=>{
    if(paused) return
    
    let timeoutId;
    const scheduleNext = () => {
      timeoutId = setTimeout(() => {
        setIndex(i => (i + 1) % SLIDES.length);
        scheduleNext(); // Schedule the next transition
      }, 4800);
    };
    
    scheduleNext();
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    }
  }, [paused])

  // announce slide for screen readers
  useEffect(()=>{
    if(liveRef.current) liveRef.current.textContent = `${SLIDES[index].title} — ${SLIDES[index].subtitle}`
  }, [index])

  // keyboard nav - optimized with throttling
  useEffect(()=>{
    let ticking = false;
    const onKey = (e) => {
      if (!ticking) {
        requestAnimationFrame(() => {
          if(e.key === 'ArrowLeft') setIndex(i => (i - 1 + SLIDES.length) % SLIDES.length)
          if(e.key === 'ArrowRight') setIndex(i => (i + 1) % SLIDES.length)
          ticking = false;
        });
        ticking = true;
      }
    }
    window.addEventListener('keydown', onKey, { passive: true })
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  function letters(text){
    return Array.from(text).map((ch, i) => <span key={i} className="bs-letter" style={{ animationDelay:`${i*0.02}s` }}>{ch}</span>)
  }

  return (
    <div className="banner-slider" onMouseEnter={()=>setPaused(true)} onMouseLeave={()=>setPaused(false)} style={{ width:'100%' }}>
      <div className="bs-frame" style={{ width:'100%', maxWidth:1100, margin:'0 auto', position:'relative', borderRadius:10, overflow:'hidden' }}>
        <div className="bs-track" style={{ display:'flex', width:`${SLIDES.length * 100}%`, transform:`translateX(-${index * (100 / SLIDES.length)}%)`, transition:'transform 700ms cubic-bezier(.2,.9,.25,1)' }}>
          {SLIDES.map((s) => (
            <div key={s.id} className="bs-slide" style={{ minWidth:`calc(100% / ${SLIDES.length})`, height:420, backgroundImage:`url(${s.img})`, backgroundSize:'cover', backgroundPosition:'center', position:'relative' }}>
              <div style={{ position:'absolute', inset:0, background:'linear-gradient(90deg, rgba(0,0,0,0.42) 30%, rgba(0,0,0,0.12) 100%)' }} />
              <div style={{ position:'relative', zIndex:2, padding:28, height:'100%', display:'flex', flexDirection:'column', justifyContent:'center', color:'#fff' }}>
                <h2 style={{ margin:0, fontSize:'clamp(1.4rem, 2.8vw, 2.4rem)', lineHeight:1.05 }}>{letters(s.title)}</h2>
                <p style={{ marginTop:10, marginBottom:18, opacity:.95 }}>{s.subtitle}</p>
                <div style={{ display:'flex', gap:12 }}>
                  <a className="btn btn--primary" href="/donor/register">Become a Donor</a>
                  <a className="btn btn--outline" href="/find">Find Blood</a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button aria-label="Previous" onClick={()=>setIndex(i => (i - 1 + SLIDES.length) % SLIDES.length)} style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', zIndex:4, width:44, height:44, borderRadius:8, border:0, background:'rgba(0,0,0,.36)', color:'#fff' }}>‹</button>
        <button aria-label="Next" onClick={()=>setIndex(i => (i + 1) % SLIDES.length)} style={{ position:'absolute', right:12, top:'50%', transform:'translateY(-50%)', zIndex:4, width:44, height:44, borderRadius:8, border:0, background:'rgba(0,0,0,.36)', color:'#fff' }}>›</button>

        <div style={{ position:'absolute', left:'50%', transform:'translateX(-50%)', bottom:14, display:'flex', gap:8, zIndex:5 }}>
          {SLIDES.map((_, i) => (
            <button key={i} onClick={()=>setIndex(i)} aria-label={`Go to slide ${i+1}`} style={{ width:10, height:10, borderRadius:999, border:0, background: i===index? '#fff' : 'rgba(255,255,255,.5)' }} />
          ))}
        </div>

        <div role="status" aria-live="polite" ref={liveRef} style={{ position:'absolute', width:1, height:1, padding:0, margin:-1, overflow:'hidden', clip:'rect(0,0,0,0)', whiteSpace:'nowrap', border:0 }} />
      </div>

      <style>{`
        .bs-letter{ display:inline-block; opacity:0; transform:translateY(8px); animation:bs-letter-in 420ms forwards }
        @keyframes bs-letter-in{ to{ opacity:1; transform:none } }
        @media (prefers-reduced-motion: reduce){ .bs-letter, .bs-track{ animation:none; transition:none } }
      `}</style>
    </div>
  )
}
