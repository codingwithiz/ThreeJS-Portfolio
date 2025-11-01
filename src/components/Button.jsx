const Button = ({ name, isBeam = false, containerClass, onClick }) => {
  return (
    <button
      className={`btn ${containerClass}`}
      onClick={onClick} // ← Make sure this is here
    >
      {isBeam && (
        <span className="relative flex h-3 w-3">
          <span className="btn-ping"></span>
          <span className="btn-ping_dot"></span>
        </span>
      )}
      {name}
    </button>
  );
};

export default Button;
