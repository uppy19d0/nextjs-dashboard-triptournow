"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Modal from "react-modal";
import { Eye, Pencil, X, ArrowDown, ArrowUp } from "lucide-react";
import { User } from "@/models/users/users";

type Props = {
  users: User[];
  onVerify: (user: User) => void;
};

const USERS_PER_PAGE = 10;

export default function UsersTable({ users, onVerify }: Props) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterType, setFilterType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<keyof User>("created_at");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const router = useRouter();

  useEffect(() => {
    Modal.setAppElement(document.body);
  }, []);

  const openModal = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedUser(null);
    setIsModalOpen(false);
  };

  const toggleSort = (column: keyof User) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedFilteredUsers = useMemo(() => {
    return users
      .filter((user) => {
        const matchesStatus =
          !filterStatus || user.verification_status === filterStatus;
        const matchesType = !filterType || user.type === filterType;
        const matchesSearch =
          !searchTerm ||
          user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesStatus && matchesType && matchesSearch;
      })
      .sort((a, b) => {
        const aVal = a[sortColumn] as any;
        const bVal = b[sortColumn] as any;

        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortOrder === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        if (aVal instanceof Date && bVal instanceof Date) {
          return sortOrder === "asc"
            ? aVal.getTime() - bVal.getTime()
            : bVal.getTime() - aVal.getTime();
        }

        return 0;
      });
  }, [users, filterStatus, filterType, searchTerm, sortColumn, sortOrder]);

  const paginatedUsers = sortedFilteredUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  return (
    <div className="p-6 bg-gray-900 rounded-xl shadow-lg text-white">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Lista de Usuarios</h2>
        <input
          type="text"
          placeholder="Buscar por nombre o correo"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-2 rounded bg-gray-800 text-white border border-gray-600"
        />
      </div>

      <div className="flex gap-4 mb-4">
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded-md border border-gray-600"
        >
          <option value="">Todos</option>
          <option value="verified">Verificado</option>
          <option value="unverified">Pendiente</option>
        </select>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded-md border border-gray-600"
        >
          <option value="">Todos</option>
          <option value="admin">Administrador</option>
          <option value="user">Usuario</option>
          <option value="seller">Vendedor</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-700">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-gray-800">
            <tr>
              {[
                { key: "firstName", label: "Nombre" },
                { key: "email", label: "Correo" },
                { key: "verification_status", label: "Estado" },
                { key: "type", label: "Tipo" },
                { key: "created_at", label: "Creado" },
              ].map((col) => (
                <th
                  key={col.key}
                  className="px-4 py-3 text-left text-sm font-semibold cursor-pointer"
                  onClick={() => toggleSort(col.key as keyof User)}
                >
                  {col.label}
                  {sortColumn === col.key && (
                    <span className="ml-1 inline-block">
                      {sortOrder === "asc" ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
                    </span>
                  )}
                </th>
              ))}
              <th className="px-4 py-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-gray-900 divide-y divide-gray-700">
            {paginatedUsers.map((user: User) => (
              <tr key={user.id} className="hover:bg-gray-800 transition">
                <td className="px-4 py-3 text-sm">{user.firstName} {user.lastName}</td>
                <td className="px-4 py-3 text-sm">{user.email}</td>
                <td className="px-4 py-3 text-sm">{user.verification_status}</td>
                <td className="px-4 py-3 text-sm">{user.type}</td>
                <td className="px-4 py-3 text-sm">{new Date(user.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3 text-sm">
                  <div className="flex gap-2">
                    <button onClick={() => openModal(user)} className="btn btn-info m-1">
                      <Eye size={16} className="mr-2" /> Ver
                    </button>
                    <button onClick={() => router.push(`/users/${user.id}/edit`)} className="btn btn-warning m-1">
                      <Pencil size={16} className="mr-2" /> Editar
                    </button>
                    <button
                      onClick={() => onVerify(user)}
                      className={`btn m-1 ${
                        user.verification_status === "verified" ? "btn-danger" : "btn-info"
                      }`}
                    >
                      {user.verification_status === "verified" ? "Cancelar" : "Verificar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
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
              Math.min(prev + 1, Math.ceil(sortedFilteredUsers.length / USERS_PER_PAGE))
            )
          }
          disabled={currentPage === Math.ceil(sortedFilteredUsers.length / USERS_PER_PAGE)}
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
        className="modal-content"
        overlayClassName="modal-overlay"
      >
        {selectedUser && (
          <>
            <button onClick={closeModal} className="absolute top-2 right-3 text-gray-400 hover:text-red-500">
              <X size={20} />
            </button>
            <h3 className="text-xl font-semibold mb-4">Detalle del Usuario</h3>
            <div className="space-y-2 text-sm">
              <p><strong>Nombre:</strong> {selectedUser.firstName} {selectedUser.lastName}</p>
              <p><strong>Email:</strong> {selectedUser.email}</p>
              <p><strong>Estado:</strong> {selectedUser.verification_status}</p>
              <p><strong>Tipo:</strong> {selectedUser.type}</p>
              <p><strong>Cumpleaños:</strong> {selectedUser.birthday}</p>
              <p><strong>Teléfono:</strong> {selectedUser.phone}</p>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className={`px-4 py-2 rounded text-sm ${
                selectedUser.verification_status === "verified"
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-green-600 hover:bg-green-700"
              }`}>
                {selectedUser.verification_status === "verified" ? "Cancelar" : "Verificar"}
              </button>
              <button onClick={closeModal} className="px-4 py-2 bg-gray-600 hover:bg-gray-700 rounded text-sm">
                Cerrar
              </button>
            </div>
          </>
        )}
      </Modal>
    </div>
  );
}
