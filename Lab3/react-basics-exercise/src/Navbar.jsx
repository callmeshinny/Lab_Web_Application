const NAV_ITEMS = [
  { id: 'exercise-34', label: 'Exercise 3 & 4' },
  { id: 'exercise-5', label: 'Exercise 5' },
  { id: 'exercise-6', label: 'Exercise 6' },
  { id: 'exercise-7', label: 'Exercise 7' },
  { id: 'exercise-8', label: 'Exercise 8' },
];

function Navbar({ activeTab, onChange }) {
  return (
    <nav className="navbar">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.id}
          className={activeTab === item.id ? 'nav-item active' : 'nav-item'}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
}

export default Navbar;

