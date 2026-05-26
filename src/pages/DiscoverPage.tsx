import { useState } from 'react'
import { Palette, Ruler, BookOpen, Leaf, ChevronRight, Heart, Share2 } from 'lucide-react'

const CATEGORIES = [
  { id: 'body', name: '身材穿搭', icon: Ruler },
  { id: 'scene', name: '场景模板', icon: BookOpen },
  { id: 'color', name: '色彩干货', icon: Palette },
  { id: 'minimal', name: '衣橱思维', icon: Leaf },
]

const MOCK_CONTENT: Record<string, Array<{ id: string; title: string; desc: string; tags: string[]; likes: number; isUGC: boolean }>> = {
  body: [
    { id: 'b1', title: '梨形身材穿搭避坑指南', desc: '避开紧身下装，用A字裙平衡比例。5个实穿公式，从通勤到约会全覆盖。', tags: ['梨形', '避坑', '显瘦'], likes: 238, isUGC: false },
    { id: 'b2', title: 'H型身材怎么穿出曲线感', desc: '收腰+层次叠穿，让直板身材也有曲线。3套穿搭模板直接复刻。', tags: ['H型', '曲线', '收腰'], likes: 156, isUGC: false },
  ],
  scene: [
    { id: 's1', title: '职场通勤5分钟穿搭公式', desc: '西装+衬衫+阔腿裤，3套公式覆盖从周一到周五，不再纠结穿什么。', tags: ['通勤', '职场', '公式'], likes: 312, isUGC: false },
    { id: 's2', title: '约会穿搭：从咖啡馆到晚餐厅', desc: '温柔针织→精致连衣裙→优雅小礼服，三个场景无缝切换。', tags: ['约会', '温柔', '精致'], likes: 267, isUGC: false },
  ],
  color: [
    { id: 'c1', title: '暖皮肤色配色圣经', desc: '大地色系、奶油白、暖橘是你的安全牌。附24色适配对照表。', tags: ['暖皮', '配色', '大地色'], likes: 421, isUGC: false },
    { id: 'c2', title: '同色系穿搭：高级感的秘密', desc: '不是全穿一个颜色，而是用3个相邻色阶制造层次感。', tags: ['同色系', '高级感', '层次'], likes: 298, isUGC: false },
  ],
  minimal: [
    { id: 'm1', title: '胶囊衣橱：30件衣服穿一整年', desc: '按场景+季节精选30件核心单品，每件至少3种搭配方式。', tags: ['胶囊衣橱', '极简', '复用'], likes: 534, isUGC: false },
    { id: 'm2', title: '断舍离穿搭：少即是多', desc: '不是扔衣服，而是留下真正适合你的。用数据判断哪些该走。', tags: ['断舍离', '精简', '数据'], likes: 189, isUGC: false },
  ],
}

export default function DiscoverPage() {
  const [activeCategory, setActiveCategory] = useState('body')
  const content = MOCK_CONTENT[activeCategory] || []

  return (
    <div className="max-w-lg mx-auto bg-white">
      <header className="px-5 pt-8 pb-3 animate-fade-up">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">发现精选</h1>
        <p className="text-sm text-gray-400 mt-1">干货穿搭教程 · 无带货 · 无种草</p>
      </header>

      {/* Category Tabs */}
      <section className="px-5 pb-5 animate-fade-up delay-100">
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map(({ id, name, icon: Icon }) => (
            <button key={id} onClick={() => setActiveCategory(id)} className={`flex flex-col items-center gap-1.5 py-3 rounded-xl transition-all ${activeCategory === id ? 'bg-blue-600 text-white shadow-sm scale-105' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>
              <Icon size={18} /><span className="text-xs font-medium">{name}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Content List */}
      <section className="px-5 pb-10">
        <div className="space-y-4">
          {content.map((item, idx) => (
            <div key={item.id} className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover animate-fade-up delay-${(idx + 1) * 100}`}>
              <div className={`h-32 bg-gradient-to-br ${activeCategory === 'body' ? 'from-blue-50 to-blue-100' : activeCategory === 'scene' ? 'from-orange-50 to-orange-100' : activeCategory === 'color' ? 'from-purple-50 to-purple-100' : 'from-green-50 to-green-100'} flex items-center justify-center`}>
                <span className="font-handwritten text-2xl text-gray-300">{activeCategory === 'body' ? '身材' : activeCategory === 'scene' ? '场景' : activeCategory === 'color' ? '色彩' : '衣橱'}</span>
              </div>
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  {item.isUGC && <span className="px-2 py-0.5 bg-orange-50 text-xs text-orange-600 rounded-full font-medium">用户分享</span>}
                  <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed mb-3">{item.desc}</p>
                <div className="flex items-center justify-between">
                  <div className="flex gap-1.5">
                    {item.tags.map((tag) => (<span key={tag} className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full">{tag}</span>))}
                  </div>
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors"><Heart size={14} />{item.likes}</button>
                    <button className="p-1.5 hover:bg-gray-100 rounded-lg"><Share2 size={14} className="text-gray-400" /></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Guarantee */}
      <section className="px-5 pb-8">
        <div className="bg-gray-50 rounded-2xl p-4 text-center">
          <p className="text-xs text-gray-400">🛡️ 发现页内容100%无商品导购 · 无带货种草 · 纯干货穿搭知识</p>
        </div>
      </section>
    </div>
  )
}