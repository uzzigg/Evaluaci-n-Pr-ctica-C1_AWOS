export const dynamic = "force-dynamic";

import Link from "next/link";
import { getCustomerValue, type CustomerRow } from "@/backend/customerValue";
import { z } from "zod";

const PaginationSchema = z.object({
  page: z.string().transform(Number).pipe(z.number().positive()).catch(1),
});

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const params = await searchParams;
  const { page } = PaginationSchema.parse(params);
  
  const limit = 5;

  try {
    const { rows: displayRows, total, totalPages, hasNextPage } = await getCustomerValue(page, limit);

    return (
      <div>
        <Link href="/" className="back-link">
          ← Volver al inicio
        </Link>

        <h1>Valor de Clientes</h1>
        <p className="description">
          Clientes ordenados por gasto total
        </p>

        <div className="table-container">
          <table border={1}>
            <thead>
              <tr>
                <th>Cliente</th>
                <th>Órdenes</th>
                <th>Total Gastado</th>
                <th>Promedio</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.length > 0 ? (
                displayRows.map((r: CustomerRow) => (
                  <tr key={r.id}>
                    <td>{r.name}</td>
                    <td>{r.num_orders}</td>
                    <td>
                      ${Number(r.total_spent).toFixed(2)}
                    </td>
                    <td>
                      ${Number(r.avg_spent).toFixed(2)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4}>
                    No hay clientes disponibles
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination">
          <span>
            Página {page}
            {page === 1 && totalPages > 0 && ` de ${totalPages}`}
            {" "}(Mostrando {displayRows.length} de {limit})
          </span>
          {page > 1 && (
            <a href={`?page=${page - 1}`}>
              ← Anterior
            </a>
          )}
          {hasNextPage && (
            <a href={`?page=${page + 1}`}>
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