function Panel({ title, children, isActive, onShow }) {
  return (
    <section className="panel">
      <header>
        <h3>{title}</h3>
        {!isActive && (
          <button className="secondary-btn" onClick={onShow}>
            Show
          </button>
        )}
      </header>
      {isActive && <p>{children}</p>}
    </section>
  );
}

export default Panel;
