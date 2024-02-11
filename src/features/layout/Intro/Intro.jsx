'use client'

import { useEffect } from 'react'

const Intro = () => {
  useEffect(() => {
    const intro = document.querySelector('.intro')
    const logoSpan = document.querySelectorAll('.intro-logo')

    setTimeout(() => {
      logoSpan.forEach((span, idx) => {
        setTimeout(() => {
          span.classList.add('active')
        }, (idx + 1) * 400)
      })

      setTimeout(() => {
        logoSpan.forEach((span, idx) => {
          setTimeout(() => {
            span.classList.remove('active')
            span.classList.add('fade')
          }, (idx + 1) * 50)
        })
      }, 2000)

      setTimeout(() => {
        intro.style.top = '-100vh'
      }, 2300)
    })
  }, [])

  return (
    <div className="intro fixed z-50 left-0 top-0 w-full h-screen bg-zinc-900 transition-all 2s">
      <h1 className="logo-header absolute top-1/2 left-1/2 -translate-y-2/4 -translate-x-2/4 text-white">
        <span className="intro-logo">Sl</span>
        <span className="intro-logo">ap!</span>
      </h1>
    </div>
  )
}

export default Intro
