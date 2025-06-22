"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { getCategoryById, updateCategory } from "@/app/api/services/categories/categories";
import Cookies from "js-cookie";

const schema = z.object({
  title_en: z.string().min(1, "El título en inglés es requerido"),
  title_es: z.string().min(1, "El título en español es requerido"),
  description_en: z.string().nullable().optional(),
  description_es: z.string().nullable().optional(),
  image: z.any().optional(), // archivo
});

type FormValues = z.infer<typeof schema>;

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const imageFile = watch("image");

  useEffect(() => {
    const theme = Cookies.get("theme") || "light";
    document.documentElement.setAttribute("data-bs-theme", theme);
  }, []);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const response = await getCategoryById(Number(id));
        setValue("title_en", response.title_en);
        setValue("title_es", response.title_es);
        setValue("description_en", response.description_en || "");
        setValue("description_es", response.description_es || "");
        setPreviewImage(response.image_url);
      } catch (error) {
        console.error("Error al cargar la categoría:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchCategory();
  }, [id, setValue]);

  const onSubmit = async (data: FormValues) => {
    try {
      const formData = new FormData();
      formData.append("title_en", data.title_en);
      formData.append("title_es", data.title_es);
      formData.append("description_en", data.description_en || "");
      formData.append("description_es", data.description_es || "");
      if (data.image && data.image[0]) {
        formData.append("image", data.image[0]);
      }

      await updateCategory(Number(id), formData);
      alert("✅ Categoría actualizada correctamente");
      router.push("/categories");
    } catch (error) {
      console.error("Error al actualizar la categoría:", error);
      alert("❌ No se pudo actualizar la categoría");
    }
  };

  if (loading) {
    return <div className="d-flex justify-content-center align-items-center vh-100">Cargando...</div>;
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
        <h2 className="text-center mb-4">Editar Categoría</h2>

        <div className="mb-3">
          <label className="form-label">Título (Español)</label>
          <input
            type="text"
            className={`form-control ${errors.title_es ? "is-invalid" : ""}`}
            {...register("title_es")}
          />
          {errors.title_es && <div className="invalid-feedback">{errors.title_es.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Título (Inglés)</label>
          <input
            type="text"
            className={`form-control ${errors.title_en ? "is-invalid" : ""}`}
            {...register("title_en")}
          />
          {errors.title_en && <div className="invalid-feedback">{errors.title_en.message}</div>}
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción (Español)</label>
          <textarea className="form-control" rows={3} {...register("description_es")} />
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción (Inglés)</label>
          <textarea className="form-control" rows={3} {...register("description_en")} />
        </div>

        <div className="mb-3">
          <label className="form-label">Imagen</label>
          <input
            type="file"
            accept="image/*"
            className="form-control"
            {...register("image")}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) setPreviewImage(URL.createObjectURL(file));
            }}
          />
          {previewImage && (
            <img src={previewImage} alt="Vista previa" className="mt-3 rounded" style={{ maxWidth: 200 }} />
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Guardar Cambios
        </button>
      </form>
    </div>
  );
}
