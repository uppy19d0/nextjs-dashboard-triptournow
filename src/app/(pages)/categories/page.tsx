'use client';

import { useEffect, useState, useCallback } from 'react';
import { getCategories } from '@/app/api/services/categories/categories';
import { Categories } from '@/models/categories/categories';
import CategoriesTable from './CategoriesTable';

function Spinner() {
  return (
    <div className="flex justify-center items-center h-[60vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-blue-500" />
    </div>
  );
}

function ErrorAlert({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div className="bg-red-600 text-white p-4 rounded-md mb-6">
      <p className="mb-2">{message}</p>
      <button
        onClick={onRetry}
        className="bg-white text-red-600 py-1 px-3 rounded hover:bg-red-50 transition"
      >
        Reintentar
      </button>
    </div>
  );
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Categories[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cats = await getCategories();
      console.debug('[CategoriesPage] getCategories response:', cats);
      setCategories(cats);
    } catch (err: any) {
      console.error('[CategoriesPage] Error cargando categorías:', err);
      setError('No se pudieron cargar las categorías. Por favor, inténtalo de nuevo.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="p-6 min-h-screen bg-gray-900">
      <h1 className="text-3xl text-white font-bold mb-6">Categorías</h1>

      {error && <ErrorAlert message={error} onRetry={fetchCategories} />}

      {!error && categories.length === 0 ? (
        <p className="text-center text-gray-400">No hay categorías para mostrar.</p>
      ) : (
        <CategoriesTable categories={categories} />
      )}
    </div>
  );
}
