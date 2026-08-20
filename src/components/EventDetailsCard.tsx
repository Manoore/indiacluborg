import { Calendar, MapPin } from "lucide-react";

const MAPS_URL =
  "https://www.google.com/maps/search/?api=1&query=Island+MetroPark+101+East+Helena+Street+Dayton+OH+45404";

export default function EventDetailsCard() {
  return (
    <div className="relative z-10 mx-auto -mt-10 max-w-3xl px-4 sm:-mt-14">
      <div className="grid gap-6 rounded-3xl bg-white p-6 shadow-2xl ring-1 ring-black/5 sm:grid-cols-2 sm:p-8">
        <div className="flex gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-heart/10">
            <Calendar className="text-heart" size={24} />
          </div>
          <div>
            <p className="font-display text-lg font-extrabold text-navy">Saturday, September 26, 2026</p>
            <p className="mt-1 text-sm text-foreground/60">9:00am Event Opens</p>
            <p className="text-sm text-foreground/60">9:45am Walk Begins</p>
            <p className="text-sm text-foreground/60">Route Length: 3.1 &amp; 1 mile options</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-heart/10">
            <MapPin className="text-heart" size={24} />
          </div>
          <div>
            <p className="font-display text-lg font-extrabold text-navy">Island MetroPark</p>
            <p className="mt-1 text-sm text-foreground/60">101 East Helena Street</p>
            <p className="text-sm text-foreground/60">Dayton, OH 45404</p>
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1 inline-block text-sm font-bold text-heart underline underline-offset-2 hover:text-heart-deep"
            >
              Get Directions
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
