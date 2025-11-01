// Data service

export interface DataPoint {
  label: string
  value: number
  category: string
  date: Date
}

export class DataService {
  private categories = ["Electronics", "Clothing", "Food", "Books"]

  // 🟣 Sinh dữ liệu ngẫu nhiên
  generateMockData(count = 8): DataPoint[] {
    const data: DataPoint[] = []
    const now = new Date()
    for (let i = 0; i < count; i++) {
      const cat = this.categories[Math.floor(Math.random() * this.categories.length)]
      data.push({
        label: `Item ${i + 1}`,
        value: Math.floor(Math.random() * 100) + 10,
        category: cat,
        date: new Date(now.getTime() - i * 24 * 60 * 60 * 1000)
      })
    }
    return data.reverse()
  }

  // 🟣 Giả lập real-time update
  simulateRealtime(callback: (data: DataPoint[]) => void, interval = 3000) {
    let current = this.generateMockData()
    callback(current)
    setInterval(() => {
  // Create a small random variation on the current data
      current = current.map(p => ({
        ...p,
        value: Math.max(5, p.value + (Math.random() * 20 - 10))
      }))
      callback([...current])
    }, interval)
  }

  // 🟣 Lọc dữ liệu theo category hoặc date range
  filterData(data: DataPoint[], category?: string, from?: Date, to?: Date): DataPoint[] {
    return data.filter(d => {
      const catOk = !category || d.category === category
      const fromOk = !from || d.date >= from
      const toOk = !to || d.date <= to
      return catOk && fromOk && toOk
    })
  }
}
