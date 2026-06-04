import { Mail, Lock, Eye, Sun, Moon } from "lucide-react";
import { useState } from "react";
import ThemeToggle from "../../components/button/ThemeToggle";

import { useNavigate } from 'react-router-dom'

export default function SignupPage() {
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [showConfirm, setShowConfirm] = useState(false);
  
  const navigate = useNavigate()



  return (
    <div className="min-h-screen bg-[var(--bg-canvas)] relative overflow-hidden">
      

      <div className="relative z-10 px-4 py-4 md:px-8">

        {/* Header */}
        <header className="max-w-6xl mx-auto flex items-center justify-between mb-8">
          <h1
          onClick={ () => navigate('/') } 
          className="text-3xl text-[var(--text-primary)] font-[Google Sans] font-extrabold tracking-tight">
            Gamix.
          </h1>

          <div className="flex items-center gap-4">
            <ThemeToggle/>
            

            <p className="hidden sm:block text-sm text-[var(--text-muted)]">
              Already have an account?
            </p>

            <button onClick={ () => navigate('/login') } className=" text-[var(--text-primary)] font-medium">
              Login →
            </button>
          </div>
        </header>

        {/* Card */}
        <div className="max-w-xl mx-auto">

          <div className="rounded-[32px] bg-[var(--glass-highlight)] backdrop-blur-xl border border-[var(--border-default)] shadow-[0_20px_60px_rgba(0,0,0,0.08)] p-6 sm:p-10">

            {/* Title */}
            <div className="mb-5">
              <p className="uppercase tracking-[0.25em] text-[var(--headline-accent)] text-[10px] md:text-xs font-semibold">
                Create your
              </p>

              <h2 className="font-serif text-3xl md:text-5xl leading-none mt-1">
                Account
              </h2>

              <div className="w-20 h-px bg-[var(--headline-accent)] mt-3" />

              <p className="md:block mt-1 md:mt-2 text-[10px] md:text-xs text-[var(--text-muted)] leading-relaxed">
                Join tournaments, climb leaderboards,
                earn rewards and become part of the next generation
                esports community.
              </p>
            </div>

            {/* Form */}
            <form className="space-y-3 md:space-y-5">

              <div className="text-[var(--text-secondary)]">
                <label className="block mb-1  text-sm font-medium">
                  Email
                </label>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                  />

                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="
                    w-full h-12 rounded-xl 
                    border border-[var(--border-default)]  
                    bg-[var(--glass-navbar)] 
                    pl-12 pr-4 
                    outline-none 
                    focus:border-[var(--border-strong)] 
                    transition"
                  />
                </div>
              </div>

              <div className="text-[var(--text-secondary)]">
                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2"
                  />

                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Create password"
                    className="
                    w-full h-12 
                    rounded-xl 
                    border border-[var(--border-default)] 
                    bg-[var(--glass-navbar)] 
                    pl-12 pr-12 outline-none 
                    focus:border-[var(--border-strong)] 
                    transition"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              <div className="text-[var(--text-secondary)]">
                <label className="block mb-1 text-sm font-medium">
                  Confirm Password
                </label>

                <div className="relative">
                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 "
                  />

                  <input
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm password"
                    className="
                    w-full h-12 
                    rounded-xl 
                    border border-[var(--border-default)] 
                    bg-[var(--glass-navbar)] 
                    pl-12 pr-12 
                    outline-none 
                    focus:border-[var(--border-strong)] 
                    transition
                    "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirm(!showConfirm)
                    }
                    className="absolute right-4 top-1/2 -translate-y-1/2"
                  >
                    <Eye size={18} />
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                className="
                w-full
                h-14
                rounded-xl
                bg-[var(--action-primary-bg)]
                text-[var(--action-primary-text)]
                
                font-medium
                hover:scale-[1.01]
                active:scale-[0.99]
                transition
                "
              >
                Create Account →
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-zinc-200" />
              <span className="text-[12px] md:text-sm text-zinc-400">
                OR CONTINUE WITH
              </span>
              <div className="flex-1 h-px bg-zinc-200" />
            </div>

            {/* Social */}
            <div className="grid sm:grid-cols-2 gap-2">

              <button
                className="
                h-12
                rounded-xl
                border
                border-zinc-200
                bg-white
                font-medium
                hover:bg-zinc-50
                "
              >
                Google
              </button>

              <button
                className="
                h-12
                rounded-xl
                border
                border-zinc-200
                bg-white
                font-medium
                hover:bg-zinc-50
                "
              >
                Facebook
              </button>

            </div>

            <p className="mt-6 text-sm text-center text-zinc-500">
              Your data is secure with us.
            </p>

          </div>

        </div>
      </div>
    </div>
  );
}