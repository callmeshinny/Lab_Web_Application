function Card({ title, subtitle, children }) {
  return (
    <section className="card">
      <header className="card-header">
        <div>
          <p className="card-label">{title}</p>
          {subtitle && <h2 className="card-title">{subtitle}</h2>}
        </div>
      </header>
      <div className="card-body">{children}</div>
    </section>
  );
}

export default Card;
