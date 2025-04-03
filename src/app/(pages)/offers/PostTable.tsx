'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, Pencil, X } from 'lucide-react'
import { Posts } from '@/models/posts/posts'
import Modal from "react-modal";


type Props = {
  posts: Posts[]
}

const POSTS_PER_PAGE = 10

export default function PostTable({ posts }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
   const [selectedUser, setSelectedUser] = useState<Posts | null>(null);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [filterStatus, setFilterStatus] = useState("");
   const [filterType, setFilterType] = useState(""); // Estado para filtro de tipo
   const router = useRouter();
 
   // Evitar el error de Next.js asegurando que `setAppElement` solo se ejecute en el cliente
   useEffect(() => {
     Modal.setAppElement(document.body);
   }, []);
 
   const openModal = (posts: Posts) => {
     setSelectedUser(posts);
     setIsModalOpen(true);
   };
 
   const closeModal = () => {
     setSelectedUser(null);
     setIsModalOpen(false);
   };
 
   // Filtrado de usuarios basado en status y tipo
   const filteredUsers = posts.filter((post) => {
     const statusMatch =
       filterStatus === "" || post.status === filterStatus;
 
     return statusMatch;
   });
 

 

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-lg text-white">
    {/* Lista de usuarios y filtros */}
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Lista de Usuarios</h2>
      <div className="flex gap-4">
        {/* Filtro de Estado */}
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded-md border border-gray-600"
        >
          <option value="">Todos</option>
          <option value="verified">Verificado</option>
          <option value="unverified">Pendiente</option>
        </select>

        {/* Filtro de Tipo */}
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded-md border border-gray-600"
        >
          <option value="">Todos</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
          <option value="seller">vendedor</option>
        </select>
      </div>
    </div>

    {/* Tabla de usuarios */}
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="min-w-full divide-y divide-gray-700">
        <thead className="bg-gray-800">
          <tr>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Nombre
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Correo
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Estado
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Tipo
            </th>
            <th className="px-4 py-3 text-left text-sm font-semibold">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody className="bg-gray-900 divide-y divide-gray-700">
          {filteredUsers
            .slice(
              (currentPage - 1) * POSTS_PER_PAGE,
              currentPage * POSTS_PER_PAGE
            )
            .map((post) => (
              <tr key={post.id} className="hover:bg-gray-800 transition">
                <td className="px-4 py-3 text-sm">
                  {post.title} {post.subTitle}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {post.user.email}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {post.status}
                </td>
                <td className="px-4 py-3 text-sm text-gray-300">
                  {post.price} {/* Mostramos el tipo */}
                </td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button
                      onClick={() => openModal(post)}
                      className="btn btn-info m-1"
                    >
                      <Eye size={16} className="mr-2" /> Ver
                    </button>

                    <button
                      onClick={() => router.push(`/users/${post.id}/edit`)}
                      className="btn btn-warning m-1"
                    >
                      <Pencil size={16} className="mr-2" /> Editar
                    </button>

                    {post.status === "active" ? (
                      <button
                      //  onClick={() => verifiedAndCancel(user)}
                        className="btn btn-danger m-1"
                      >
                        Cancelar
                      </button>
                    ) : (
                      <button
                       // onClick={() => verifiedAndCancel(user)}
                        className="btn btn-info m-1"
                      >
                        Verificar
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>

    {/* Paginación */}
    <div className="mt-6 flex justify-between text-sm text-gray-300">
      <button
        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
      >
        Anterior
      </button>
      <span>Página {currentPage}</span>
      <button
        onClick={() =>
          setCurrentPage((prev) =>
            Math.min(
              prev + 1,
              Math.ceil(filteredUsers.length / POSTS_PER_PAGE)
            )
          )
        }
        disabled={
          currentPage === Math.ceil(filteredUsers.length / POSTS_PER_PAGE)
        }
        className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded disabled:opacity-40"
      >
        Siguiente
      </button>
    </div>

    {/* Modal */}
    <Modal
      isOpen={isModalOpen}
      onRequestClose={closeModal}
      contentLabel="Detalle del Usuario"
      className="modal-content" // Tu clase personalizada para el contenido
      overlayClassName="modal-overlay" // Tu clase personalizada para el overlay
    >
      {selectedUser && (
        <>
          <button
            onClick={closeModal}
            className="absolute top-2 right-3 text-gray-400 hover:text-red-500"
          >
            <X size={20} />
          </button>
          <h3 className="text-xl font-semibold mb-4">Detalle del Usuario</h3>
          <div className="space-y-2 text-sm">
            <p>
              <strong>Nombre:</strong> {selectedUser.title}{" "}
              {selectedUser.subTitle}
            </p>
            <p>
              <strong>Email:</strong> {selectedUser.user.email}
            </p>
            <p>
              <strong>Estado:</strong> {selectedUser.status}
            </p>
            <p>
              <strong>Tipo:</strong> {selectedUser.bought}
            </p>
            <p>
              <strong>cumpleaños:</strong> {selectedUser.description}
            </p>

            <p>
              <strong>teléfono:</strong> {selectedUser.expire_date}
            </p>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            {selectedUser.status === "active" ? (
              <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-sm">
                Cancelar
              </button>
            ) : (
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-sm">
                Verificar
              </button>
            )}
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm"
            >
              Cerrar
            </button>
          </div>
        </>
      )}
    </Modal>
  </div>
  )
}
