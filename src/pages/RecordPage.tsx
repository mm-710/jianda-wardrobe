import { useState } from 'react'
import { Calendar, TrendingUp, BarChart3, ChevronRight, Lock } from 'lucide-react'

const MOCK_RECORDS = [
  { id: 'r1', date: '2026-05-24', scene: '通勤', style: '简约', items: ['奶油色针织开衫', '白色直筒裤', '奶油色乐福鞋'], rating: '舒适 · 显瘦', isPrivate: true, hasPhoto: false },
  { id: 'r2', date: '2026-05-23', scene: '约会', style: '温柔', items: ['碎花连衣裙', '白色帆布鞋', '金色耳链'], rating: '显高 · 温柔', isPrivate: true, hasPhoto: true },
  { id: 'r3', date: '2026-05-22', scene: '休闲', style: '轻松', items: ['牛仔外套', '条纹T恤', '卡其短裤', '帆布鞋'], rating: '舒适 · 休闲', isPrivate: false, hasPhoto: false },
  { id: 'r4', date: '2026-05-20', scene: '职场', style: '干练', items: ['黑色西装外套', '白色衬衫', '灰色阔腿裤', '尖头高跟鞋'], rating: '权威感 · 显气场', isPrivate: true, hasPhoto: true },
]

const MONTH_SUMMARY = { totalOutfits: 24, topStyle: '简约通勤', topItem: '奶油色针织开衫（穿了8次）', idleItems: 3, reuseRate: '68%' }

export default function RecordPage() {
  const [filterScene, setFilterScene] = useState<string | null>(null)
  const [showReport, setShowReport] = useState(false)

  return (
    <div className="max-w-lg mx-auto bg-white">
      <header className="px-5 pt-8 pb-4 animate-fade-up">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">穿搭记录</h1>
        <p className="text-sm text-gray-400 mt-1">沉淀你的专属穿搭体系</p>
      </header>

      {/* Month Summary */}
      <section className="px-5 pb-5 animate-fade-up delay-100">
        <div className="bg-blue-600 rounded-2xl p-5 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2"><Calendar size={16} /><span className="text-sm font-semibold">5月穿搭概览</span></div>
            <button onClick={() => setShowReport(true)} className="flex items-center gap-1 px-3 py-1.5 bg-white/15 rounded-xl text-sm font-medium hover:bg-white/25">
              <BarChart3 size={14} />月度复盘
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div><p className="text-2xl font-bold">{MONTH_SUMMARY.totalOutfits}</p><p className="text-xs opacity-70">次穿搭</p></div>
            <div><p className="text-2xl font-bold">{MONTH_SUMMARY.reuseRate}</p><p className="text-xs opacity-70">复用率</p></div>
            <div><p className="text-2xl font-bold">{MONTH_SUMMARY.idleItems}</p><p className="text-xs opacity-70">闲置单品</p></div>
          </div>
        </div>
      </section>

      {/* Scene Filter */}
      <section className="px-5 pb-4 animate-fade-up delay-200">
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-2">
          <button onClick={() => setFilterScene(null)} className={`px-3 py-1.5 rounded-xl text-sm font-medium ${filterScene === null ? 'bg-blue-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>全部</button>
          {['通勤', '约会', '休闲', '职场', '运动'].map((scene) => (
            <button key={scene} onClick={() => setFilterScene(scene)} className={`px-3 py-1.5 rounded-xl text-sm font-medium whitespace-nowrap ${filterScene === scene ? 'bg-blue-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>{scene}</button>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="px-5 pb-10 animate-fade-up delay-300">
        <div className="space-y-4">
          {MOCK_RECORDS.map((record) => (
            <div key={record.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 card-hover">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 bg-blue-50 rounded-full text-xs font-semibold text-blue-600">{record.scene}</span>
                  <span className="text-xs text-gray-400">{record.date}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {record.isPrivate && <Lock size={12} className="text-gray-300" />}
                  {record.hasPhoto && <span className="px-2 py-0.5 bg-orange-50 text-xs text-orange-600 rounded-full font-medium">有实拍</span>}
                </div>
              </div>
              <div className="flex gap-2 mb-3">
                {record.items.map((item, idx) => (
                  <div key={idx} className="flex-1 bg-gray-50 rounded-xl p-2.5 text-center border border-gray-100">
                    <div className="w-full aspect-square bg-gray-100 rounded-lg mb-1.5 flex items-center justify-center"><span className="font-handwritten text-base text-gray-300">{idx === 0 ? '衫' : idx === 1 ? '裤' : idx === 2 ? '鞋' : '饰'}</span></div>
                    <p className="text-xs text-gray-600 font-medium truncate">{item}</p>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1"><span className="text-xs text-blue-600 font-medium">{record.rating}</span><span className="px-2 py-0.5 bg-gray-100 text-xs text-gray-500 rounded-full">{record.style}</span></div>
                <button className="flex items-center gap-1 text-xs text-blue-600 font-medium hover:text-blue-700">详情<ChevronRight size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Report Modal */}
      {showReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in">
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setShowReport(false)} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-[90%] max-w-md p-6 animate-slide-in-right">
            <h2 className="text-lg font-bold text-gray-900 mb-4">5月穿搭复盘报告</h2>
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">穿搭频率分布</h3>
                <div className="space-y-2">
                  {[{ style: '简约通勤', count: 12, pct: 50 }, { style: '温柔约会', count: 6, pct: 25 }, { style: '休闲日常', count: 4, pct: 17 }, { style: '正式职场', count: 2, pct: 8 }].map(({ style, count, pct }) => (
                    <div key={style} className="flex items-center gap-2"><span className="text-xs text-gray-600 w-20">{style}</span><div className="flex-1 h-2 bg-gray-200 rounded-full"><div className="h-full bg-blue-600 rounded-full" style={{ width: `${pct}%` }} /></div><span className="text-xs text-gray-400">{count}次</span></div>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={() => setShowReport(false)} className="mt-5 w-full py-2.5 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">关闭报告</button>
            <p className="mt-3 text-center text-xs text-gray-400">📊 季度/年度深度报告为会员专属权益</p>
          </div>
        </div>
      )}
    </div>
  )
}