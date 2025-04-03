"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/models/users/users";
import { getUserById } from "@/app/api/services/users/userssevices";

export default function EditUserPage() {
  const { id } = useParams(); // Obtiene el ID de la URL
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [name, setName] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await getUserById(id as string);
        console.log("🚀 ~ fetchUser ~ response:", response);
        setUser(response);
        setName(response.firstName);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleUpdate = async () => {
    if (!user) return;

    /* try {
      await updateUser(user.id, { name });
      alert('Usuario actualizado con éxito');
      router.push('/users'); // Redirige a la lista de usuarios
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Hubo un error al actualizar el usuario');
    } */
  };

  if (loading) return <p>Cargando usuario...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border p-2 w-full"
      />
      <button
        onClick={handleUpdate}
        className="bg-blue-500 text-white p-2 mt-2 rounded"
      >
        Guardar Cambios
      </button>
    </div>
  );
}
