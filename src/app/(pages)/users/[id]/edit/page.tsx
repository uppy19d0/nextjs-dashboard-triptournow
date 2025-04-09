"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Cookies from "js-cookie";
import { User } from "@/models/users/users";
import { getUserById, updateUser } from "@/app/api/services/users/userssevices";

const schema = z.object({
  firstName: z.string().min(1, "El nombre es requerido"),
  lastName: z.string().min(1, "El apellido es requerido"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(1, "Teléfono requerido"),
  birthday: z.string().min(1, "Fecha requerida"),
  dni: z.string().min(1, "DNI requerido"),
  country: z.string().min(1, "País requerido"),
  type: z.string().min(1, "Tipo requerido"),
});

type FormValues = z.infer<typeof schema>;

export default function EditUserPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  // 👇 sincroniza el atributo data-bs-theme con la cookie
  useEffect(() => {
    const theme = Cookies.get("theme") || "light";
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, []);

  useEffect(() => {
    if (!id) return;
    const fetchUser = async () => {
      try {
        const user: User = await getUserById(id as string);
        Object.entries(user).forEach(([key, value]) => {
          setValue(key as keyof FormValues, value);
        });
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updateUser(id as string, data);
      alert("✅ Usuario actualizado con éxito");
      // router.push("/users");
    } catch (error) {
      alert("❌ Error al actualizar");
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        Cargando...
      </div>
    );

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-4 rounded shadow-lg"
        style={{
          backgroundColor: "var(--bs-body-bg)",
          color: "var(--bs-body-color)",
        }}
      >
        <h2 className="text-center mb-4">Editar Usuario</h2>
        <div className="mb-3 row">
          <div className="col-md-6">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className={`form-control ${errors.firstName ? "is-invalid" : ""}`}
              {...register("firstName")}
            />
            {errors.firstName && (
              <div className="invalid-feedback">{errors.firstName.message}</div>
            )}
          </div>
          <div className="col-md-6">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className={`form-control ${errors.lastName ? "is-invalid" : ""}`}
              {...register("lastName")}
            />
            {errors.lastName && (
              <div className="invalid-feedback">{errors.lastName.message}</div>
            )}
          </div>
        </div>
        <div className="mb-3">
          <label className="form-label">Correo Electrónico</label>
          <input
            type="email"
            className={`form-control ${errors.email ? "is-invalid" : ""}`}
            {...register("email")}
          />
          {errors.email && (
            <div className="invalid-feedback">{errors.email.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Teléfono</label>
          <input
            type="text"
            className={`form-control ${errors.phone ? "is-invalid" : ""}`}
            {...register("phone")}
          />
          {errors.phone && (
            <div className="invalid-feedback">{errors.phone.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Fecha de Nacimiento</label>
          <input
            type="date"
            className={`form-control ${errors.birthday ? "is-invalid" : ""}`}
            {...register("birthday")}
          />
          {errors.birthday && (
            <div className="invalid-feedback">{errors.birthday.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">DNI</label>
          <input
            type="text"
            className={`form-control ${errors.dni ? "is-invalid" : ""}`}
            {...register("dni")}
          />
          {errors.dni && (
            <div className="invalid-feedback">{errors.dni.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">País</label>
          <input
            type="text"
            className={`form-control ${errors.country ? "is-invalid" : ""}`}
            {...register("country")}
          />
          {errors.country && (
            <div className="invalid-feedback">{errors.country.message}</div>
          )}
        </div>
        <div className="mb-3">
          <label className="form-label">Tipo de Usuario</label>
          <select
            className={`form-control ${errors.type ? "is-invalid" : ""}`}
            {...register("type")}
          >
            <option value="">Seleccionar</option>
            <option value="admin">Admin</option>
            <option value="user">Usuario</option>
          </select>
          {errors.type && (
            <div className="invalid-feedback">{errors.type.message}</div>
          )}
        </div>
        <button type="submit" className="btn btn-primary w-100">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
