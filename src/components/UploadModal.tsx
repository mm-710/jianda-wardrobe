import { useState, useRef } from 'react'
import { X, Camera, ImagePlus, Sparkles, Check, ChevronRight, Trash2 } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

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
  onDuplicateCheck: (item: ClothingItem) => void
}

export default function UploadModal({ onClose, onSave, onDuplicateCheck }: UploadModalProps) {
  const [step, setStep] = useState<'upload' | 'recognizing' | 'edit' | 'duplicate'>('upload')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [batchImages, setBatchImages] = useState<string[]>([])
  const [isBatch, setIsBatch] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const batchInputRef = useRef<HTMLInputElement>(null)

  // Form state
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
    if (!files) return

    if (isBatch) {
      const urls: string[] = []
      Array.from(files).slice(0, 20).forEach((file) => {
        const url = URL.createObjectURL(file)
        urls.push(url)
      })
      setBatchImages(urls)
      // Start with first image for editing
      setSelectedImage(urls[0])
    } else {
      const file = files[0]
      setSelectedImage(URL.createObjectURL(file))
    }
  }

  const startRecognition = () => {
    if (!selectedImage) return
    setStep('recognizing')

    // Mock AI recognition - 2s delay
    setTimeout(() => {
      const mockRecognition = {
        category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
        color: COLORS[Math.floor(Math.random() * 5)].name,
        colorHex: COLORS[Math.floor(Math.random() * 5)].hex,
        name: '',
        style: STYLES[Math.floor(Math.random() * STYLES.length)],
        season: '四季',
      }
      setFormData({
        ...formData,
        ...mockRecognition,
        imageUrl: selectedImage,
        id: `item_${Date.now()}`,
      })
      setStep('edit')
    }, 2000)
  }

  const handleSave = () => {
    if (!formData.name && !formData.category) return

    // Mock duplicate check
    const hasDuplicate = formData.color === '白色' && formData.category === '上衣'
    if (hasDuplicate) {
      setStep('duplicate')
      return
    }

    onSave(formData)
    onClose()
  }

  const handleDuplicateKeep = () => {
    onSave(formData)
    onClose()
  }

  const handleDuplicateDiscard = () => {
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center animate-fade-in">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-cream rounded-t-3xl shadow-2xl overflow-hidden" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-sand/30">
          <h2 className="text-lg font-bold text-ink">
            {step === 'upload' ? '添加衣物' : step === 'recognizing' ? 'AI识别中...' : step === 'edit' ? '编辑单品信息' : '相似单品提醒'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-sand/20 rounded-xl transition-colors">
            <X size={20} className="text-muted-foreground" />
          </button>
        </div>

        <div className="overflow-y-auto scrollbar-hide" style={{ maxHeight: 'calc(90vh - 60px)' }}>
          {/* Step 1: Upload */}
          {step === 'upload' && (
            <div className="px-5 py-6 animate-fade-in">
              {/* Mode toggle */}
              <div className="flex gap-2 mb-5">
                <button
                  onClick={() => setIsBatch(false)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    !isBatch ? 'bg-forest text-white' : 'bg-white ring-1 ring-sand/30 text-ink'
                  }`}
                >
                  单件上传
                </button>
                <button
                  onClick={() => setIsBatch(true)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isBatch ? 'bg-forest text-white' : 'bg-white ring-1 ring-sand/30 text-ink'
                  }`}
                >
                  批量上传 (≤20)
                </button>
              </div>

              {/* Upload buttons */}
              <div className="flex gap-3 mb-5">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-white rounded-2xl ring-1 ring-sand/30 hover:bg-forest/5 transition-colors"
                >
                  <Camera size={20} className="text-forest" />
                  <span className="text-sm font-medium text-ink">拍照上传</span>
                </button>
                <button
                  onClick={() => isBatch ? batchInputRef.current?.click() : fileInputRef.current?.click()}
                  className="flex-1 flex items-center justify-center gap-2 py-4 bg-white rounded-2xl ring-1 ring-sand/30 hover:bg-forest/5 transition-colors"
                >
                  <ImagePlus size={20} className="text-forest" />
                  <span className="text-sm font-medium text-ink">从相册选择</span>
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFileSelect}
              />
              <input
                ref={batchInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Preview area */}
              {selectedImage && (
                <div className="mb-5 animate-fade-in">
                  <div className="relative w-48 h-48 mx-auto bg-white rounded-2xl ring-1 ring-sand/30 overflow-hidden">
                    <img src={selectedImage} alt="预览" className="w-full h-full object-cover" />
                    <button
                      onClick={() => { setSelectedImage(null); setBatchImages([]) }}
                      className="absolute top-2 right-2 p-1.5 bg-white/80 rounded-lg hover:bg-white transition-colors"
                    >
                      <Trash2 size={14} className="text-ink" />
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground text-center mt-2">
                    AI将自动识别品类、颜色、风格属性
                  </p>
                </div>
              )}

              {/* Batch preview thumbnails */}
              {isBatch && batchImages.length > 0 && (
                <div className="mb-5 animate-fade-in">
                  <p className="text-sm font-medium text-ink mb-2">
                    已选择 {batchImages.length} 件衣物
                  </p>
                  <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                    {batchImages.map((url, idx) => (
                      <div
                        key={idx}
                        onClick={() => setSelectedImage(url)}
                        className={`w-16 h-16 rounded-xl overflow-hidden ring-2 transition-all ${
                          selectedImage === url ? 'ring-forest' : 'ring-sand/30'
                        }`}
                      >
                        <img src={url} alt={`衣物${idx + 1}`} className="w-full h-full object-cover" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Next button */}
              {selectedImage && (
                <button
                  onClick={startRecognition}
                  className="w-full py-3 bg-forest text-white rounded-xl text-sm font-semibold hover:bg-forest-deep transition-colors shadow-md shadow-forest/20"
                >
                  开始AI识别
                  <Sparkles size={16} className="inline ml-1" />
                </button>
              )}

              {/* No image hint */}
              {!selectedImage && (
                <div className="bg-sand/20 rounded-2xl p-8 text-center">
                  <ImagePlus size={32} className="text-muted-foreground mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">上传一张衣物照片，AI会自动帮你识别分类</p>
                  <p className="text-xs text-muted-foreground mt-1">支持拍照或从相册选择</p>
                </div>
              )}
            </div>
          )}

          {/* Step 2: AI Recognizing */}
          {step === 'recognizing' && (
            <div className="px-5 py-12 flex flex-col items-center animate-fade-in">
              <div className="w-48 h-48 mx-auto bg-white rounded-2xl ring-1 ring-sand/30 overflow-hidden mb-6 relative">
                <img src={selectedImage!} alt="识别中" className="w-full h-full object-cover" />
                {/* Scanning overlay */}
                <div className="absolute inset-0 bg-forest/10 animate-pulse-soft flex items-center justify-center">
                  <Sparkles size={24} className="text-forest animate-float" />
                </div>
              </div>
              <p className="text-base font-semibold text-ink mb-2">AI正在识别...</p>
              <p className="text-sm text-muted-foreground">自动识别品类、颜色、风格、季节属性</p>
              <div className="mt-4 flex gap-1">
                <span className="w-2 h-2 bg-forest rounded-full animate-pulse-soft" />
                <span className="w-2 h-2 bg-forest rounded-full animate-pulse-soft delay-100" />
                <span className="w-2 h-2 bg-forest rounded-full animate-pulse-soft delay-200" />
              </div>
            </div>
          )}

          {/* Step 3: Edit form */}
          {step === 'edit' && (
            <div className="px-5 py-4 animate-fade-in">
              {/* Image preview */}
              <div className="w-32 h-32 mx-auto bg-white rounded-2xl ring-1 ring-sand/30 overflow-hidden mb-4">
                <img src={formData.imageUrl!} alt="预览" className="w-full h-full object-cover" />
              </div>

              {/* AI recognized badge */}
              <div className="flex items-center justify-center gap-2 mb-5">
                <div className="px-3 py-1.5 bg-forest/10 rounded-full flex items-center gap-1.5">
                  <Sparkles size={12} className="text-forest" />
                  <span className="text-xs font-semibold text-forest">AI已自动识别以下属性</span>
                </div>
              </div>

              {/* Name */}
              <div className="mb-4">
                <label className="text-xs font-medium text-ink mb-1.5 block">单品名称</label>
                <input
                  type="text"
                  placeholder="如：奶油色针织开衫"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white rounded-xl ring-1 ring-sand/30 px-4 py-2.5 text-sm text-ink placeholder-muted-foreground outline-none focus:ring-forest/50 transition-all"
                />
              </div>

              {/* Category */}
              <div className="mb-4">
                <label className="text-xs font-medium text-ink mb-1.5 block">品类 · AI识别为「{formData.category}」</label>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setFormData({ ...formData, category: cat })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        formData.category === cat
                          ? 'bg-forest text-white'
                          : 'bg-white ring-1 ring-sand/30 text-ink hover:bg-forest/5'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Color */}
              <div className="mb-4">
                <label className="text-xs font-medium text-ink mb-1.5 block">颜色 · AI识别为「{formData.color}」</label>
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
                  {COLORS.map(({ id, name, hex }) => (
                    <button
                      key={id}
                      onClick={() => setFormData({ ...formData, color: name, colorHex: hex })}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        formData.color === name
                          ? 'bg-forest text-white ring-0'
                          : 'bg-white ring-1 ring-sand/30 text-ink'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full ring-1 ring-sand/30" style={{ backgroundColor: hex }} />
                      {name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Style */}
              <div className="mb-4">
                <label className="text-xs font-medium text-ink mb-1.5 block">风格 · AI识别为「{formData.style}」</label>
                <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
                  {STYLES.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormData({ ...formData, style: s })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                        formData.style === s
                          ? 'bg-forest text-white'
                          : 'bg-white ring-1 ring-sand/30 text-ink hover:bg-forest/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Season */}
              <div className="mb-4">
                <label className="text-xs font-medium text-ink mb-1.5 block">适用季节</label>
                <div className="flex gap-1.5">
                  {SEASONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormData({ ...formData, season: s })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        formData.season === s
                          ? 'bg-forest text-white'
                          : 'bg-white ring-1 ring-sand/30 text-ink hover:bg-forest/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Status */}
              <div className="mb-6">
                <label className="text-xs font-medium text-ink mb-1.5 block">衣物状态</label>
                <div className="flex gap-1.5">
                  {STATUS_OPTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => setFormData({ ...formData, status: s })}
                      className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                        formData.status === s
                          ? 'bg-forest text-white'
                          : 'bg-white ring-1 ring-sand/30 text-ink hover:bg-forest/5'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Save button */}
              <button
                onClick={handleSave}
                disabled={!formData.name && !formData.category}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all ${
                  formData.name || formData.category
                    ? 'bg-forest text-white hover:bg-forest-deep shadow-md shadow-forest/20'
                    : 'bg-sand/30 text-muted-foreground'
                }`}
              >
                保存单品
              </button>
            </div>
          )}

          {/* Step 4: Duplicate check */}
          {step === 'duplicate' && (
            <div className="px-5 py-6 animate-fade-in">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-coral text-lg">⚠️</span>
                <h3 className="text-base font-bold text-ink">防重复采购提醒</h3>
              </div>

              <p className="text-sm text-muted-foreground mb-4">
                你的衣橱中已有相似单品，请确认是否要保存这件新衣物：
              </p>

              {/* Comparison cards */}
              <div className="grid grid-cols-2 gap-3 mb-6">
                {/* Existing item */}
                <div className="bg-white rounded-2xl ring-1 ring-sand/30 p-3">
                  <div className="w-full aspect-square bg-cream rounded-xl mb-2 flex items-center justify-center">
                    <span className="font-handwritten text-lg text-forest/40">衫</span>
                  </div>
                  <p className="text-xs font-semibold text-ink">白色衬衫</p>
                  <p className="text-xs text-muted-foreground">上衣 · 常穿</p>
                </div>

                {/* New item */}
                <div className="bg-white rounded-2xl ring-1 ring-coral/30 p-3">
                  <div className="w-full aspect-square bg-cream rounded-xl mb-2 flex items-center justify-center overflow-hidden">
                    {formData.imageUrl && <img src={formData.imageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <p className="text-xs font-semibold text-ink">{formData.name || '新单品'}</p>
                  <p className="text-xs text-muted-foreground">{formData.category} · {formData.color}</p>
                </div>
              </div>

              {/* Similarity score */}
              <div className="bg-coral/10 rounded-xl p-3 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-ink font-medium">相似度</span>
                  <span className="text-sm text-coral font-bold">78%</span>
                </div>
                <div className="h-2 bg-coral/20 rounded-full mt-2 overflow-hidden">
                  <div className="h-full bg-coral rounded-full" style={{ width: '78%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  两件单品品类和颜色相近，可能存在功能重叠
                </p>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleDuplicateKeep}
                  className="flex-1 py-3 bg-forest text-white rounded-xl text-sm font-semibold hover:bg-forest-deep transition-colors"
                >
                  保留单品
                </button>
                <button
                  onClick={handleDuplicateDiscard}
                  className="flex-1 py-3 bg-white ring-1 ring-sand/30 text-ink rounded-xl text-sm font-medium hover:bg-sand/20 transition-colors"
                >
                  放弃保存
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}