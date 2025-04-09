"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { User } from "@/models/users/users";
import { getUserById, updateUser } from "@/app/api/services/users/userssevices";

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [birthday, setBirthday] = useState("");
  const [dni, setDni] = useState("");
  const [country, setCountry] = useState("");
  const [phone, setPhone] = useState("");
  const [type, setType] = useState("");

  useEffect(() => {
    if (!id) return;

    const fetchUser = async () => {
      try {
        const response = await getUserById(id as string);
        setUser(response);
        setFirstName(response.firstName || "");
        setLastName(response.lastName || "");
        setEmail(response.email || "");
        setBirthday(response.birthday || "");
        setDni(response.dni || "");
        setCountry(response.country || "");
        setPhone(response.phone || "");
        setType(response.type || "");
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

    try {
      const updatedData = {
        firstName,
        lastName,
        email,
        birthday,
        dni,
        country,
        phone,
        type,
      };

      await updateUser(user.id, updatedData);
      alert("Usuario actualizado con éxito");
      router.push("/users");
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Hubo un error al actualizar el usuario");
    }
  };

  if (loading) return <p>Cargando usuario...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Editar Usuario</h1>

      <div className="space-y-4">
        <div>
          <label>Nombre</label>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label>Apellido</label>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label>Fecha de Nacimiento</label>
          <input type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label>DNI</label>
          <input value={dni} onChange={(e) => setDni(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label>País</label>
          <input value={country} onChange={(e) => setCountry(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label>Teléfono</label>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} className="border p-2 w-full" />
        </div>
        <div>
          <label>Tipo de Usuario</label>
          <select value={type} onChange={(e) => setType(e.target.value)} className="border p-2 w-full">
            <option value="">Seleccionar</option>
            <option value="admin">Admin</option>
            <option value="user">Usuario</option>
          </select>
        </div>
      </div>

      <button onClick={handleUpdate} className="bg-blue-500 text-white p-2 mt-4 rounded">
        Guardar Cambios
      </button>
    </div>
  );
}