import { useState } from 'react'
import { Plus, AlertTriangle, Search, Filter } from 'lucide-react'
import { useWardrobeStore } from '@/store/wardrobeStore'
import UploadModal from '@/components/UploadModal'

const CATEGORY_FILTERS = [
  { id: '', name: '全部' },
  { id: '上衣', name: '上衣' },
  { id: '下装', name: '下装' },
  { id: '外套', name: '外套' },
  { id: '裙装', name: '裙装' },
  { id: '鞋子', name: '鞋子' },
  { id: '配饰', name: '配饰' },
  { id: '内衣家居', name: '内衣家居' },
]

export default function WardrobePage() {
  const { items, addItem, getCategoryCounts, getStats } = useWardrobeStore()
  const [activeCategory, setActiveCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showUpload, setShowUpload] = useState(false)

  const stats = getStats()
  const categoryCounts = getCategoryCounts()

  const filteredItems = items.filter((item) => {
    const matchCategory = activeCategory === '' || item.category === activeCategory
    const matchSearch = searchQuery === '' || item.name.includes(searchQuery)
    return matchCategory && matchSearch
  })

  return (
    <div className="max-w-lg mx-auto gradient-mesh">
      {/* Header */}
      <header className="px-5 pt-8 pb-4 animate-fade-up">
        <h1 className="text-xl font-bold text-ink tracking-tight">我的衣橱</h1>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { label: '总衣物', value: stats.total },
            { label: '闲置', value: stats.idle },
            { label: '复用率', value: stats.reuseRate },
            { label: '本月穿搭', value: 24 },
          ].map(({ label, value }, idx) => (
            <div key={label} className={`bg-white rounded-xl p-3 ring-1 ring-sand/30 text-center animate-fade-up delay-${idx * 100}`}>
              <p className="text-lg font-bold text-ink">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </header>

      {/* Category Filter */}
      <section className="px-5 pb-4 animate-fade-up delay-200">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {CATEGORY_FILTERS.map(({ id, name }) => (
            <button
              key={id}
              onClick={() => setActiveCategory(id)}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === id
                  ? 'bg-forest text-white shadow-sm'
                  : 'bg-white ring-1 ring-sand/30 text-ink hover:bg-forest/5'
              }`}
            >
              {name}
              {id && ` · ${categoryCounts[id] || 0}`}
            </button>
          ))}
        </div>
      </section>

      {/* Search */}
      <section className="px-5 pb-4 animate-fade-up delay-300">
        <div className="flex items-center gap-2 bg-white rounded-xl ring-1 ring-sand/30 px-3 py-2.5">
          <Search size={16} className="text-muted-foreground" />
          <input
            type="text"
            placeholder="搜索衣物名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm text-ink placeholder-muted-foreground bg-transparent outline-none flex-1"
          />
          <button className="p-1 hover:bg-sand/20 rounded-lg transition-colors">
            <Filter size={14} className="text-muted-foreground" />
          </button>
        </div>
      </section>

      {/* Item List */}
      <section className="px-5 pb-10 animate-fade-up delay-400">
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl ring-1 ring-sand/30 p-4 outfit-card-lift">
              <div className="flex items-center gap-3">
                {/* Color swatch or uploaded image */}
                {item.imageUrl ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden ring-1 ring-sand/20">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center ring-1 ring-sand/20"
                    style={{ backgroundColor: item.colorHex }}
                  >
                    <span className="font-handwritten text-sm text-ink/50">
                      {item.category === '上衣' ? '衫' :
                       item.category === '下装' ? '裤' :
                       item.category === '外套' ? '衣' :
                       item.category === '裙装' ? '裙' :
                       item.category === '鞋子' ? '鞋' :
                       item.category === '配饰' ? '饰' : '衣'}
                    </span>
                  </div>
                )}

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-ink truncate">{item.name}</p>
                    {(item.status === '闲置' || item.status === '待清理') && (
                      <span className="px-2 py-0.5 text-xs bg-coral/15 text-coral rounded-full font-medium">
                        {item.status === '闲置' ? '闲置' : '待清理'}
                      </span>
                    )}
                    {item.status === '新买未穿' && (
                      <span className="px-2 py-0.5 text-xs bg-forest/10 text-forest rounded-full font-medium">
                        新品
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                    <span className="text-xs text-muted-foreground">· {item.color}</span>
                    <span className="text-xs text-muted-foreground">· {item.style}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      item.status === '常穿' ? 'bg-forest/10 text-forest' :
                      item.status === '闲置' ? 'bg-coral/10 text-coral' :
                      'bg-sand/40 text-ink/60'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                </div>

                <button className="p-2 hover:bg-forest/5 rounded-xl transition-colors">
                  <span className="font-handwritten text-sm text-forest">搭配 →</span>
                </button>
              </div>

              {/* Idle item action */}
              {(item.status === '闲置' || item.status === '待搭配') && (
                <div className="mt-3 pt-3 border-t border-sand/20">
                  <button className="flex items-center gap-1 text-xs text-forest font-medium">
                    <span className="text-xs">✨</span>
                    为这件闲置单品生成新搭配
                  </button>
                </div>
              )}
            </div>
          ))}

          {/* Empty state */}
          {filteredItems.length === 0 && (
            <div className="bg-sand/20 rounded-2xl p-8 text-center">
              <p className="text-base text-muted-foreground mb-2">没有找到匹配的衣物</p>
              <button onClick={() => setShowUpload(true)} className="text-sm text-forest font-medium">
                添加一件 →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Upload Button */}
      <div className="fixed bottom-[80px] right-4 max-w-lg z-40">
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 px-5 py-3 bg-forest text-white rounded-2xl shadow-lg shadow-forest/20 hover:bg-forest-deep transition-all duration-300"
        >
          <Plus size={18} />
          <span className="text-sm font-semibold">添加衣物</span>
        </button>
      </div>

      {/* Upload Modal */}
      {showUpload && (
        <UploadModal
          onClose={() => setShowUpload(false)}
          onSave={(item) => {
            addItem(item)
            setShowUpload(false)
          }}
          onDuplicateCheck={() => {}}
        />
      )}
    </div>
  )
}