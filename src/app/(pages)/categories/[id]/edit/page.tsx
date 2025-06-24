'use client';

import { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';

const schema = z.object({
  title_en: z.string().min(1, 'El título en inglés es requerido'),
  title_es: z.string().min(1, 'El título en español es requerido'),
  description_en: z.string().optional().nullable(),
  description_es: z.string().optional().nullable(),
});

type FormValues = z.infer<typeof schema>;

export default function EditCategoryPage() {
  const { id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageError, setImageError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  // Tema
  useEffect(() => {
    const theme = Cookies.get('theme') || 'light';
    document.documentElement.setAttribute('data-bs-theme', theme);
  }, []);

  

  // Carga inicial
  useEffect(() => {
    async function loadCategory() {
      try {
        const resp = await fetch(`https://triptournow.com/api/V1/categories/${id}`);
        const data = await resp.json();
        setValue('title_en', data.title_en);
        setValue('title_es', data.title_es);
        setValue('description_en', data.description_en || '');
        setValue('description_es', data.description_es || '');
        setPreviewImage(data.image_url);
        setIsDeleted(!!data.deleted_at);
      } catch (err) {
        console.error('Error al cargar la categoría:', err);
      } finally {
        setLoading(false);
      }
    }
    if (id) loadCategory();
  }, [id, setValue]);

  // Limpieza de blob URL
  useEffect(() => () => {
    if (previewImage?.startsWith('blob:')) URL.revokeObjectURL(previewImage);
  }, [previewImage]);

  // Cambio de archivo para preview
  const handleFileChange = () => {
    const file = fileInputRef.current?.files?.[0] || null;
    if (file) {
      setImageError(null);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // Enviar formulario
  const onSubmit = async (data: FormValues) => {
    const file = fileInputRef.current?.files?.[0] || null;
    if (!file && !isDeleted) {
      setImageError('Debes subir una imagen si no marcas eliminación');
      return;
    }

    const formData = new FormData();
    formData.append('title_en', data.title_en);
    formData.append('title_es', data.title_es);
    formData.append('description_en', data.description_en || '');
    formData.append('description_es', data.description_es || '');
    formData.append('deleted_at', isDeleted ? '1' : '0');
    if (file) formData.append('image', file, file.name);

    try {
      const resp = await fetch(`https://triptournow.com/api/V1/categories/${id}`, {
        method: 'POST',
        body: formData,
      });
      const result = await resp.json();
      if (!resp.ok) throw new Error(result.message || 'Error desconocido');

      alert('✅ Categoría actualizada');
      if (fileInputRef.current) fileInputRef.current.value = '';
      setPreviewImage(isDeleted ? null : previewImage);
      setImageError(null);
      router.push('/categories');
    } catch (err: any) {
      console.error('Error al actualizar la categoría:', err);
      alert(`❌ Error al actualizar: ${err.message}`);
    }
  };

  if (loading) return <div className="d-flex justify-content-center align-items-center vh-100">Cargando...</div>;

  return (
    <div className="container mt-5">
      <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data" className="p-4 rounded shadow-lg" style={{ backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-body-color)' }}>
        <h2 className="text-center mb-4">Editar Categoría</h2>

        {/* Título (ES) */}
        <div className="mb-3">
          <label className="form-label">Título (Español)</label>
          <input type="text" className={`form-control ${errors.title_es ? 'is-invalid' : ''}`} {...register('title_es')} />
          {errors.title_es && <div className="invalid-feedback">{errors.title_es.message}</div>}
        </div>

        {/* Título (EN) */}
        <div className="mb-3">
          <label className="form-label">Título (Inglés)</label>
          <input type="text" className={`form-control ${errors.title_en ? 'is-invalid' : ''}`} {...register('title_en')} />
          {errors.title_en && <div className="invalid-feedback">{errors.title_en.message}</div>}
        </div>

        {/* Descripciones */}
        <div className="mb-3">
          <label className="form-label">Descripción (Español)</label>
          <textarea className="form-control" rows={3} {...register('description_es')} />
        </div>
        <div className="mb-3">
          <label className="form-label">Descripción (Inglés)</label>
          <textarea className="form-control" rows={3} {...register('description_en')} />
        </div>

        {/* Checkbox para eliminar propiedad */}
        <div className="form-check form-switch mb-3">
          <input className="form-check-input" type="checkbox" id="isDeleted" checked={isDeleted} onChange={() => setIsDeleted(!isDeleted)} />
          <label className="form-check-label" htmlFor="isDeleted">Marcar categoría como eliminada</label>
        </div>

        {/* Input imagen */}
        <div className="mb-3">
          <label className="form-label">Imagen <span className="text-danger">*</span></label>
          <input type="file" accept="image/*" ref={fileInputRef} className={`form-control ${imageError ? 'is-invalid' : ''}`} onChange={handleFileChange} disabled={isDeleted} />
          {imageError && <div className="invalid-feedback">{imageError}</div>}
        </div>

        {/* Preview */}
        <div className="mb-4 text-center">
          {previewImage ? (
            <img src={previewImage} alt="Vista previa" className="rounded" style={{ maxWidth: 200 }} />
          ) : (
            <div className="border rounded d-inline-flex align-items-center justify-content-center" style={{ width: 200, height: 150, color: '#888' }}>Sin imagen</div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100">Guardar Cambios</button>
      </form>
    </div>
  );
}