import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/store/authStore'
import { Phone, MessageSquare, Mail, Eye, EyeOff, X, Shield } from 'lucide-react'

type LoginMethod = 'phone' | 'wechat' | 'email'

export default function LoginPage() {
  const navigate = useNavigate()
  const { login, loginAsGuest } = useAuthStore()
  const [activeMethod, setActiveMethod] = useState<LoginMethod>('phone')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [verifyCode, setVerifyCode] = useState('')
  const [codeSent, setCodeSent] = useState(false)
  const [codeCountdown, setCodeCountdown] = useState(0)
  const [agreed, setAgreed] = useState(false)

  const sendCode = () => {
    if (!phone || phone.length < 11) return
    setCodeSent(true)
    setCodeCountdown(60)
    const timer = setInterval(() => {
      setCodeCountdown((c) => {
        if (c <= 1) {
          clearInterval(timer)
          return 0
        }
        return c - 1
      })
    }, 1000)
  }

  const handleLogin = () => {
    if (!agreed) return
    if (activeMethod === 'phone' && phone.length >= 11) {
      login('phone', phone)
      navigate('/onboarding')
    } else if (activeMethod === 'email' && email && password) {
      login('email', email)
      navigate('/onboarding')
    }
  }

  const handleWechatLogin = () => {
    if (!agreed) return
    login('wechat', '微信用户')
    navigate('/onboarding')
  }

  const handleGuest = () => {
    loginAsGuest()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-white max-w-lg mx-auto flex flex-col">
      {/* Header */}
      <div className="h-[260px] bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg shadow-blue-600/20">
            <span className="font-handwritten text-2xl text-white">简搭</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">简搭衣橱</h1>
          <p className="text-sm text-gray-400 mt-2">盘活你的每一件衣服，每天轻松穿出彩</p>
        </div>
      </div>

      {/* Login form */}
      <div className="flex-1 px-5 pt-6 pb-6 -mt-4">
        {/* Method tabs */}
        <div className="flex gap-2 mb-5 bg-gray-50 p-1 rounded-xl">
          {([
            { method: 'phone' as LoginMethod, label: '手机号', icon: Phone },
            { method: 'wechat' as LoginMethod, label: '微信', icon: MessageSquare },
            { method: 'email' as LoginMethod, label: '邮箱', icon: Mail },
          ]).map(({ method, label, icon: Icon }) => (
            <button
              key={method}
              onClick={() => setActiveMethod(method)}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                activeMethod === method
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </div>

        {/* Phone login form */}
        {activeMethod === 'phone' && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-2">
              <Phone size={16} className="text-gray-400" />
              <input
                type="tel"
                placeholder="请输入手机号"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                className="text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none flex-1"
                maxLength={11}
              />
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-2">
              <Shield size={16} className="text-gray-400" />
              <input
                type="text"
                placeholder="验证码"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value.slice(0, 6))}
                className="text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none flex-1"
                maxLength={6}
              />
              <button
                onClick={sendCode}
                disabled={codeCountdown > 0 || phone.length < 11}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium ${
                  codeCountdown > 0 || phone.length < 11
                    ? 'bg-gray-200 text-gray-400'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                {codeCountdown > 0 ? `${codeCountdown}s` : '获取验证码'}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={!agreed || phone.length < 11}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                agreed && phone.length >= 11
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              登录
            </button>
          </div>
        )}

        {/* Wechat login */}
        {activeMethod === 'wechat' && (
          <div className="flex flex-col items-center gap-4 py-6">
            <div className="w-48 h-48 bg-gray-50 rounded-2xl border border-gray-200 flex flex-col items-center justify-center gap-2">
              <MessageSquare size={40} className="text-[#07C160]" />
              <p className="text-sm text-gray-600 font-medium">微信快捷登录</p>
              <p className="text-xs text-gray-400">一键授权，无需输入密码</p>
            </div>

            <button
              onClick={handleWechatLogin}
              disabled={!agreed}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                agreed
                  ? 'bg-[#07C160] text-white hover:bg-[#06AD56]'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              微信一键登录
            </button>
          </div>
        )}

        {/* Email login */}
        {activeMethod === 'email' && (
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-2">
              <Mail size={16} className="text-gray-400" />
              <input
                type="email"
                placeholder="请输入邮箱地址"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none flex-1"
              />
            </div>

            <div className="bg-gray-50 rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-2">
              {showPassword ? <Eye size={16} className="text-gray-400" /> : <EyeOff size={16} className="text-gray-400" />}
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="请输入密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none flex-1"
              />
              <button onClick={() => setShowPassword(!showPassword)} className="p-1 hover:bg-gray-200 rounded-lg">
                {showPassword ? <EyeOff size={14} className="text-gray-400" /> : <Eye size={14} className="text-gray-400" />}
              </button>
            </div>

            <button
              onClick={handleLogin}
              disabled={!agreed || !email || !password}
              className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                agreed && email && password
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-100 text-gray-400'
              }`}
            >
              登录
            </button>
          </div>
        )}

        {/* Agreement */}
        <div className="mt-5 flex items-center gap-2">
          <button
            onClick={() => setAgreed(!agreed)}
            className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              agreed
                ? 'bg-blue-600 border-blue-600 text-white'
                : 'border-gray-300 bg-white'
            }`}
          >
            {agreed && <span className="text-xs">✓</span>}
          </button>
          <p className="text-xs text-gray-400">
            我已阅读并同意
            <span className="text-blue-600 font-medium">《用户协议》</span>
            和
            <span className="text-blue-600 font-medium">《隐私政策》</span>
          </p>
        </div>

        {/* Guest entry */}
        <div className="mt-6 text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px bg-gray-200 flex-1" />
            <span className="text-xs text-gray-400">或者</span>
            <div className="h-px bg-gray-200 flex-1" />
          </div>
          <button onClick={handleGuest} className="text-sm text-gray-400 hover:text-gray-600 transition-colors">
            游客体验 → 仅可浏览首页Demo和发现页
          </button>
        </div>
      </div>
    </div>
  )
}