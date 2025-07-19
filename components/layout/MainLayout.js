import Link from 'next/link'
import React from 'react'

const MainLayout = ({ children }) => {

  const navigation = [
    { name: 'Home', path: '/' },
    { name: 'Type', path: '/type' },
    { name: 'Multiplayer', path: '/multiplayer' },
    { name: 'Leadboard', path: '/leadboard' },
    { name: 'Profile', path: '/profile' }
  ]

  return (
    <div className='min-h-screen bg-gradient-to-r from-slate-900 to-slate-600'>
      {/* Navigation Header */}
      <header className='text-white flex items-center justify-center p-4 gap-10 bg-white/10 backdrop-blur-lg sticky top-0 z-50'>
        {navigation.map((item) => {
          return (
            <Link
              key={item.name}
              href={item.path}
              className='text-white hover:text-gray-300 font-mono'
            >
              {item.name}
            </Link>
          )
        })}
      </header>
      <main>
        {children}
      </main>
    </div>
  )
}

export default MainLayout