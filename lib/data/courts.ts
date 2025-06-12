// Dados mock para quadras
export interface Court {
  id: string
  name: string
  description: string
  address: string
  neighborhood: string
  sports: string[]
  price: number
  images: string[]
  amenities: string[]
  organizerId: string
  organizerName: string
  rating: number
  totalReviews: number
  latitude: number
  longitude: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Reservation {
  id: string
  courtId: string
  courtName: string
  userId: string
  userName: string
  userEmail: string
  date: string
  startTime: string
  endTime: string
  duration: number
  totalPrice: number
  sport: string
  status: "confirmed" | "pending" | "cancelled"
  createdAt: string
  notes?: string
}

// Dados mock de quadras do organizador
export const mockCourts: Court[] = [
  {
    id: "1",
    name: "Quadra Poliesportiva Central",
    description: "Quadra coberta com excelente estrutura para diversos esportes",
    address: "Av. Principal, 123 - Centro",
    neighborhood: "Centro",
    sports: ["Futebol", "Basquete", "Vôlei"],
    price: 80,
    images: ["/images/features/map-courts.png"],
    amenities: ["Vestiário", "Estacionamento", "Iluminação LED", "Arquibancada"],
    organizerId: "org1",
    organizerName: "João Silva",
    rating: 4.5,
    totalReviews: 120,
    latitude: -23.5505,
    longitude: -46.6333,
    isActive: true,
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    name: "Arena Esportiva Premium",
    description: "Complexo esportivo moderno com múltiplas quadras",
    address: "Rua dos Esportes, 456 - Vila Olímpica",
    neighborhood: "Vila Olímpica",
    sports: ["Tênis", "Padel", "Squash"],
    price: 120,
    images: ["/images/features/competition.png"],
    amenities: ["Vestiário Premium", "Lanchonete", "Wi-Fi", "Ar Condicionado"],
    organizerId: "org1",
    organizerName: "João Silva",
    rating: 4.8,
    totalReviews: 85,
    latitude: -23.5605,
    longitude: -46.6433,
    isActive: true,
    createdAt: "2024-02-01",
    updatedAt: "2024-02-01",
  },
]

// Dados mock de reservas
export const mockReservations: Reservation[] = [
  {
    id: "res1",
    courtId: "1",
    courtName: "Quadra Poliesportiva Central",
    userId: "user1",
    userName: "Carlos Silva",
    userEmail: "carlos@email.com",
    date: "2025-06-12",
    startTime: "21:00",
    endTime: "22:30",
    duration: 1.5,
    totalPrice: 120,
    sport: "Futebol",
    status: "confirmed",
    createdAt: "2024-12-10",
    notes: "Jogo entre amigos",
  },
  {
    id: "res2",
    courtId: "1",
    courtName: "Quadra Poliesportiva Central",
    userId: "user2",
    userName: "Ana Oliveira",
    userEmail: "ana@email.com",
    date: "2025-06-12",
    startTime: "19:00",
    endTime: "20:30",
    duration: 1.5,
    totalPrice: 120,
    sport: "Basquete",
    status: "confirmed",
    createdAt: "2024-12-11",
  },
  {
    id: "res3",
    courtId: "2",
    courtName: "Arena Esportiva Premium",
    userId: "user3",
    userName: "Pedro Santos",
    userEmail: "pedro@email.com",
    date: "2025-06-12",
    startTime: "17:00",
    endTime: "18:30",
    duration: 1.5,
    totalPrice: 180,
    sport: "Tênis",
    status: "pending",
    createdAt: "2025-06-10",
  },
  {
    id: "res4",
    courtId: "1",
    courtName: "Quadra Poliesportiva Central",
    userId: "user4",
    userName: "Mariana Costa",
    userEmail: "mariana@email.com",
    date: "2025-06-12",
    startTime: "13:00",
    endTime: "14:30",
    duration: 1.5,
    totalPrice: 120,
    sport: "Vôlei",
    status: "confirmed",
    createdAt: "2024-12-12",
  },
]

// Funções para simular API
export const getCourts = (organizerId: string): Court[] => {
  return mockCourts.filter((court) => court.organizerId === organizerId)
}

export const getReservations = (organizerId: string): Reservation[] => {
  const organizerCourts = getCourts(organizerId)
  const courtIds = organizerCourts.map((court) => court.id)
  return mockReservations.filter((reservation) => courtIds.includes(reservation.courtId))
}

export const addCourt = (court: Omit<Court, "id" | "createdAt" | "updatedAt">): Court => {
  const newCourt: Court = {
    ...court,
    id: `court_${Date.now()}`,
    createdAt: new Date().toISOString().split("T")[0],
    updatedAt: new Date().toISOString().split("T")[0],
  }
  mockCourts.push(newCourt)
  return newCourt
}

export const updateCourt = (id: string, updates: Partial<Court>): Court | null => {
  const index = mockCourts.findIndex((court) => court.id === id)
  if (index === -1) return null

  mockCourts[index] = {
    ...mockCourts[index],
    ...updates,
    updatedAt: new Date().toISOString().split("T")[0],
  }
  return mockCourts[index]
}

export const deleteCourt = (id: string): boolean => {
  const index = mockCourts.findIndex((court) => court.id === id)
  if (index === -1) return false

  mockCourts.splice(index, 1)
  return true
}
