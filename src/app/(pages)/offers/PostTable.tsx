import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Pencil, X, ChevronUp, ChevronDown, Check, AlertTriangle } from 'lucide-react'
import { Posts } from '@/models/posts/posts'
import Modal from 'react-modal'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

type Props = {
  posts: Posts[]
  onVerify: (post: Posts) => void
}

const POSTS_PER_PAGE = 5
const DEFAULT_SORT = { field: 'created_at', direction: 'desc' as 'asc' | 'desc' }

const formatDate = (dateString: string) => {
  const d = new Date(dateString)
  const day = d.getDate().toString().padStart(2, '0')
  const month = (d.getMonth() + 1).toString().padStart(2, '0')
  const year = d.getFullYear()
  return `${day}-${month}-${year}`
}

export default function PostTable({ posts, onVerify }: Props) {
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPost, setSelectedPost] = useState<Posts | null>(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)
  const [isConfirmOpen, setIsConfirmOpen] = useState(false)
  const [confirmAction, setConfirmAction] = useState<'verify' | 'cancel' | null>(null)
  const [filterStatus, setFilterStatus] = useState('')
  const [filterType, setFilterType] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [sortConfig, setSortConfig] = useState(DEFAULT_SORT)
  const router = useRouter()

  useEffect(() => {
    Modal.setAppElement(document.body)
  }, [])

  const openDetail = (post: Posts) => {
    setSelectedPost(post)
    setIsDetailModalOpen(true)
  }

  const closeDetail = () => {
    setSelectedPost(null)
    setIsDetailModalOpen(false)
  }

  const openConfirm = (post: Posts, action: 'verify' | 'cancel') => {
    setSelectedPost(post)
    setConfirmAction(action)
    setIsConfirmOpen(true)
  }

  const closeConfirm = () => {
    setIsConfirmOpen(false)
    setConfirmAction(null)
  }

  const handleConfirm = () => {
    if (selectedPost) onVerify(selectedPost)
    closeConfirm()
    closeDetail()
  }

  const requestSort = (field: string) => {
    let direction: 'asc' | 'desc' = 'asc'
    if (sortConfig.field === field && sortConfig.direction === 'asc') direction = 'desc'
    setSortConfig({ field, direction })
  }

  const getSortIcon = (field: string) => {
    if (sortConfig.field !== field) return null
    return sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
  }

  const processed = posts
    .filter(p => (
      (filterStatus === '' || p.status === filterStatus) &&
      (p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.subTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
       p.user.email.toLowerCase().includes(searchTerm.toLowerCase()))
    ))
    .sort((a, b) => {
      const { field, direction } = sortConfig
      let aV: any, bV: any
      switch (field) {
        case 'title': aV = a.title; bV = b.title; break
        case 'user.email': aV = a.user.email; bV = b.user.email; break
        case 'created_at': aV = new Date(a.created_at).getTime(); bV = new Date(b.created_at).getTime(); break
        case 'updated_at': aV = new Date(a.updated_at).getTime(); bV = new Date(b.updated_at).getTime(); break
        case 'status': aV = a.status; bV = b.status; break
        default: aV = (a as any)[field]; bV = (b as any)[field]
      }
      if (aV < bV) return direction === 'asc' ? -1 : 1
      if (aV > bV) return direction === 'asc' ? 1 : -1
      return 0
    })

  const paginated = processed.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  )

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
        <h2 className="text-2xl font-bold">Lista de Ofertas</h2>
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Buscar por nombre, subtítulo o correo..."
            value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setCurrentPage(1) }}
            className="p-2 bg-gray-800 rounded border border-gray-600 text-sm"
          />
          <select
            value={filterStatus}
            onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1) }}
            className="p-2 bg-gray-800 rounded border border-gray-600 text-sm"
          >
            <option value="">Todos</option>
            <option value="active">Verificado</option>
            <option value="inactive">Pendiente</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {['title','user.email','created_at','updated_at','status'].map(col => (
                <th
                  key={col}
                  onClick={() => requestSort(col)}
                  className="px-3 py-2 text-left text-sm font-semibold cursor-pointer"
                >
                  {col === 'title' ? 'Nombre' : col === 'user.email' ? 'Correo' : col === 'created_at' ? 'Creación' : col === 'updated_at' ? 'Actualización' : 'Estado'}
                  <span className="ml-1">{getSortIcon(col)}</span>
                </th>
              ))}
              <th className="px-3 py-2 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {paginated.map(post => (
              <tr key={post.id} className="hover:bg-gray-800 transition">
                <td className="px-3 py-2 text-sm">{post.title}{post.subTitle && ` - ${post.subTitle}`}</td>
                <td className="px-3 py-2 text-sm text-gray-300">{post.user.email}</td>
                <td className="px-3 py-2 text-sm text-gray-300">{formatDate(post.created_at)}</td>
                <td className="px-3 py-2 text-sm text-gray-300">{formatDate(post.updated_at)}</td>
                <td className="px-3 py-2 text-sm capitalize">{post.status}</td>
                <td className="px-3 py-2 text-sm">
                  <div className="flex space-x-2">
                  <button onClick={() => router.push(`/offers/${post.id}/show`)} className="btn btn-info px-3 py-2 rounded-lg shadow"><Eye size={16} /></button>
                    {/* <button onClick={() => openDetail(post)} className="btn btn-info px-3 py-2 rounded-lg shadow"><Eye size={16} /></button> */}
                    <button onClick={() => router.push(`/offers/${post.id}/edit`)} className="btn btn-warning px-3 py-2 rounded-lg shadow"><Pencil size={16} /></button>
                    <button
                      onClick={() => openConfirm(post, post.status === 'active' ? 'cancel' : 'verify')}
                      className={post.status === 'active' ? "btn btn-danger px-3 py-2 rounded-lg shadow" : "btn btn-success px-3 py-2 rounded-lg shadow"}
                    >
                      {post.status === 'active' ? <AlertTriangle size={16}/> : <Check size={16}/>}                    
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="mt-4 flex justify-between text-sm text-gray-300">
        <button
          onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
        >Anterior</button>
        <span>Página {currentPage} de {Math.ceil(processed.length / POSTS_PER_PAGE)}</span>
        <button
          onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(processed.length / POSTS_PER_PAGE)))}
          disabled={currentPage === Math.ceil(processed.length / POSTS_PER_PAGE)}
          className="px-2 py-1 bg-gray-700 rounded disabled:opacity-50"
        >Siguiente</button>
      </div>

      {/* Detalle Modal */}
   

      <Modal
        isOpen={isConfirmOpen}
        onRequestClose={closeConfirm}
        className="modal-content p-4 bg-gray-800 rounded shadow-lg text-white max-w-xs mx-auto text-center"
        overlayClassName="modal-overlay fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
      >
        <div className="flex flex-col items-center gap-3">
          {confirmAction === 'cancel' ? <AlertTriangle size={48} className="text-red-500"/> : <Check size={48} className="text-green-500"/>}
          <p className="text-lg">¿Estás seguro que deseas <strong>{confirmAction === 'cancel' ? 'cancelar' : 'verificar'}</strong> esta oferta?</p>
          <div className="flex gap-4 mt-2">
            <button onClick={handleConfirm} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded text-white">Sí</button>
            <button onClick={closeConfirm} className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded text-white">No</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
