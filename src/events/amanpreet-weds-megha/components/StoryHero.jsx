import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import { photos } from "../data/photos.js";
import { wedding } from "../data/wedding.js";

/** Full-screen scale, then a small step down while the side photos arrive. */
const OPEN = 2.08;
const EASED = 1.78;

const desktopFloats = [
  {
    src: photos.coast,
    alt: "A beach and cliffs at sunset",
    className: "fp-coast",
    range: [0, 0.38],
    fromX: -90,
    fromY: -24,
    rotate: 0,
  },
  {
    src: photos.couple,
    alt: "Dancing on the shore",
    className: "fp-couple is-mono",
    range: [0, 0.38],
    fromX: -70,
    fromY: 28,
    rotate: 0,
  },
  {
    src: photos.cliff,
    alt: "A cliff above the water",
    className: "fp-cliff",
    range: [0, 0.38],
    fromX: 80,
    fromY: -18,
    rotate: 0,
  },
  {
    src: photos.shoes,
    alt: "Shoes at the edge of a trail",
    className: "fp-shoes",
    range: [0, 0.38],
    fromX: 90,
    fromY: 36,
    rotate: 0,
  },
];

const phoneFloats = [
  { ...desktopFloats[0], fromX: -12, fromY: -160 },
  { ...desktopFloats[1], fromX: 12, fromY: -160 },
  { ...desktopFloats[2], fromX: -12, fromY: 160 },
  { ...desktopFloats[3], fromX: 12, fromY: 160 },
];

function usePhoneLayout() {
  const [phone, setPhone] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 700px)").matches,
  );

  useEffect(() => {
    const query = window.matchMedia("(max-width: 700px)");
    const update = () => setPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  return phone;
}

function FloatPhoto({ photo, progress }) {
  const opacity = useTransform(progress, photo.range, [0, 1]);
  const x = useTransform(progress, photo.range, [photo.fromX, 0]);
  const y = useTransform(progress, photo.range, [photo.fromY, 0]);
  const rotate = useTransform(progress, photo.range, [photo.rotate + 8, photo.rotate]);

  return (
    <motion.img
      className={`float-photo ${photo.className}`}
      src={photo.src}
      alt={photo.alt}
      draggable="false"
      loading="lazy"
      decoding="async"
      style={{ opacity, x, y, rotate }}
    />
  );
}

export default function Hero() {
  const ref = useRef(null);
  const calm = useReducedMotion() === true;
  const phone = usePhoneLayout();
  const floats = phone ? phoneFloats : desktopFloats;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 8%", "end end"],
  });
  const progress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 36,
    mass: 0.2,
    restDelta: 0.0005,
    skipInitialAnimation: true,
  });

  // A small shrink while the four photos arrive, then the rest of the shrink once they are in.
  const frameScale = useTransform(progress, [0, 0.38, 0.46, 0.94], [OPEN, EASED, EASED, 1]);
  const frameRadius = useTransform(progress, [0, 0.38, 0.46, 0.94], [0, 14, 14, 32]);
  const hintOpacity = useTransform(progress, [0, 0.08], [1, 0]);

  if (calm) {
    return (
      <section className="hero-still" aria-label={wedding.spokenNames}>
        <img src={photos.hero} alt={`${wedding.spokenNames} in a mountain meadow`} />
      </section>
    );
  }

  return (
    <section className="hero-scroll" ref={ref} aria-label={wedding.spokenNames}>
      <div className="hero-sticky">
        <motion.div
          className="hero-frame"
          style={{
            scale: frameScale,
            borderRadius: frameRadius,
          }}
        >
          <img
            className="hero-img"
            src={photos.hero}
            alt={`${wedding.spokenNames} in a mountain meadow`}
            loading="lazy"
            decoding="async"
          />
          <motion.div className="hero-scrim" style={{ opacity: hintOpacity }} />
          <motion.div className="explore" style={{ opacity: hintOpacity }}>
            <span className="explore-mark" aria-hidden="true">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 2.2v9.2M4.2 8.4 8 12.2l3.8-3.8"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="explore-line" />
            <span>Scroll to explore</span>
          </motion.div>
        </motion.div>

        {floats.map((photo) => (
          <FloatPhoto key={photo.className} photo={photo} progress={progress} />
        ))}
      </div>
    </section>
  );
}
