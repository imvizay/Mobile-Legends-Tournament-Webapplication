import { Mail, Lock, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import ThemeToggle from "../../components/button/ThemeToggle";

import { useNavigate } from 'react-router-dom'

import { useLogin } from "../../hooks/auth/useLogin";
import { validLoginCredentials } from "../../utils/validators/loginValidator";
import { toast } from "react-toastify";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [userCredError,setUserCredError] = useState({});
  const [formData,setFormData] = useState({
    email:'',
    password:''
  })

  const navigate = useNavigate()
  const {
    mutateAsync,
    isPending,
  } = useLogin()

  // handle input 
  const handleInputFields = (e) => {
    const {name,value} = e.target

    setFormData(
      prev => (
        {
          ...prev,
          [name]:value
        }
      )
    )
  }

  const handleLogin = async (e) => {
    e.preventDefault();

    const { isValid, errors} = validLoginCredentials(formData)

    if (!isValid) {
      setUserCredError(errors)

      if (errors.empty_fields) {
        toast.info("All fields are required.",{
           toastId: "fields-required-info",
          })
      }
        return;
    }

    try{
      const data = await mutateAsync(formData) 
      console.log('Login Response:',data)
      navigate('/')
    }
    catch(e){
      console.log("LOGIN ERROR",e)
    }

  }

  const handleSocialLogin = (socialProvider) => {
    // socialProvider (facebook or google)


  }

  return (
    <div className="min-h-screen bg-[var(--bg-canvas)]  relative overflow-hidden">

    
      <div className="relative z-10 px-4 py-4 md:px-8">

        {/* Header */}
        <header className="max-w-6xl mx-auto flex items-center justify-between mb-6">

          <h1 
          onClick={ () => navigate('/') }
          className="text-[var(--text-primary)] text-3xl font-[Google Sans] font-extrabold tracking-tight">
            Gamix.
          </h1>

          <div className="flex items-center gap-4">

            <ThemeToggle />

            <p className="hidden sm:block text-sm text-[var(--text-muted)]">
              Don't have an account?
            </p>

            <button onClick={ () => navigate('/register') } className="text-[var(--text-primary)] font-medium">
              Register →
            </button>

          </div>

        </header>

        {/* Card */}
        <div className="max-w-xl mx-auto">

          <div
            className="
            rounded-[32px]
            bg-[var(--glass-highlight)] backdrop-blur-xl
            border
            border-[var(--border-default)]
            shadow-[0_20px_60px_rgba(0,0,0,0.08)]
            p-5 sm:px-10 
          "
          >

            {/* Heading */}
            <div className="mb-5">

              <p
                className="
                uppercase
                tracking-[0.25em]
                text-[var(--headline-accent)]
                text-xs
                font-semibold
              "
              >
                Welcome Back
              </p>

              <h2
                className="
                font-serif
                text-4xl
                text-[var(--text-secondary)]
                md:text-5xl
                leading-none
                mt-2
              "
              >
                Login
              </h2>

              <div className="w-20 h-px bg-[var(--headline-accent)] mt-4" />

              <p className="mt-2 text-[10px] md:text-[12px] text-[var(--text-muted)] leading-relaxed">
                Continue your journey, join tournaments,
                compete with the best players and earn exclusive rewards.
              </p>

            </div>

            {/* Form */}
            <form className="space-y-2" onSubmit={handleLogin}>

              {/* Email */}
              <div className="text-[var(--text-primary)]">

                <label className="block mb-1 text-sm font-medium">
                  Email
                </label>

                <div className="relative ">

                  <Mail size={18} className=" absolute left-4 top-1/2 -translate-y-1/2  
                  "/>

                  <input
                    type="text"
                    onChange={handleInputFields}
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    className="
                    w-full
                    h-12
                    rounded-xl
                    border border-[var(--border-default)]
                    bg-[var(--glass-navbar)]
                    pl-12
                    pr-4
                    outline-none
                    focus:border-black
                    transition
                  "
                  />

                </div>
                {userCredError.email && <p className="text-red-400 text-[12px]">{userCredError.email}</p>} 
              </div>

              {/* Password */}
              <div className="text-[var(--text-primary)]">

                <label className="block mb-1 text-sm font-medium">
                  Password
                </label>

                <div className="relative">

                  <Lock
                    size={18} className=" absolute left-4 top-1/2 -translate-y-1/2 " />

                  <input
                  onChange={handleInputFields}
                  name="password"
                  value={formData.password}
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter password"
                    className="
                    w-full
                    h-12
                    rounded-xl
                    border
                    border-[var(--border-default)]
                    bg-[var(--glass-navbar)]
                    pl-12
                    pr-12
                    outline-none
                    focus:border-black
                    transition
                  "
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(!showPassword)
                    }
                    className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                  "
                  >
                    <Eye size={18} />
                  </button>

                </div>

              </div>

              {/* Remember + Forgot */}
              <div
                className="
                flex
                items-center
                justify-end
                pt-1
              "
              >
 
                <button
                  type="button"
                  className="
                  text-sm
                  text-[var(--headline-accent)]
                  hover:underline
                "
                >
                  Forgot Password?
                </button>

              </div>

              {/* Login Button */}
              <button
              type="submit"
                className="
                w-full
                h-12
                rounded-xl
                bg-[var(--action-primary-bg)]
                text-[var(--action-primary-text)]
                font-medium
                hover:scale-[1.01]
                active:scale-[0.99]
                transition
                mt-2
              "
              >
                Login →
              </button>

            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-4">

              <div className="flex-1 h-px bg-[var(--text-muted)]" />

              <span className="text-[12px] text-[var(--text-muted)]">
                OR CONTINUE WITH
              </span>

              <div className="flex-1 h-px bg-[var(--text-muted)]" />

            </div>

            {/* Social */}
            <div className="text-[var(--text-secondary)] grid sm:grid-cols-2 gap-3">

              <button
                onClick={() => handleSocialLogin('google')}
                className="
                h-12
                rounded-xl
                border
                border-[var(--border-default)]
                bg-[var(--glass-navbar)]
                font-medium
                hover:bg-zinc-50
              "
              >
                Google
              </button>

              <button
                onClick={() => handleSocialLogin('facebook')}
                className="
                h-12
                rounded-xl
                border
                border-[var(--border-default)]
                bg-[var(--glass-navbar)]
                font-medium
                hover:bg-zinc-50
              "
              >
                Facebook
              </button>

            </div>

            <p
              className="
              mt-4
              text-sm
              text-center
              text-[var(--text-muted)]
            "
            >
              Your account is protected by enterprise-grade security.
            </p>

          </div>

        </div>

      </div>

    </div>
  );
}