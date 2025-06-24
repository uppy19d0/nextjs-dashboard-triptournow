'use client';

import { useState, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { ImagePlus, ArrowLeft, Check } from 'lucide-react';
import { createCategory } from '@/app/api/services/categories/categories';
import type { Category } from '@/models/categories/categories';

export default function CreateCategoryPage() {
  const router = useRouter();
  const [titleEn, setTitleEn] = useState('');
  const [titleEs, setTitleEs] = useState('');
  const [descEn, setDescEn] = useState('');
  const [descEs, setDescEs] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const MAX_MB = 2;

  const handleFile = (e: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const file = e.target.files?.[0] || null;
    if (!file) return setPreview(null);
    if (!file.type.startsWith('image/')) return setError('Debe subir una imagen.');
    if (file.size > MAX_MB * 1e6) return setError(`La imagen no puede superar ${MAX_MB} MB.`);
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!titleEn.trim()) return setError('El título en inglés es obligatorio.');
    if (!imageFile) return setError('La imagen es obligatoria.');

    setLoading(true);
    const formData = new FormData();
    formData.append('title_en', titleEn);
    formData.append('title_es', titleEs);
    formData.append('description_en', descEn);
    formData.append('description_es', descEs);
    formData.append('image', imageFile, imageFile.name);

    try {
      const cat: Category = await createCategory(formData);
      router.push(`/categories/${cat.id}/show`);
    } catch (err: any) {
      setError(err.message || 'Error al crear la categoría.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <form
        onSubmit={handleSubmit}
        encType="multipart/form-data"
        className="p-4 rounded shadow-lg"
        style={{ backgroundColor: 'var(--bs-body-bg)', color: 'var(--bs-body-color)' }}
      >
        <div className="d-flex align-items-center mb-4">
          <button type="button" onClick={() => router.back()} className="btn btn-link text-decoration-none me-2">
            <ArrowLeft />
          </button>
          <h2 className="m-0">Crear Categoría</h2>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        {/* Título EN */}
        <div className="mb-3">
          <label htmlFor="titleEn" className="form-label">Título (Inglés) *</label>
          <input
            id="titleEn"
            name="title_en"
            type="text"
            className={`form-control ${error && !titleEn.trim() ? 'is-invalid' : ''}`}
            value={titleEn}
            onChange={e => setTitleEn(e.target.value)}
            placeholder="Ej. Electronics"
          />
          {!titleEn.trim() && error && <div className="invalid-feedback">El título en inglés es requerido.</div>}
        </div>

        {/* Título ES */}
        <div className="mb-3">
          <label htmlFor="titleEs" className="form-label">Título (Español)</label>
          <input
            id="titleEs"
            name="title_es"
            type="text"
            className="form-control"
            value={titleEs}
            onChange={e => setTitleEs(e.target.value)}
            placeholder="Ej. Electrónica"
          />
        </div>

        {/* Descripción ES */}
        <div className="mb-3">
          <label htmlFor="descEs" className="form-label">Descripción (Español)</label>
          <textarea
            id="descEs"
            name="description_es"
            className="form-control"
            rows={3}
            value={descEs}
            onChange={e => setDescEs(e.target.value)}
            placeholder="Descripción en español"
          />
        </div>

        {/* Descripción EN */}
        <div className="mb-3">
          <label htmlFor="descEn" className="form-label">Descripción (Inglés)</label>
          <textarea
            id="descEn"
            name="description_en"
            className="form-control"
            rows={3}
            value={descEn}
            onChange={e => setDescEn(e.target.value)}
            placeholder="Descripción en inglés"
          />
        </div>

        {/* Imagen */}
        <div className="mb-3">
          <label htmlFor="image" className="form-label">Imagen <span className="text-danger">*</span></label>
          <input
            id="image"
            name="image"
            type="file"
            accept="image/*"
            onChange={handleFile}
            className={`form-control ${error && !preview ? 'is-invalid' : ''}`}
          />
          {error && !preview && <div className="invalid-feedback">{error}</div>}
        </div>

        {/* Preview */}
        <div className="mb-4 text-center">
          {preview ? (
            <img src={preview} alt="Vista previa" className="rounded" style={{ maxWidth: 200 }} />
          ) : (
            <div className="border rounded d-inline-flex align-items-center justify-content-center" style={{ width: 200, height: 150, color: '#888' }}>
              Sin imagen
            </div>
          )}
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? 'Creando…' : <><Check className="me-2" />Guardar</>}
        </button>
      </form>
    </div>
  );
}
