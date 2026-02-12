export const dynamic = "force-dynamic";

import Link from "next/link";
import { getTopProducts, type ProductRow } from "@/backend/topProducts";
import { z } from "zod";

const FilterSchema = z.object({
  search: z.string().optional().default(""),
  page: z.string().transform(Number).pipe(z.number().positive()).catch(1),
  limit: z.string().transform(Number).pipe(z.number().positive().max(5)).catch(5),
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { search, page, limit } = FilterSchema.parse(params);


  try {
    const { rows, total, totalPages } = await getTopProducts(search, page, limit);

    return (
      <div>
        <Link href="/" className="back-link">
          ← Volver al inicio
        </Link>

        <h1>Productos Estrella</h1>
        <p className="description">
          Buscar y paginar productos
        </p>

        <form>
          <div className="search-container">
            <label htmlFor="search">
              Buscar producto
            </label>
            <input
              id="search"
              type="text"
              name="search"
              defaultValue={search}
              placeholder="Nombre del producto..."
            />
          </div>
          <button type="submit">
            Buscar
          </button>
          {search && (
            <a href="/reports/top-products">
              Limpiar
            </a>
          )}
        </form>

        <p>
          Total: <strong>{total}</strong>
        </p>

        <div className="table-container">
          <table border={1}>
            <thead>
              <tr>
                <th>#</th>
                <th>Producto</th>
                <th>Unidades</th>
                <th>Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {rows.length > 0 ? (
                rows.map((r: ProductRow) => (
                  <tr key={r.id}>
                    <td className="rank">
                      #{r.rank}
                    </td>
                    <td>{r.name}</td>
                    <td>{r.units}</td>
                    <td>
                      ${Number(r.revenue).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    No hay productos que coincidan con tu búsqueda
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Página {page} de {totalPages || 1}
          </span>
          {page > 1 && (
            <a href={`?search=${encodeURIComponent(search)}&page=${page - 1}&limit=${limit}`}>
              ← Anterior
            </a>
          )}
          {rows.length === limit && (
            <a href={`?search=${encodeURIComponent(search)}&page=${page + 1}&limit=${limit}`}>
              Siguiente →
            </a>
          )}
        </div>
      </div>
    );
  } catch (error) {
    console.error("Error:", error);
    return (
      <div>
        Error cargando datos: {String(error)}
      </div>
    );
  }
}