"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getPostById, updatePost } from "@/app/api/services/posts/posts";
import { Posts } from "@/models/posts/posts";
import Cookies from "js-cookie";

const schema = z.object({
  id: z.number().min(1, "El ID es requerido"),
  title: z.string().min(1, "El título es requerido"),
  subTitle: z.string().min(1, "El subtítulo es requerido"),
  description: z.string().min(1, "La descripción es requerida"),
  price: z.string().min(1, "El precio es requerido"),
  expire_date: z.string().min(1, "La fecha de expiración es requerida"),
  status: z.string().min(1, "El estado es requerido"),
  established_quantity: z.string().min(1, "La cantidad establecida es requerida"),
  cancellation_time: z.string().min(1, "El tiempo de cancelación es requerido"),
});

type FormValues = z.infer<typeof schema>;

export default function EditOfferPage() {
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

  useEffect(() => {
    const theme = Cookies.get("theme") || "light";
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, []);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post: Posts = await getPostById(id as string);
        setValue("id", post.id);
        setValue("title", post.title);
        setValue("subTitle", post.subTitle);
        setValue("description", post.description);
        setValue("price", post.price.toString());
        setValue("expire_date", post.expire_date);
        setValue("status", post.status);
        setValue("established_quantity", post.established_quantity?.toString() ?? "");
        setValue("cancellation_time", post.cancellation_time?.toString() ?? "");
      } catch (error) {
        console.error("Error al obtener la oferta:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchPost();
  }, [id, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      await updatePost(id as string, data);
      alert("✅ Oferta actualizada correctamente");
      // router.push("/offers");
    } catch (error) {
      console.error("Error al actualizar la oferta:", error);
      alert("❌ Error al actualizar la oferta");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        Cargando...
      </div>
    );
  }

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
        <h2 className="text-center mb-4">Editar Oferta</h2>

        <div className="mb-3">
          <label className="form-label">Título</label>
          <input
            type="text"
            className={`form-control ${errors.title ? "is-invalid" : ""}`}
            {...register("title")}
          />
          {errors.title && <div className="invalid-feedback">{errors.title.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Subtítulo</label>
          <input
            type="text"
            className={`form-control ${errors.subTitle ? "is-invalid" : ""}`}
            {...register("subTitle")}
          />
          {errors.subTitle && <div className="invalid-feedback">{errors.subTitle.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción</label>
          <textarea
            className={`form-control ${errors.description ? "is-invalid" : ""}`}
            {...register("description")}
            rows={4}
          ></textarea>
          {errors.description && <div className="invalid-feedback">{errors.description.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Precio</label>
          <input
            type="number"
            className={`form-control ${errors.price ? "is-invalid" : ""}`}
            {...register("price")}
          />
          {errors.price && <div className="invalid-feedback">{errors.price.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Fecha de expiración</label>
          <input
            type="date"
            className={`form-control ${errors.expire_date ? "is-invalid" : ""}`}
            {...register("expire_date")}
          />
          {errors.expire_date && <div className="invalid-feedback">{errors.expire_date.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Cantidad Establecida</label>
          <input
            type="number"
            className={`form-control ${errors.established_quantity ? "is-invalid" : ""}`}
            {...register("established_quantity")}
          />
          {errors.established_quantity && (
            <div className="invalid-feedback">{errors.established_quantity.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Tiempo de Cancelación</label>
          <input
            type="number"
            className={`form-control ${errors.cancellation_time ? "is-invalid" : ""}`}
            {...register("cancellation_time")}
          />
          {errors.cancellation_time && (
            <div className="invalid-feedback">{errors.cancellation_time.message}</div>
          )}
        </div>

        <div className="mb-3">
          <label className="form-label">Estado</label>
          <select
            className={`form-control ${errors.status ? "is-invalid" : ""}`}
            {...register("status")}
          >
            <option value="">Seleccionar</option>
            <option value="active">Activa</option>
            <option value="inactive">Inactiva</option>
            <option value="pending">Pendiente</option>
          </select>
          {errors.status && <div className="invalid-feedback">{errors.status.message}</div>}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
