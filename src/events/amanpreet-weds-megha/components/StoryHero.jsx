import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { photos } from "../data/photos.js";
import { wedding } from "../data/wedding.js";

const floats = [
  {
    src: photos.coast,
    alt: "A beach and cliffs at sunset",
    className: "fp-coast",
    range: [0.08, 0.28],
    fromX: -110,
    fromY: -30,
    rotate: 0,
  },
  {
    src: photos.couple,
    alt: "Dancing on the shore",
    className: "fp-couple is-mono",
    range: [0.16, 0.36],
    fromX: -90,
    fromY: 40,
    rotate: 0,
  },
  {
    src: photos.cliff,
    alt: "A cliff above the water",
    className: "fp-cliff",
    range: [0.22, 0.42],
    fromX: 100,
    fromY: -20,
    rotate: 0,
  },
  {
    src: photos.shoes,
    alt: "Shoes at the edge of a trail",
    className: "fp-shoes",
    range: [0.28, 0.48],
    fromX: 110,
    fromY: 50,
    rotate: 0,
  },
];

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
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Composite a single scale instead of changing width, height, top and left on every scroll frame.
  const frameScale = useTransform(scrollYProgress, [0, 0.52], [1, 0.81]);
  const frameRadius = useTransform(scrollYProgress, [0, 0.4], [0, 36]);
  const hintOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0]);

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
          <FloatPhoto key={photo.className} photo={photo} progress={scrollYProgress} />
        ))}
      </div>
    </section>
  );
}
