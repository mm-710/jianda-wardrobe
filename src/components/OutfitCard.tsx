import { Bookmark, ChevronRight, Sparkles } from 'lucide-react'

interface Outfit {
  id: string
  name: string
  items: string[]
  matchScore: number
  reason: string
  tags: string[]
}

export default function OutfitCard({ outfit }: { outfit: Outfit }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden card-hover">
      {/* Header */}
      <div className="flex items-center justify-between px-4 pt-4 pb-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 rounded-full">
            <Sparkles size={12} className="text-blue-600" />
            <span className="text-xs font-bold text-blue-600">{outfit.matchScore}%适配</span>
          </div>
          <h3 className="text-base font-bold text-gray-900">{outfit.name}</h3>
        </div>
        <button className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors">
          <Bookmark size={16} className="text-gray-300 hover:text-blue-600" />
        </button>
      </div>

      {/* Items row */}
      <div className="px-4 py-3">
        <div className="flex gap-2.5">
          {outfit.items.map((item, idx) => (
            <div
              key={idx}
              className="flex-1 bg-gray-50 rounded-xl p-3 text-center border border-gray-100"
            >
              <div className="w-full aspect-square bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                <span className="font-handwritten text-lg text-gray-400">
                  {idx === 0 ? '衫' : idx === 1 ? '裤' : idx === 2 ? '鞋' : '饰'}
                </span>
              </div>
              <p className="text-xs text-gray-600 font-medium truncate">{item}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Reason */}
      <div className="px-4 pb-3">
        <p className="text-xs text-gray-400 leading-relaxed">{outfit.reason}</p>
      </div>

      {/* Tags & Actions */}
      <div className="px-4 pb-4 flex items-center justify-between">
        <div className="flex gap-1.5">
          {outfit.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 text-xs bg-gray-100 text-gray-500 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
          一键记录
          <ChevronRight size={14} />
        </button>
      </div>
    </div>
  )
}