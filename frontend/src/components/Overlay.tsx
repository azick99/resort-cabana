interface Props {
  children: React.ReactNode;
  onClose:  () => void;
}

export function Overlay({ children, onClose }: Props) {
  return (
    <div
      className="overlay"
      onClick={onClose}
    >
      {/* Stop clicks inside the card from closing the overlay */}
      <div onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}