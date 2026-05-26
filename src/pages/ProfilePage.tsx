import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuthStore } from '@/store/authStore'
import { User, Pencil, ChevronRight, Crown, Cloud, Trash2, Shield, MessageCircle, LogOut } from 'lucide-react'
import AuthGuardModal from '@/components/AuthGuardModal'

const FREE_FEATURES = [
  '无限次AI场景穿搭',
  '无限制衣物上传与管理',
  '基础闲置统计',
  '防重复采购提醒',
  '穿搭记录保存',
  '发现页全部内容',
]

const VIP_FEATURES = [
  'AI叠穿搭配+配饰全套适配',
  '季度/年度衣橱深度分析报告',
  '专属穿搭模板库',
  'DIY搭配全方位AI优化指导',
  '专属客服答疑',
]

const WARDROBE_STATS = {
  totalItems: 82,
  monthOutfits: 24,
  idleItems: 11,
  reuseRate: '68%',
}

export default function ProfilePage() {
  const { isLoggedIn, isGuest, profile, logout } = useAuthStore()
  const navigate = useNavigate()
  const [showVipModal, setShowVipModal] = useState(false)
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const bodyTypeLabels: Record<string, string> = { h: 'H型', o: 'O型', x: 'X型', a: 'A型', v: 'V型' }
  const skinToneLabels: Record<string, string> = { cool: '冷皮', warm: '暖皮', neutral: '中性皮' }
  const preferenceLabels: Record<string, string> = { minimal: '简约', commute: '通勤', sweet: '甜酷', casual: '休闲', french: '法式' }

  if (isGuest) {
    return (
      <div className="max-w-lg mx-auto bg-white min-h-screen flex flex-col items-center justify-center pb-nav-safe">
        {showAuthModal && <AuthGuardModal feature="vip" onClose={() => setShowAuthModal(false)} />}
        <div className="text-center px-5">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl mx-auto mb-4 flex items-center justify-center">
            <User size={28} className="text-gray-400" />
          </div>
          <h2 className="text-lg font-bold text-gray-900 mb-2">游客模式</h2>
          <p className="text-sm text-gray-400 mb-6">登录后解锁衣橱、记录、数据统计等核心功能</p>
          <button
            onClick={() => setShowAuthModal(true)}
            className="px-8 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            登录解锁权益
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto bg-white">
      {/* User Card */}
      <header className="px-5 pt-8 pb-5 animate-fade-up">
        <div className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center">
              <User size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-gray-900">{profile.name || '用户'}</h2>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {profile.bodyType && (
                  <span className="px-2 py-0.5 bg-blue-50 text-xs text-blue-600 rounded-full font-medium">
                    {bodyTypeLabels[profile.bodyType] || profile.bodyType}
                  </span>
                )}
                {profile.skinTone && (
                  <span className="px-2 py-0.5 bg-orange-50 text-xs text-orange-600 rounded-full font-medium">
                    {skinToneLabels[profile.skinTone] || profile.skinTone}
                  </span>
                )}
                {profile.preference && (
                  <span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-500 rounded-full">
                    {preferenceLabels[profile.preference] || profile.preference}
                  </span>
                )}
              </div>
            </div>
            <button className="p-2.5 bg-white rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors">
              <Pencil size={16} className="text-gray-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Stats */}
      <section className="px-5 pb-5 animate-fade-up delay-100">
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: '总衣物', value: WARDROBE_STATS.totalItems, icon: '🧥' },
            { label: '本月穿搭', value: WARDROBE_STATS.monthOutfits, icon: '✨' },
            { label: '闲置衣物', value: WARDROBE_STATS.idleItems, icon: '⏰' },
            { label: '复用率', value: WARDROBE_STATS.reuseRate, icon: '🔄' },
          ].map(({ label, value, icon }) => (
            <div key={label} className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-center">
              <span className="text-lg mb-1 block">{icon}</span>
              <p className="text-xl font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* VIP */}
      <section className="px-5 pb-5 animate-fade-up delay-200">
        <button onClick={() => setShowVipModal(true)} className="w-full bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-5 text-white text-left card-hover">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Crown size={24} className="text-yellow-300" />
              <div>
                <p className="text-base font-bold">会员权益中心</p>
                <p className="text-xs opacity-70 mt-0.5">解锁高级搭配 · 深度数据分析</p>
              </div>
            </div>
            <ChevronRight size={18} className="opacity-50" />
          </div>
          <div className="mt-3 flex items-center gap-2">
            <span className="px-2 py-0.5 bg-white/15 rounded-full text-xs">25元/月</span>
            <span className="px-2 py-0.5 bg-yellow-400/20 text-yellow-200 rounded-full text-xs font-medium">年付198元 省50%</span>
          </div>
        </button>
      </section>

      {/* Settings */}
      <section className="px-5 pb-5 animate-fade-up delay-300">
        <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 space-y-2">
          {[
            { icon: Pencil, label: '个人资料修改', desc: '身材、肤色、穿搭偏好实时生效' },
            { icon: Cloud, label: '云端数据同步', desc: '跨设备同步，资产不丢失' },
            { icon: Trash2, label: '缓存清理', desc: '释放本地存储空间' },
            { icon: Shield, label: '隐私设置', desc: '穿搭记录默认私密' },
            { icon: MessageCircle, label: '帮助与反馈', desc: '问题反馈、功能建议' },
          ].map(({ icon: Icon, label, desc }) => (
            <button key={label} className="flex items-center gap-3 w-full p-2 hover:bg-gray-100 rounded-xl transition-colors">
              <div className="p-1.5 bg-white rounded-lg border border-gray-200"><Icon size={16} className="text-gray-500" /></div>
              <div className="flex-1"><p className="text-sm font-medium text-gray-700">{label}</p><p className="text-xs text-gray-400">{desc}</p></div>
              <ChevronRight size={14} className="text-gray-300" />
            </button>
          ))}

          <button onClick={() => setShowLogoutConfirm(true)} className="flex items-center gap-3 w-full p-2 hover:bg-orange-50 rounded-xl transition-colors">
            <div className="p-1.5 bg-orange-50 rounded-lg"><LogOut size={16} className="text-orange-500" /></div>
            <div className="flex-1"><p className="text-sm font-medium text-orange-600">退出登录</p></div>
          </button>
        </div>
      </section>

      {/* VIP Modal */}
      {showVipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowVipModal(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 animate-slide-in-right">
            <h2 className="text-lg font-bold text-gray-900 mb-1">会员权益对比</h2>
            <p className="text-sm text-gray-400 mb-5">清晰区分，自愿升级</p>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-sm font-bold text-gray-700 mb-2">免费权益</h3>
                <div className="space-y-1.5">
                  {FREE_FEATURES.map((f) => (
                    <div key={f} className="flex items-start gap-1.5"><span className="text-green-500 text-xs mt-0.5">✓</span><span className="text-xs text-gray-500">{f}</span></div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl p-4 text-white">
                <div className="flex items-center gap-1.5 mb-2"><Crown size={14} className="text-yellow-300" /><h3 className="text-sm font-bold">会员权益</h3></div>
                <div className="space-y-1.5">
                  {VIP_FEATURES.map((f) => (
                    <div key={f} className="flex items-start gap-1.5"><span className="text-yellow-300 text-xs mt-0.5">✓</span><span className="text-xs opacity-90">{f}</span></div>
                  ))}
                </div>
              </div>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3">
              <button className="py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-semibold">25元/月</button>
              <button className="py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">198元/年 ⭐</button>
            </div>
            <p className="mt-3 text-center text-xs text-gray-400">无强制付费 · 无广告 · 无带货</p>
          </div>
        </div>
      )}

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowLogoutConfirm(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[85%] max-w-sm p-6 animate-slide-in-right">
            <h2 className="text-lg font-bold text-gray-900 mb-2">确认退出登录？</h2>
            <p className="text-sm text-gray-400 mb-5">退出后云端数据保留，下次登录即可恢复。</p>
            <div className="flex gap-3">
              <button onClick={() => setShowLogoutConfirm(false)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium">取消</button>
              <button onClick={handleLogout} className="px-4 py-2.5 bg-orange-500 text-white rounded-xl text-sm font-semibold hover:bg-orange-600">确认退出</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}