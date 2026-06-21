import { bookingSteps } from "../utils/booking";

export default function BookingSteps({ current }: { current: number }) {
  return (
    <nav aria-label="Booking progress" className="mb-8 sm:mb-10 overflow-x-auto pb-1">
      <ol className="grid grid-cols-4 gap-2 min-w-[330px]">
        {bookingSteps.map((step, index) => {
          const isActive = index === current;
          const isComplete = index < current;

          return (
            <li
              className={`min-w-0 rounded-lg sm:rounded-xl px-1.5 sm:px-4 py-2.5 sm:py-3 border text-[10px] sm:text-sm font-bold leading-tight text-center break-words ${
                isActive
                  ? "bg-primary text-on-primary border-primary"
                  : isComplete
                    ? "bg-secondary-container text-on-secondary-container border-secondary-container"
                    : "bg-surface-container-low text-on-surface-variant border-outline-variant/10"
              }`}
              key={step}
            >
              <span className="block text-[10px] sm:text-xs opacity-75">Step {index + 1}</span>
              {step}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
