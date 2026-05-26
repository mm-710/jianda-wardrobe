import { X, Briefcase, GraduationCap, Heart, ShoppingBag, Dumbbell, Wine } from 'lucide-react'

const SCENES = [
  { id: 'work', name: '职场通勤', icon: Briefcase, desc: '专业干练，权威感十足' },
  { id: 'school', name: '学生上课', icon: GraduationCap, desc: '青春活力，舒适为主' },
  { id: 'date', name: '约会出游', icon: Heart, desc: '精致温柔，魅力加分' },
  { id: 'shopping', name: '休闲逛街', icon: ShoppingBag, desc: '轻松自在，个性表达' },
  { id: 'sport', name: '运动健身', icon: Dumbbell, desc: '功能优先，活力清爽' },
  { id: 'formal', name: '正式宴会', icon: Wine, desc: '优雅隆重，气场全开' },
]

interface SceneSelectorProps {
  onClose: () => void
  onSelect: (scene: string) => void
}

export default function SceneSelector({ onClose, onSelect }: SceneSelectorProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl p-6 pb-10">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-gray-900">选择穿搭场景</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {SCENES.map(({ id, name, icon: Icon, desc }) => (
            <button
              key={id}
              onClick={() => onSelect(id)}
              className="flex flex-col items-center gap-2 p-4 bg-gray-50 rounded-2xl border border-gray-100 card-hover"
            >
              <div className="p-2 bg-blue-50 rounded-xl">
                <Icon size={22} className="text-blue-600" />
              </div>
              <span className="text-sm font-semibold text-gray-700">{name}</span>
              <span className="text-xs text-gray-400 text-center">{desc}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}