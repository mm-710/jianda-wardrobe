import { create } from 'zustand'
import { persist } from 'zustand/middleware'

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

interface WardrobeState {
  items: ClothingItem[]
  addItem: (item: ClothingItem) => void
  removeItem: (id: string) => void
  updateItem: (id: string, updates: Partial<ClothingItem>) => void
  getItemById: (id: string) => ClothingItem | undefined
  getItemsByCategory: (category: string) => ClothingItem[]
  getIdleItems: () => ClothingItem[]
  getCategoryCounts: () => Record<string, number>
  getStats: () => { total: number; idle: number; reuseRate: string }
}

const MOCK_ITEMS: ClothingItem[] = [
  { id: 'm1', name: '奶油色针织开衫', category: '上衣', color: '米白', colorHex: '#F5E6D3', style: '简约', season: '四季', status: '常穿', imageUrl: null, dateAdded: '2026-04-10' },
  { id: 'm2', name: '黑色西装外套', category: '外套', color: '黑色', colorHex: '#1A1A1A', style: '通勤', season: '四季', status: '常穿', imageUrl: null, dateAdded: '2026-03-15' },
  { id: 'm3', name: '紧身牛仔裤', category: '下装', color: '牛仔蓝', colorHex: '#5B8DBE', style: '休闲', season: '四季', status: '常穿', imageUrl: null, dateAdded: '2026-02-20' },
  { id: 'm4', name: '条纹T恤', category: '上衣', color: '白色', colorHex: '#FFFFFF', style: '休闲', season: '夏', status: '闲置', imageUrl: null, dateAdded: '2026-01-05' },
  { id: 'm5', name: '白色直筒裤', category: '下装', color: '白色', colorHex: '#FFFFFF', style: '简约', season: '四季', status: '常穿', imageUrl: null, dateAdded: '2026-04-01' },
  { id: 'm6', name: '碎花连衣裙', category: '裙装', color: '粉色', colorHex: '#FFB7C5', style: '法式', season: '春', status: '闲置', imageUrl: null, dateAdded: '2025-09-20' },
  { id: 'm7', name: '奶油色乐福鞋', category: '鞋子', color: '米白', colorHex: '#F5E6D3', style: '简约', season: '四季', status: '常穿', imageUrl: null, dateAdded: '2026-03-01' },
  { id: 'm8', name: '金色耳链', category: '配饰', color: '棕色', colorHex: '#8B4513', style: '简约', season: '四季', status: '常穿', imageUrl: null, dateAdded: '2026-04-05' },
  { id: 'm9', name: '灰色阔腿裤', category: '下装', color: '灰色', colorHex: '#808080', style: '通勤', season: '四季', status: '常穿', imageUrl: null, dateAdded: '2026-03-10' },
  { id: 'm10', name: '卡其短裤', category: '下装', color: '卡其', colorHex: '#C8B88A', style: '休闲', season: '夏', status: '常穿', imageUrl: null, dateAdded: '2026-05-01' },
  { id: 'm11', name: '牛仔外套', category: '外套', color: '牛仔蓝', colorHex: '#5B8DBE', style: '休闲', season: '春', status: '常穿', imageUrl: null, dateAdded: '2026-04-15' },
  { id: 'm12', name: '帆布鞋', category: '鞋子', color: '白色', colorHex: '#FFFFFF', style: '休闲', season: '四季', status: '常穿', imageUrl: null, dateAdded: '2026-02-10' },
]

export const useWardrobeStore = create<WardrobeState>()(
  persist(
    (set, get) => ({
      items: MOCK_ITEMS,

      addItem: (item) => set((state) => ({ items: [...state.items, item] })),

      removeItem: (id) => set((state) => ({ items: state.items.filter((i) => i.id !== id) })),

      updateItem: (id, updates) =>
        set((state) => ({
          items: state.items.map((i) => i.id === id ? { ...i, ...updates } : i),
        })),

      getItemById: (id) => get().items.find((i) => i.id === id),

      getItemsByCategory: (category) => get().items.filter((i) => i.category === category),

      getIdleItems: () => get().items.filter((i) => i.status === '闲置' || i.status === '待清理'),

      getCategoryCounts: () => {
        const counts: Record<string, number> = {}
        get().items.forEach((i) => {
          counts[i.category] = (counts[i.category] || 0) + 1
        })
        return counts
      },

      getStats: () => {
        const items = get().items
        const idle = items.filter((i) => i.status === '闲置' || i.status === '待清理').length
        const total = items.length
        return {
          total,
          idle,
          reuseRate: `${Math.round(((total - idle) / total) * 100)}%`,
        }
      },
    }),
    {
      name: 'jianda-wardrobe',
    }
  )
)