import { photos } from "../data/photos.js";
import { wedding } from "../data/wedding.js";

export default function Footer() {
  return (
    <section className="finale" aria-label={`A note from ${wedding.spokenNames}`}>
      <img src={photos.finale} alt={`${wedding.spokenNames} together`} loading="lazy" decoding="async" />
      <div className="finale-shade" />
      <h2>You’re my favorite person to do anything with for the rest of my life!</h2>
    </section>
  );
}
