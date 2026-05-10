import React from 'react'
import { Croissant, Store, TrendingUp, Users, PieChart, Wallet, ShoppingBag, ChefHat } from 'lucide-react'

export const InteractiveSvgBackground: React.FC = () => {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-base-200 pointer-events-none flex items-center justify-center">
      {/* Soft warm gradient meshes for the "bakery" feel using theme colors */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/20 rounded-full mix-blend-multiply filter blur-[100px] animate-[pulse_8s_ease-in-out_infinite_alternate]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] bg-secondary/20 rounded-full mix-blend-multiply filter blur-[120px] animate-[pulse_10s_ease-in-out_infinite_alternate-reverse]" />
      <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-accent/20 rounded-full mix-blend-multiply filter blur-[80px] animate-[pulse_12s_ease-in-out_infinite_alternate]" />
      
      {/* Floating Franchisee & Bakery Icons (Watermark Effect) */}
      <div className="absolute inset-0 w-full h-full">
        {/* Top left cluster */}
        <Store size={380} strokeWidth={1} className="absolute -top-16 -left-16 text-primary opacity-[0.03] -rotate-12" />
        <TrendingUp size={140} strokeWidth={1.5} className="absolute top-48 left-[25%] text-primary opacity-[0.04] rotate-12" />
        
        {/* Top right cluster */}
        <ChefHat size={320} strokeWidth={1} className="absolute -top-10 -right-10 text-secondary opacity-[0.03] rotate-12" />
        <Users size={160} strokeWidth={1.5} className="absolute top-64 right-[20%] text-primary opacity-[0.04] -rotate-6" />

        {/* Bottom left cluster */}
        <Croissant size={300} strokeWidth={1} className="absolute -bottom-10 -left-10 text-primary opacity-[0.03] rotate-12" />
        <Wallet size={180} strokeWidth={1.5} className="absolute bottom-52 left-[20%] text-secondary opacity-[0.04] -rotate-12" />

        {/* Bottom right cluster */}
        <PieChart size={360} strokeWidth={1} className="absolute -bottom-20 -right-20 text-primary opacity-[0.03] -rotate-12" />
        <ShoppingBag size={150} strokeWidth={1.5} className="absolute bottom-60 right-[25%] text-primary opacity-[0.04] rotate-12" />
      </div>

      {/* Animated subtle flowing lines indicating growth/flow */}
      <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <path 
          d="M-100,500 C400,300 800,700 1600,400" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-primary/5 animate-[pulse_6s_ease-in-out_infinite_alternate]" 
        />
        <path 
          d="M-100,550 C400,350 800,750 1600,450" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2" 
          className="text-secondary/5 animate-[pulse_8s_ease-in-out_infinite_alternate-reverse]" 
        />
      </svg>
    </div>
  )
}
