export default function Home() {
  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Cafetería</h1>
      <p>Panel de reportes analíticos</p>

      <ul>
        <li>
          <a href="/reports/sales">
            Ventas diarias
          </a>
        </li>

        <li>
          <a href="/reports/top-products">
            Top productos
          </a>
        </li>

        <li>
          <a href="/reports/inventory-risk">
            Riesgo de inventario
          </a>
        </li>

        <li>
          <a href="/reports/customer-value">
            Valor de clientes
          </a>
        </li>

        <li>
          <a href="/reports/payment-mix">
            Mezcla de pagos
          </a>
        </li>
      </ul>
    </div>
  );
}