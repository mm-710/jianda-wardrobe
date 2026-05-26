import { useState, useRef } from 'react'
import { X, Camera, ImagePlus, Sparkles, Check, Trash2 } from 'lucide-react'

const CATEGORIES = ['上衣', '下装', '外套', '裙装', '鞋子', '配饰', '内衣家居']
const COLORS = [
  { id: 'white', name: '白色', hex: '#FFFFFF' },
  { id: 'black', name: '黑色', hex: '#1A1A1A' },
  { id: 'cream', name: '米白', hex: '#F5E6D3' },
  { id: 'beige', name: '卡其', hex: '#C8B88A' },
  { id: 'navy', name: '藏青', hex: '#1B3A5C' },
  { id: 'blue', name: '蓝色', hex: '#4A6FA5' },
  { id: 'gray', name: '灰色', hex: '#808080' },
  { id: 'brown', name: '棕色', hex: '#8B4513' },
  { id: 'red', name: '红色', hex: '#E74C3C' },
  { id: 'orange', name: '橙色', hex: '#FF8A65' },
  { id: 'pink', name: '粉色', hex: '#FFB7C5' },
  { id: 'green', name: '绿色', hex: '#2E5C55' },
  { id: 'yellow', name: '黄色', hex: '#F1C40F' },
  { id: 'purple', name: '紫色', hex: '#8E44AD' },
  { id: 'jeans', name: '牛仔蓝', hex: '#5B8DBE' },
  { id: 'camel', name: '驼色', hex: '#A67B5B' },
]
const STYLES = ['简约', '通勤', '甜酷', '休闲', '法式', '运动', '正式', '复古']
const SEASONS = ['春', '夏', '秋', '冬', '四季']
const STATUS_OPTIONS = ['常穿', '闲置', '待搭配', '待清理', '新买未穿']

interface ClothingItem {
  id: string
  name: string
  category: string
  color: string
  colorHex: string
  style: string
  season: string
  status: string
  imageUrl: string | null
  dateAdded: string
}

interface UploadModalProps {
  onClose: () => void
  onSave: (item: ClothingItem) => void
}

export default function UploadModal({ onClose, onSave }: UploadModalProps) {
  const [step, setStep] = useState<'upload' | 'recognizing' | 'edit' | 'duplicate'>('upload')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [formData, setFormData] = useState<ClothingItem>({
    id: '',
    name: '',
    category: '',
    color: '',
    colorHex: '',
    style: '',
    season: '四季',
    status: '新买未穿',
    imageUrl: null,
    dateAdded: new Date().toISOString().split('T')[0],
  })

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || !files[0]) return
    setSelectedImage(URL.createObjectURL(files[0]))
  }

  const startRecognition = () => {
    if (!selectedImage) return
    setStep('recognizing')
    setTimeout(() => {
      setFormData({
        ...formData,
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        color: COLORS[Math.floor(Math.random() * 5)].name,
        colorHex: COLORS[Math.floor(Math.random() * 5)].hex,
        style: STYLES[Math.floor(Math.random() * STYLES.length)],
        imageUrl: selectedImage,
        id: `item_${Date.now()}`,
      })
      setStep('edit')
    }, 2000)
  }

  const handleSave = () => {
    const hasDuplicate = formData.color === '白色' && formData.category === '上衣'
    if (hasDuplicate) {
      setStep('duplicate')
      return
    }
    onSave(formData)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl shadow-2xl overflow-hidden" style={{ maxHeight: '90vh' }}>
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">
            {step === 'upload' ? '添加衣物' : step === 'recognizing' ? 'AI识别中...' : step === 'edit' ? '编辑单品信息' : '相似单品提醒'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-xl transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          {step === 'upload' && (
            <div className="px-5 py-6 animate-fade-in">
              <div className="flex gap-3 mb-5">
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <Camera size={20} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">拍照上传</span>
                </button>
                <button onClick={() => fileInputRef.current?.click()} className="flex-1 flex items-center justify-center gap-2 py-4 bg-gray-50 rounded-2xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <ImagePlus size={20} className="text-blue-600" />
                  <span className="text-sm font-medium text-gray-700">相册选择</span>
                </button>
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={handleFileSelect} />

              {selectedImage && (
                <div className="mb-5 animate-fade-in">
                  <div className="relative w-48 h-48 mx-auto bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden">
                    <img src={selectedImage} alt="预览" className="w-full h-full object-cover" />
                    <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-lg hover:bg-white">
                      <Trash2 size={14} className="text-gray-600" />
                    </button>
                  </div>
                </div>
              )}

              {selectedImage && (
                <button onClick={startRecognition} className="w-full py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">
                  开始AI识别 <Sparkles size={16} className="inline ml-1" />
                </button>
              )}

              {!selectedImage && (
                <div className="bg-gray-50 rounded-2xl p-8 text-center border border-gray-100">
                  <ImagePlus size={32} className="text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">上传一件衣物照片，AI会自动识别分类</p>
                </div>
              )}
            </div>
          )}

          {step === 'recognizing' && (
            <div className="px-5 py-12 flex flex-col items-center animate-fade-in">
              <div className="w-48 h-48 mx-auto bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden mb-6 relative">
                <img src={selectedImage!} alt="识别中" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-blue-600/10 animate-pulse-soft flex items-center justify-center">
                  <Sparkles size={24} className="text-blue-600 animate-float" />
                </div>
              </div>
              <p className="text-base font-semibold text-gray-900 mb-2">AI正在识别...</p>
              <div className="mt-4 flex gap-1">
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse-soft" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse-soft delay-100" />
                <span className="w-2 h-2 bg-blue-600 rounded-full animate-pulse-soft delay-200" />
              </div>
            </div>
          )}

          {step === 'edit' && (
            <div className="px-5 py-4 animate-fade-in">
              <div className="w-32 h-32 mx-auto bg-gray-50 rounded-2xl border border-gray-200 overflow-hidden mb-4">
                <img src={formData.imageUrl!} alt="预览" className="w-full h-full object-cover" />
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">单品名称</label>
                <input type="text" placeholder="如：奶油色针织开衫" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full bg-gray-50 rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500" />
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">品类 · AI识别为「{formData.category}」</label>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                  {CATEGORIES.map((cat) => (
                    <button key={cat} onClick={() => setFormData({ ...formData, category: cat })} className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap ${formData.category === cat ? 'bg-blue-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{cat}</button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">颜色 · AI识别为「{formData.color}」</label>
                <div className="flex gap-2 flex-wrap">
                  {COLORS.map(({ id, name, hex }) => (
                    <button key={id} onClick={() => setFormData({ ...formData, color: name, colorHex: hex })} className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium ${formData.color === name ? 'bg-blue-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600'}`}>
                      <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: hex }} />{name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">风格 · AI识别为「{formData.style}」</label>
                <div className="flex gap-1.5 flex-wrap">
                  {STYLES.map((s) => (
                    <button key={s} onClick={() => setFormData({ ...formData, style: s })} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${formData.style === s ? 'bg-blue-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="mb-4">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">适用季节</label>
                <div className="flex gap-1.5">
                  {SEASONS.map((s) => (
                    <button key={s} onClick={() => setFormData({ ...formData, season: s })} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${formData.season === s ? 'bg-blue-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-medium text-gray-700 mb-1.5 block">衣物状态</label>
                <div className="flex gap-1.5 flex-wrap">
                  {STATUS_OPTIONS.map((s) => (
                    <button key={s} onClick={() => setFormData({ ...formData, status: s })} className={`px-3 py-1.5 rounded-xl text-xs font-medium ${formData.status === s ? 'bg-blue-600 text-white' : 'bg-gray-50 border border-gray-200 text-gray-600 hover:bg-gray-100'}`}>{s}</button>
                  ))}
                </div>
              </div>

              <button onClick={handleSave} disabled={!formData.name && !formData.category} className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${formData.name || formData.category ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-600/20' : 'bg-gray-100 text-gray-400'}`}>
                保存单品
              </button>
            </div>
          )}

          {step === 'duplicate' && (
            <div className="px-5 py-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">⚠️</span>
                <h3 className="text-base font-bold text-gray-900">防重复采购提醒</h3>
              </div>
              <p className="text-sm text-gray-400 mb-4">你的衣橱中已有相似单品，请确认是否保存：</p>

              <div className="grid grid-cols-2 gap-3 mb-5">
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-3">
                  <div className="w-full aspect-square bg-gray-100 rounded-xl mb-2 flex items-center justify-center"><span className="font-handwritten text-lg text-gray-400">衫</span></div>
                  <p className="text-xs font-semibold text-gray-700">白色衬衫</p>
                </div>
                <div className="bg-gray-50 rounded-2xl border border-gray-200 p-3">
                  <div className="w-full aspect-square bg-gray-100 rounded-xl mb-2 flex items-center justify-center overflow-hidden">{formData.imageUrl && <img src={formData.imageUrl} className="w-full h-full object-cover" />}</div>
                  <p className="text-xs font-semibold text-gray-700">{formData.name || '新单品'}</p>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={handleSave} className="flex-1 py-3 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700">保留单品</button>
                <button onClick={onClose} className="flex-1 py-3 bg-gray-50 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-100">放弃保存</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}