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
    <div className="max-w-lg mx-auto bg-white">
      {/* Header */}
      <header className="px-5 pt-8 pb-4 animate-fade-up">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">我的衣橱</h1>

        {/* Stats */}
        <div className="mt-3 grid grid-cols-4 gap-2">
          {[
            { label: '总衣物', value: stats.total },
            { label: '闲置', value: stats.idle },
            { label: '复用率', value: stats.reuseRate },
            { label: '本月穿搭', value: 24 },
          ].map(({ label, value }, idx) => (
            <div key={label} className={`bg-gray-50 rounded-xl p-3 border border-gray-100 text-center animate-fade-up delay-${idx * 100}`}>
              <p className="text-lg font-bold text-gray-900">{value}</p>
              <p className="text-xs text-gray-400">{label}</p>
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
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'
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
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl border border-gray-200 px-3 py-2.5">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            placeholder="搜索衣物名称..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="text-sm text-gray-900 placeholder-gray-400 bg-transparent outline-none flex-1"
          />
          <button className="p-1 hover:bg-gray-200 rounded-lg transition-colors">
            <Filter size={14} className="text-gray-400" />
          </button>
        </div>
      </section>

      {/* Item List */}
      <section className="px-5 pb-10 animate-fade-up delay-400">
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 card-hover">
              <div className="flex items-center gap-3">
                {/* Color swatch or uploaded image */}
                {item.imageUrl ? (
                  <div className="w-12 h-12 rounded-xl overflow-hidden border border-gray-200">
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center border border-gray-200"
                    style={{ backgroundColor: item.colorHex }}
                  >
                    <span className="font-handwritten text-sm text-gray-500/50">
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
                    <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                    {(item.status === '闲置' || item.status === '待清理') && (
                      <span className="px-2 py-0.5 text-xs bg-orange-50 text-orange-600 rounded-full font-medium">
                        {item.status === '闲置' ? '闲置' : '待清理'}
                      </span>
                    )}
                    {item.status === '新买未穿' && (
                      <span className="px-2 py-0.5 text-xs bg-blue-50 text-blue-600 rounded-full font-medium">
                        新品
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-400">{item.category}</span>
                    <span className="text-xs text-gray-400">· {item.color}</span>
                    <span className="text-xs text-gray-400">· {item.style}</span>
                  </div>
                </div>

                <button className="p-2 hover:bg-gray-50 rounded-xl transition-colors">
                  <span className="text-sm text-blue-600 font-medium">搭配 →</span>
                </button>
              </div>
            </div>
          ))}

          {filteredItems.length === 0 && (
            <div className="bg-gray-50 rounded-2xl p-8 text-center">
              <p className="text-base text-gray-400 mb-2">没有找到匹配的衣物</p>
              <button onClick={() => setShowUpload(true)} className="text-sm text-blue-600 font-medium">
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
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-all duration-300"
        >
          <Plus size={18} />
          <span className="text-sm font-semibold">添加衣物</span>
        </button>
      </div>

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