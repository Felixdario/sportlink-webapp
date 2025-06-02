"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Search,
  Send,
  Paperclip,
  ImageIcon,
  Smile,
  MoreVertical,
  Phone,
  Video,
  Info,
  Users,
  Plus,
  UserPlus,
  BellOff,
  Trash,
  LogOut,
  Check,
  Filter,
  ArrowLeft,
  Mic,
} from "lucide-react"

// Tipos para as mensagens e conversas
type Message = {
  id: number
  senderId: number
  text: string
  timestamp: Date
  status: "sent" | "delivered" | "read"
  attachments?: { type: string; url: string }[]
}

type Conversation = {
  id: number
  type: "individual" | "group"
  name: string
  avatar?: string
  participants: {
    id: number
    name: string
    avatar?: string
    status?: "online" | "offline" | "away"
  }[]
  lastMessage?: {
    text: string
    timestamp: Date
    senderId: number
  }
  unreadCount: number
  isOnline?: boolean
  isTyping?: boolean
}

export default function MensagensPage() {
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState("todas")
  const [searchQuery, setSearchQuery] = useState("")
  const [activeConversation, setActiveConversation] = useState<number | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [showNewGroupDialog, setShowNewGroupDialog] = useState(false)
  const [newGroupName, setNewGroupName] = useState("")
  const [selectedContacts, setSelectedContacts] = useState<number[]>([])
  const [isMobileView, setIsMobileView] = useState(false)
  const [showConversationList, setShowConversationList] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Dados simulados
  const currentUserId = 1
  const [conversations, setConversations] = useState<Conversation[]>([
    {
      id: 1,
      type: "individual",
      name: "Carlos Silva",
      avatar: "/placeholder.svg?height=40&width=40&text=CS",
      participants: [
        { id: 1, name: "Você", avatar: "/placeholder.svg?height=40&width=40&text=VC" },
        { id: 2, name: "Carlos Silva", avatar: "/placeholder.svg?height=40&width=40&text=CS", status: "online" },
      ],
      lastMessage: {
        text: "Vamos treinar hoje à tarde?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        senderId: 2,
      },
      unreadCount: 1,
      isOnline: true,
    },
    {
      id: 2,
      type: "group",
      name: "Time de Basquete",
      avatar: "/placeholder.svg?height=40&width=40&text=TB",
      participants: [
        { id: 1, name: "Você", avatar: "/placeholder.svg?height=40&width=40&text=VC" },
        { id: 2, name: "Carlos Silva", avatar: "/placeholder.svg?height=40&width=40&text=CS", status: "online" },
        { id: 3, name: "Ana Oliveira", avatar: "/placeholder.svg?height=40&width=40&text=AO", status: "offline" },
        { id: 4, name: "Pedro Santos", avatar: "/placeholder.svg?height=40&width=40&text=PS", status: "away" },
      ],
      lastMessage: {
        text: "Treino confirmado para amanhã às 18h",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        senderId: 1,
      },
      unreadCount: 0,
    },
    {
      id: 3,
      type: "individual",
      name: "Ana Oliveira",
      avatar: "/placeholder.svg?height=40&width=40&text=AO",
      participants: [
        { id: 1, name: "Você", avatar: "/placeholder.svg?height=40&width=40&text=VC" },
        { id: 3, name: "Ana Oliveira", avatar: "/placeholder.svg?height=40&width=40&text=AO", status: "offline" },
      ],
      lastMessage: {
        text: "Obrigada pelo convite para o jogo!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        senderId: 3,
      },
      unreadCount: 0,
      isOnline: false,
    },
    {
      id: 4,
      type: "group",
      name: "Torneio Regional",
      avatar: "/placeholder.svg?height=40&width=40&text=TR",
      participants: [
        { id: 1, name: "Você", avatar: "/placeholder.svg?height=40&width=40&text=VC" },
        { id: 2, name: "Carlos Silva", avatar: "/placeholder.svg?height=40&width=40&text=CS", status: "online" },
        { id: 3, name: "Ana Oliveira", avatar: "/placeholder.svg?height=40&width=40&text=AO", status: "offline" },
        { id: 4, name: "Pedro Santos", avatar: "/placeholder.svg?height=40&width=40&text=PS", status: "away" },
        { id: 5, name: "Mariana Costa", avatar: "/placeholder.svg?height=40&width=40&text=MC", status: "online" },
      ],
      lastMessage: {
        text: "As inscrições para o torneio encerram amanhã!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        senderId: 5,
      },
      unreadCount: 3,
    },
    {
      id: 5,
      type: "individual",
      name: "Pedro Santos",
      avatar: "/placeholder.svg?height=40&width=40&text=PS",
      participants: [
        { id: 1, name: "Você", avatar: "/placeholder.svg?height=40&width=40&text=VC" },
        { id: 4, name: "Pedro Santos", avatar: "/placeholder.svg?height=40&width=40&text=PS", status: "away" },
      ],
      lastMessage: {
        text: "Você viu o resultado do jogo de ontem?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        senderId: 4,
      },
      unreadCount: 0,
      isOnline: true,
      isTyping: true,
    },
  ])

  const [messages, setMessages] = useState<Record<number, Message[]>>({
    1: [
      {
        id: 1,
        senderId: 2,
        text: "Olá! Tudo bem com você?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60),
        status: "read",
      },
      {
        id: 2,
        senderId: 1,
        text: "Oi Carlos! Tudo ótimo, e com você?",
        timestamp: new Date(Date.now() - 1000 * 60 * 55),
        status: "read",
      },
      {
        id: 3,
        senderId: 2,
        text: "Estou bem também! Estou organizando um treino para hoje à tarde. Você consegue participar?",
        timestamp: new Date(Date.now() - 1000 * 60 * 50),
        status: "read",
      },
      {
        id: 4,
        senderId: 1,
        text: "Claro! Que horas seria?",
        timestamp: new Date(Date.now() - 1000 * 60 * 45),
        status: "read",
      },
      {
        id: 5,
        senderId: 2,
        text: "Estou pensando em começar às 16h. O que acha?",
        timestamp: new Date(Date.now() - 1000 * 60 * 40),
        status: "read",
      },
      {
        id: 6,
        senderId: 1,
        text: "Perfeito para mim! Onde será o treino?",
        timestamp: new Date(Date.now() - 1000 * 60 * 35),
        status: "read",
      },
      {
        id: 7,
        senderId: 2,
        text: "Na quadra do Complexo Esportivo Municipal. Vou reservar para nós.",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: "read",
      },
      {
        id: 8,
        senderId: 1,
        text: "Ótimo! Vou levar algumas bolas extras.",
        timestamp: new Date(Date.now() - 1000 * 60 * 25),
        status: "read",
      },
      {
        id: 9,
        senderId: 2,
        text: "Perfeito! Também estou chamando mais algumas pessoas. Acho que seremos uns 8 no total.",
        timestamp: new Date(Date.now() - 1000 * 60 * 20),
        status: "read",
      },
      {
        id: 10,
        senderId: 1,
        text: "Excelente! Vai dar para fazer um bom treino.",
        timestamp: new Date(Date.now() - 1000 * 60 * 15),
        status: "read",
      },
      {
        id: 11,
        senderId: 2,
        text: "Com certeza! Depois podemos combinar de participar daquele torneio que conversamos.",
        timestamp: new Date(Date.now() - 1000 * 60 * 10),
        status: "read",
      },
      {
        id: 12,
        senderId: 2,
        text: "Vamos treinar hoje à tarde?",
        timestamp: new Date(Date.now() - 1000 * 60 * 5),
        status: "delivered",
      },
    ],
    2: [
      {
        id: 1,
        senderId: 1,
        text: "Pessoal, criei este grupo para organizarmos nossos treinos de basquete!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: "read",
      },
      {
        id: 2,
        senderId: 2,
        text: "Ótima ideia! Vai facilitar muito a comunicação.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.9),
        status: "read",
      },
      {
        id: 3,
        senderId: 3,
        text: "Estou dentro! Quais dias vocês preferem treinar?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.8),
        status: "read",
      },
      {
        id: 4,
        senderId: 4,
        text: "Para mim, terças e quintas à noite são melhores.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.7),
        status: "read",
      },
      {
        id: 5,
        senderId: 2,
        text: "Também funciona para mim. E aos sábados de manhã?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.6),
        status: "read",
      },
      {
        id: 6,
        senderId: 1,
        text: "Sábados são ótimos! Podemos fazer um treino mais longo.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.5),
        status: "read",
      },
      {
        id: 7,
        senderId: 3,
        text: "Concordo! E onde serão os treinos?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.4),
        status: "read",
      },
      {
        id: 8,
        senderId: 1,
        text: "Podemos alternar entre a quadra do Complexo Esportivo Municipal e a do Ginásio Municipal.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.3),
        status: "read",
      },
      {
        id: 9,
        senderId: 4,
        text: "Perfeito! Vamos começar quando?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.2),
        status: "read",
      },
      {
        id: 10,
        senderId: 1,
        text: "Que tal começarmos já nesta terça-feira? Às 19h?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1.1),
        status: "read",
      },
      {
        id: 11,
        senderId: 2,
        text: "Estou dentro!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 1),
        status: "read",
      },
      {
        id: 12,
        senderId: 3,
        text: "Eu também!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 0.9),
        status: "read",
      },
      {
        id: 13,
        senderId: 4,
        text: "Confirmado!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 0.8),
        status: "read",
      },
      {
        id: 14,
        senderId: 1,
        text: "Ótimo! Vou reservar a quadra.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 0.7),
        status: "read",
      },
      {
        id: 15,
        senderId: 2,
        text: "Alguém pode levar bolas extras?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 0.6),
        status: "read",
      },
      {
        id: 16,
        senderId: 1,
        text: "Eu levo duas bolas.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 0.5),
        status: "read",
      },
      {
        id: 17,
        senderId: 4,
        text: "Posso levar mais uma.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 0.4),
        status: "read",
      },
      {
        id: 18,
        senderId: 3,
        text: "Vou levar água para todos!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 0.3),
        status: "read",
      },
      {
        id: 19,
        senderId: 2,
        text: "Perfeito! Vai ser um ótimo treino.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 0.2),
        status: "read",
      },
      {
        id: 20,
        senderId: 1,
        text: "Treino confirmado para amanhã às 18h",
        timestamp: new Date(Date.now() - 1000 * 60 * 30),
        status: "delivered",
      },
    ],
    3: [
      {
        id: 1,
        senderId: 1,
        text: "Oi Ana! Tudo bem?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        status: "read",
      },
      {
        id: 2,
        senderId: 3,
        text: "Oi! Tudo ótimo, e com você?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.9),
        status: "read",
      },
      {
        id: 3,
        senderId: 1,
        text: "Estou bem! Estamos organizando um jogo amistoso no próximo sábado. Você gostaria de participar?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.8),
        status: "read",
      },
      {
        id: 4,
        senderId: 3,
        text: "Claro! Adoraria! Que horas será?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.7),
        status: "read",
      },
      {
        id: 5,
        senderId: 1,
        text: "Às 10h da manhã, na quadra do Complexo Esportivo Municipal.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.6),
        status: "read",
      },
      {
        id: 6,
        senderId: 3,
        text: "Perfeito! Estarei lá. Quem mais vai participar?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.5),
        status: "read",
      },
      {
        id: 7,
        senderId: 1,
        text: "Por enquanto, confirmados são eu, você, Carlos, Pedro e mais alguns amigos do Carlos.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.4),
        status: "read",
      },
      {
        id: 8,
        senderId: 3,
        text: "Ótimo! Vai ser divertido. Preciso levar algo?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.3),
        status: "read",
      },
      {
        id: 9,
        senderId: 1,
        text: "Apenas sua roupa esportiva e água. Vamos levar as bolas e coletes.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.2),
        status: "read",
      },
      {
        id: 10,
        senderId: 3,
        text: "Perfeito! Estou ansiosa para o jogo!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4.1),
        status: "read",
      },
      {
        id: 11,
        senderId: 1,
        text: "Nós também! Depois podemos almoçar juntos, o que acha?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 4),
        status: "read",
      },
      {
        id: 12,
        senderId: 3,
        text: "Ótima ideia! Conheço um restaurante próximo que é muito bom.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.9),
        status: "read",
      },
      {
        id: 13,
        senderId: 1,
        text: "Perfeito então! Nos vemos no sábado!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.8),
        status: "read",
      },
      {
        id: 14,
        senderId: 3,
        text: "Combinado! Até lá!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3.7),
        status: "read",
      },
      {
        id: 15,
        senderId: 3,
        text: "Obrigada pelo convite para o jogo!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
        status: "read",
      },
    ],
    4: [
      {
        id: 1,
        senderId: 5,
        text: "Olá a todos! Criei este grupo para compartilhar informações sobre o Torneio Regional de Basquete.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        status: "read",
      },
      {
        id: 2,
        senderId: 2,
        text: "Ótimo! Quando começam as inscrições?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.9),
        status: "read",
      },
      {
        id: 3,
        senderId: 5,
        text: "As inscrições já estão abertas e vão até o final da semana que vem.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.8),
        status: "read",
      },
      {
        id: 4,
        senderId: 1,
        text: "Quais são as categorias disponíveis?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.7),
        status: "read",
      },
      {
        id: 5,
        senderId: 5,
        text: "Temos categorias masculina, feminina e mista, todas para maiores de 18 anos.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.6),
        status: "read",
      },
      {
        id: 6,
        senderId: 3,
        text: "Qual é o valor da inscrição?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.5),
        status: "read",
      },
      {
        id: 7,
        senderId: 5,
        text: "R$ 200 por equipe, com mínimo de 5 e máximo de 10 jogadores.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.4),
        status: "read",
      },
      {
        id: 8,
        senderId: 4,
        text: "E quando será o torneio?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.3),
        status: "read",
      },
      {
        id: 9,
        senderId: 5,
        text: "O torneio acontecerá nos dias 15 e 16 do próximo mês, no Ginásio Municipal.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.2),
        status: "read",
      },
      {
        id: 10,
        senderId: 2,
        text: "Quais são os prêmios?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1.1),
        status: "read",
      },
      {
        id: 11,
        senderId: 5,
        text: "1º lugar: R$ 2.000 + troféu e medalhas\n2º lugar: R$ 1.000 + medalhas\n3º lugar: R$ 500 + medalhas",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 1),
        status: "read",
      },
      {
        id: 12,
        senderId: 1,
        text: "Ótimo! Vamos montar nossa equipe então!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.9),
        status: "read",
      },
      {
        id: 13,
        senderId: 3,
        text: "Estou dentro!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.8),
        status: "read",
      },
      {
        id: 14,
        senderId: 4,
        text: "Eu também!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.7),
        status: "read",
      },
      {
        id: 15,
        senderId: 2,
        text: "Vamos precisar de mais jogadores. Alguém conhece mais pessoas?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.6),
        status: "read",
      },
      {
        id: 16,
        senderId: 1,
        text: "Posso chamar mais 2 amigos que jogam bem.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.5),
        status: "read",
      },
      {
        id: 17,
        senderId: 3,
        text: "Tenho uma amiga que joga muito bem também!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.4),
        status: "read",
      },
      {
        id: 18,
        senderId: 5,
        text: "Ótimo! Quando tiverem a equipe completa, me avisem para fazer a inscrição.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.3),
        status: "read",
      },
      {
        id: 19,
        senderId: 1,
        text: "Perfeito! Vamos organizar isso o quanto antes.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 0.2),
        status: "read",
      },
      {
        id: 20,
        senderId: 5,
        text: "As inscrições para o torneio encerram amanhã!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 5),
        status: "delivered",
      },
    ],
    5: [
      {
        id: 1,
        senderId: 4,
        text: "Oi! Tudo bem?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
        status: "read",
      },
      {
        id: 2,
        senderId: 1,
        text: "Oi Pedro! Tudo ótimo, e com você?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.9),
        status: "read",
      },
      {
        id: 3,
        senderId: 4,
        text: "Estou bem! Você assistiu ao jogo da NBA ontem à noite?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.8),
        status: "read",
      },
      {
        id: 4,
        senderId: 1,
        text: "Não consegui assistir. Como foi?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.7),
        status: "read",
      },
      {
        id: 5,
        senderId: 4,
        text: "Foi incrível! O jogo foi decidido no último segundo com uma cesta de três pontos!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.6),
        status: "read",
      },
      {
        id: 6,
        senderId: 1,
        text: "Nossa! Que pena que perdi. Vou tentar assistir aos melhores momentos hoje.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.5),
        status: "read",
      },
      {
        id: 7,
        senderId: 4,
        text: "Vale a pena! Foi um dos melhores jogos da temporada até agora.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.4),
        status: "read",
      },
      {
        id: 8,
        senderId: 1,
        text: "Vou assistir com certeza! Você vai treinar hoje?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.3),
        status: "read",
      },
      {
        id: 9,
        senderId: 4,
        text: "Sim, estarei no treino às 19h. Você vai?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.2),
        status: "read",
      },
      {
        id: 10,
        senderId: 1,
        text: "Vou sim! Nos encontramos lá então.",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47.1),
        status: "read",
      },
      {
        id: 11,
        senderId: 4,
        text: "Perfeito! Até mais tarde!",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 47),
        status: "read",
      },
      {
        id: 12,
        senderId: 4,
        text: "Você viu o resultado do jogo de ontem?",
        timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
        status: "read",
      },
    ],
  })

  // Lista de contatos para adicionar a grupos
  const contacts = [
    { id: 2, name: "Carlos Silva", avatar: "/placeholder.svg?height=40&width=40&text=CS", status: "online" },
    { id: 3, name: "Ana Oliveira", avatar: "/placeholder.svg?height=40&width=40&text=AO", status: "offline" },
    { id: 4, name: "Pedro Santos", avatar: "/placeholder.svg?height=40&width=40&text=PS", status: "away" },
    { id: 5, name: "Mariana Costa", avatar: "/placeholder.svg?height=40&width=40&text=MC", status: "online" },
    { id: 6, name: "Lucas Mendes", avatar: "/placeholder.svg?height=40&width=40&text=LM", status: "offline" },
    { id: 7, name: "Juliana Alves", avatar: "/placeholder.svg?height=40&width=40&text=JA", status: "online" },
    { id: 8, name: "Roberto Gomes", avatar: "/placeholder.svg?height=40&width=40&text=RG", status: "away" },
    { id: 9, name: "Fernanda Lima", avatar: "/placeholder.svg?height=40&width=40&text=FL", status: "online" },
  ]

  // Efeito para verificar o tamanho da tela
  useEffect(() => {
    setMounted(true)
    const checkScreenSize = () => {
      setIsMobileView(window.innerWidth < 768)
    }
    checkScreenSize()
    window.addEventListener("resize", checkScreenSize)
    return () => window.removeEventListener("resize", checkScreenSize)
  }, [])

  // Efeito para rolar para a última mensagem
  useEffect(() => {
    if (activeConversation) {
      // Pequeno atraso para garantir que o componente esteja renderizado
      const timer = setTimeout(() => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior: "auto" })
        }
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [activeConversation, messages])

  // Efeito adicional para rolar quando novas mensagens são adicionadas
  useEffect(() => {
    if (messagesEndRef.current && activeConversation) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages])

  // Filtrar conversas com base na pesquisa e na aba ativa
  const filteredConversations = conversations.filter((conversation) => {
    const matchesSearch = searchQuery ? conversation.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
    const matchesTab =
      activeTab === "todas"
        ? true
        : activeTab === "grupos"
          ? conversation.type === "group"
          : activeTab === "diretas"
            ? conversation.type === "individual"
            : activeTab === "nao-lidas"
              ? conversation.unreadCount > 0
              : true
    return matchesSearch && matchesTab
  })

  // Obter a conversa ativa
  const currentConversation = conversations.find((conv) => conv.id === activeConversation)

  // Função para enviar mensagem
  const handleSendMessage = () => {
    if (!newMessage.trim() || !activeConversation) return

    const newMessageObj: Message = {
      id: messages[activeConversation].length + 1,
      senderId: currentUserId,
      text: newMessage,
      timestamp: new Date(),
      status: "sent",
    }

    // Atualizar mensagens
    setMessages((prev) => ({
      ...prev,
      [activeConversation]: [...prev[activeConversation], newMessageObj],
    }))

    // Atualizar última mensagem na conversa
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === activeConversation) {
          return {
            ...conv,
            lastMessage: {
              text: newMessage,
              timestamp: new Date(),
              senderId: currentUserId,
            },
          }
        }
        return conv
      }),
    )

    // Limpar campo de mensagem
    setNewMessage("")

    // Simular resposta após alguns segundos
    if (activeConversation === 1) {
      setTimeout(() => {
        const responseMessage: Message = {
          id: messages[activeConversation].length + 2,
          senderId: 2,
          text: "Sim, vamos! Te encontro lá às 16h.",
          timestamp: new Date(),
          status: "delivered",
        }

        setMessages((prev) => ({
          ...prev,
          [activeConversation]: [...prev[activeConversation], responseMessage],
        }))

        setConversations((prev) =>
          prev.map((conv) => {
            if (conv.id === activeConversation) {
              return {
                ...conv,
                lastMessage: {
                  text: "Sim, vamos! Te encontro lá às 16h.",
                  timestamp: new Date(),
                  senderId: 2,
                },
                unreadCount: conv.unreadCount + 1,
              }
            }
            return conv
          }),
        )
      }, 3000)
    }
  }

  // Função para criar novo grupo
  const handleCreateGroup = () => {
    if (!newGroupName.trim() || selectedContacts.length === 0) return

    const newGroupId = Math.max(...conversations.map((c) => c.id)) + 1
    const participants = [
      { id: currentUserId, name: "Você", avatar: "/placeholder.svg?height=40&width=40&text=VC" },
      ...contacts
        .filter((contact) => selectedContacts.includes(contact.id))
        .map((contact) => ({
          id: contact.id,
          name: contact.name,
          avatar: contact.avatar,
          status: contact.status as "online" | "offline" | "away" | undefined,
        })),
    ]

    const newGroup: Conversation = {
      id: newGroupId,
      type: "group",
      name: newGroupName,
      avatar: `/placeholder.svg?height=40&width=40&text=${newGroupName.substring(0, 2).toUpperCase()}`,
      participants,
      unreadCount: 0,
    }

    // Adicionar novo grupo às conversas
    setConversations((prev) => [newGroup, ...prev])

    // Inicializar mensagens do grupo
    setMessages((prev) => ({
      ...prev,
      [newGroupId]: [
        {
          id: 1,
          senderId: currentUserId,
          text: `Grupo "${newGroupName}" criado.`,
          timestamp: new Date(),
          status: "delivered",
        },
      ],
    }))

    // Limpar formulário
    setNewGroupName("")
    setSelectedContacts([])
    setShowNewGroupDialog(false)

    // Ativar a nova conversa
    setActiveConversation(newGroupId)
  }

  // Função para formatar timestamp
  const formatMessageTime = (date: Date) => {
    const now = new Date()
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))

    if (diffInDays === 0) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    } else if (diffInDays === 1) {
      return "Ontem"
    } else if (diffInDays < 7) {
      const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"]
      return days[date.getDay()]
    } else {
      return date.toLocaleDateString()
    }
  }

  // Função para alternar entre lista de conversas e mensagens no mobile
  const toggleConversationView = () => {
    setShowConversationList(!showConversationList)
  }

  // Função para marcar mensagens como lidas
  const markAsRead = (conversationId: number) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          return {
            ...conv,
            unreadCount: 0,
          }
        }
        return conv
      }),
    )
  }

  if (!mounted) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex flex-col h-full rounded-lg  border border-border shadow-lg relative">
        {/* Gradiente de fundo */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-sportlink/5 via-rose-500/5 to-transparent pointer-events-none"></div>

        <div className="flex h-full relative z-10">
          {(showConversationList || !isMobileView) && (
            <div className="w-full md:w-80 lg:w-96 border-r border-border bg-card/80 backdrop-blur-sm">
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold">Mensagens</h2>
                  <Dialog open={showNewGroupDialog} onOpenChange={setShowNewGroupDialog}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="bg-gradient-to-r from-primary-sportlink to-rose-500">
                        <Plus className="h-4 w-4 mr-1" />
                        Novo Grupo
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar novo grupo</DialogTitle>
                        <DialogDescription>
                          Crie um grupo para sua equipe ou para organizar um evento esportivo.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 py-4">
                        <div className="space-y-2">
                          <Label htmlFor="group-name">Nome do grupo</Label>
                          <Input
                            id="group-name"
                            placeholder="Ex: Time de Basquete"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Adicionar participantes</Label>
                          <div className="max-h-60 overflow-y-auto space-y-2 border rounded-md p-2">
                            {contacts.map((contact) => (
                              <div key={contact.id} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`contact-${contact.id}`}
                                  checked={selectedContacts.includes(contact.id)}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedContacts((prev) => [...prev, contact.id])
                                    } else {
                                      setSelectedContacts((prev) => prev.filter((id) => id !== contact.id))
                                    }
                                  }}
                                />
                                <Label htmlFor={`contact-${contact.id}`} className="flex items-center cursor-pointer">
                                  <Avatar className="h-8 w-8 mr-2">
                                    <AvatarImage src={contact.avatar || "/placeholder.svg"} alt={contact.name} />
                                    <AvatarFallback>
                                      {contact.name
                                        .split(" ")
                                        .map((n) => n[0])
                                        .join("")}
                                    </AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <span className="font-medium">{contact.name}</span>
                                    <div className="flex items-center">
                                      <div
                                        className={`h-2 w-2 rounded-full mr-1 ${
                                          contact.status === "online"
                                            ? "bg-green-500"
                                            : contact.status === "away"
                                              ? "bg-yellow-500"
                                              : "bg-gray-400"
                                        }`}
                                      ></div>
                                      <span className="text-xs text-muted-foreground">
                                        {contact.status === "online"
                                          ? "Online"
                                          : contact.status === "away"
                                            ? "Ausente"
                                            : "Offline"}
                                      </span>
                                    </div>
                                  </div>
                                </Label>
                              </div>
                            ))}
                          </div>
                          {selectedContacts.length > 0 && (
                            <div className="text-sm text-muted-foreground">
                              {selectedContacts.length} participante(s) selecionado(s)
                            </div>
                          )}
                        </div>
                      </div>
                      <DialogFooter>
                        <Button variant="outline" onClick={() => setShowNewGroupDialog(false)}>
                          Cancelar
                        </Button>
                        <Button
                          onClick={handleCreateGroup}
                          disabled={!newGroupName.trim() || selectedContacts.length === 0}
                          className="bg-gradient-to-r from-primary-sportlink to-rose-500"
                        >
                          Criar Grupo
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Buscar conversas..."
                    className="pl-9"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-4">
                  <TabsList className="grid grid-cols-4 w-full">
                    <TabsTrigger value="todas">Todas</TabsTrigger>
                    <TabsTrigger value="grupos">Grupos</TabsTrigger>
                    <TabsTrigger value="diretas">Diretas</TabsTrigger>
                    <TabsTrigger value="nao-lidas" className="relative">
                      Não lidas
                      {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0) > 0 && (
                        <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center bg-primary-sportlink text-white">
                          {conversations.reduce((acc, conv) => acc + conv.unreadCount, 0)}
                        </Badge>
                      )}
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <ScrollArea className="h-[calc(100%-8.5rem)]">
                <div className="p-2">
                  {filteredConversations.length > 0 ? (
                    filteredConversations.map((conversation) => (
                      <div
                        key={conversation.id}
                        className={`p-3 rounded-lg mb-2 cursor-pointer transition-colors ${
                          activeConversation === conversation.id
                            ? "bg-gradient-to-r from-primary-sportlink/20 to-rose-500/20"
                            : "hover:bg-muted"
                        }`}
                        onClick={() => {
                          setActiveConversation(conversation.id)
                          markAsRead(conversation.id)
                          if (isMobileView) {
                            toggleConversationView()
                          }
                        }}
                      >
                        <div className="flex items-center">
                          <div className="relative">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={conversation.avatar || "/placeholder.svg"} alt={conversation.name} />
                              <AvatarFallback>
                                {conversation.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {conversation.type === "individual" && conversation.isOnline && (
                              <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></div>
                            )}
                            {conversation.type === "group" && (
                              <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-primary-sportlink/20 backdrop-blur-sm flex items-center justify-center border border-background">
                                <Users className="h-3 w-3 text-primary-sportlink" />
                              </div>
                            )}
                          </div>
                          <div className="ml-3 flex-1 overflow-hidden">
                            <div className="flex items-center justify-between">
                              <h3 className="font-medium truncate">{conversation.name}</h3>
                              {conversation.lastMessage && (
                                <span className="text-xs text-muted-foreground">
                                  {formatMessageTime(conversation.lastMessage.timestamp)}
                                </span>
                              )}
                            </div>
                            <div className="flex items-center justify-between">
                              <p className="text-sm text-muted-foreground truncate">
                                {conversation.isTyping ? (
                                  <span className="text-primary-sportlink">Digitando...</span>
                                ) : conversation.lastMessage ? (
                                  conversation.lastMessage.senderId === currentUserId ? (
                                    <span>Você: {conversation.lastMessage.text}</span>
                                  ) : (
                                    conversation.lastMessage.text
                                  )
                                ) : (
                                  "Nenhuma mensagem"
                                )}
                              </p>
                              {conversation.unreadCount > 0 && (
                                <Badge className="ml-2 h-5 min-w-5 px-1.5 bg-primary-sportlink text-white">
                                  {conversation.unreadCount}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-4 text-center">
                      <p className="text-muted-foreground">Nenhuma conversa encontrada</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          )}

          {/* Área de mensagens (oculta no mobile quando nenhuma conversa está ativa) */}
          {(!isMobileView || (isMobileView && !showConversationList)) && (
            <div className="flex-1 flex flex-col bg-background/80 backdrop-blur-sm">
              {activeConversation && currentConversation ? (
                <>
                  {/* Cabeçalho da conversa */}
                  <div className="p-4 border-b border-border flex items-center justify-between">
                    <div className="flex items-center">
                      {isMobileView && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mr-2"
                          onClick={toggleConversationView}
                          aria-label="Voltar para lista de conversas"
                        >
                          <ArrowLeft className="h-5 w-5" />
                        </Button>
                      )}
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src={currentConversation.avatar || "/placeholder.svg"}
                          alt={currentConversation.name}
                        />
                        <AvatarFallback>
                          {currentConversation.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="ml-3">
                        <h3 className="font-medium">{currentConversation.name}</h3>
                        <div className="flex items-center text-xs text-muted-foreground">
                          {currentConversation.type === "individual" ? (
                            <>
                              <div
                                className={`h-2 w-2 rounded-full mr-1 ${
                                  currentConversation.isOnline ? "bg-green-500" : "bg-gray-400"
                                }`}
                              ></div>
                              <span>{currentConversation.isOnline ? "Online" : "Offline"}</span>
                            </>
                          ) : (
                            <>
                              <Users className="h-3 w-3 mr-1" />
                              <span>{currentConversation.participants.length} participantes</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Video className="h-5 w-5" />
                      </Button>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Opções</DropdownMenuLabel>
                          <DropdownMenuItem className="cursor-pointer">
                            <Info className="h-4 w-4 mr-2" />
                            <span>Ver informações</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Search className="h-4 w-4 mr-2" />
                            <span>Buscar na conversa</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Filter className="h-4 w-4 mr-2" />
                            <span>Filtrar mensagens</span>
                          </DropdownMenuItem>
                          {currentConversation.type === "group" && (
                            <DropdownMenuItem className="cursor-pointer">
                              <UserPlus className="h-4 w-4 mr-2" />
                              <span>Adicionar participantes</span>
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="cursor-pointer">
                            <BellOff className="h-4 w-4 mr-2" />
                            <span>Silenciar notificações</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="cursor-pointer">
                            <Trash className="h-4 w-4 mr-2" />
                            <span>Limpar conversa</span>
                          </DropdownMenuItem>
                          {currentConversation.type === "group" && (
                            <DropdownMenuItem className="cursor-pointer text-destructive">
                              <LogOut className="h-4 w-4 mr-2" />
                              <span>Sair do grupo</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Área de mensagens */}
                  <div className="flex-1 overflow-hidden relative">
                    <ScrollArea className="h-[calc(100vh-13.5rem)] px-4 py-2" type="always">
                      <div className="space-y-4">
                        {activeConversation &&
                          messages[activeConversation].map((message, index) => {
                            const isCurrentUser = message.senderId === currentUserId
                            const sender = currentConversation?.participants.find((p) => p.id === message.senderId)

                            // Verificar se deve mostrar o nome do remetente (em grupos)
                            const showSender =
                              currentConversation?.type === "group" &&
                              message.senderId !== currentUserId &&
                              (index === 0 || messages[activeConversation][index - 1].senderId !== message.senderId)

                            // Verificar se deve mostrar o timestamp
                            const showTimestamp =
                              index === 0 ||
                              new Date(message.timestamp).getDate() !==
                                new Date(messages[activeConversation][index - 1].timestamp).getDate()

                            return (
                              <div key={message.id}>
                                {showTimestamp && (
                                  <div className="flex justify-center my-4">
                                    <div className="bg-muted px-3 py-1 rounded-full text-xs text-muted-foreground">
                                      {new Date(message.timestamp).toLocaleDateString()}
                                    </div>
                                  </div>
                                )}
                                <div
                                  className={`flex ${isCurrentUser ? "justify-end" : "justify-start"} ${
                                    showSender ? "mt-4" : "mt-1"
                                  }`}
                                >
                                  <div className={`max-w-[80%] ${isCurrentUser ? "order-2" : "order-1"}`}>
                                    {showSender && (
                                      <div className="flex items-center mb-1">
                                        <Avatar className="h-5 w-5 mr-1">
                                          <AvatarImage src={sender?.avatar || "/placeholder.svg"} alt={sender?.name} />
                                          <AvatarFallback>
                                            {sender?.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        <span className="text-xs font-medium">{sender?.name}</span>
                                      </div>
                                    )}
                                    <div
                                      className={`px-4 py-2 rounded-2xl ${
                                        isCurrentUser
                                          ? "bg-gradient-to-r from-primary-sportlink to-rose-500 text-white"
                                          : "bg-muted"
                                      }`}
                                    >
                                      <p className="whitespace-pre-line">{message.text}</p>
                                    </div>
                                    <div
                                      className={`flex items-center mt-1 text-xs text-muted-foreground ${
                                        isCurrentUser ? "justify-end" : "justify-start"
                                      }`}
                                    >
                                      <span>{formatMessageTime(message.timestamp)}</span>
                                      {isCurrentUser && (
                                        <div className="ml-1">
                                          {message.status === "sent" && <Check className="h-3 w-3" />}
                                          {message.status === "delivered" && (
                                            <div className="flex">
                                              <Check className="h-3 w-3" />
                                              <Check className="h-3 w-3 -ml-1" />
                                            </div>
                                          )}
                                          {message.status === "read" && (
                                            <div className="flex text-primary-sportlink">
                                              <Check className="h-3 w-3" />
                                              <Check className="h-3 w-3 -ml-1" />
                                            </div>
                                          )}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>
                  </div>

                  {/* Campo de entrada de mensagem */}
                  <div className="p-4 border-t border-border">
                    <div className="flex items-center">
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground">
                        <ImageIcon className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" className="text-muted-foreground md:hidden">
                        <Mic className="h-5 w-5" />
                      </Button>
                      <div className="flex-1 mx-2">
                        <Input
                          placeholder="Digite sua mensagem..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                          className="bg-muted/50"
                        />
                      </div>
                      <Button variant="ghost" size="icon" className="text-muted-foreground hidden md:flex">
                        <Smile className="h-5 w-5" />
                      </Button>
                      <Button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        size="icon"
                        className="bg-gradient-to-r from-primary-sportlink to-rose-500 text-white"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-primary-sportlink/20 to-rose-500/20 flex items-center justify-center mb-4">
                    <Send className="h-10 w-10 text-primary-sportlink" />
                  </div>
                  <h3 className="text-xl font-medium mb-2">Suas mensagens</h3>
                  <p className="text-muted-foreground text-center max-w-md">
                    Selecione uma conversa para começar a enviar mensagens ou crie um novo grupo para sua equipe.
                  </p>
                  <Button
                    onClick={() => setShowNewGroupDialog(true)}
                    className="mt-4 bg-gradient-to-r from-primary-sportlink to-rose-500"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Criar novo grupo
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
