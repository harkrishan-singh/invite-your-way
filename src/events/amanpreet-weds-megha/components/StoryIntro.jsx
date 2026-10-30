import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";

const WORDS = "You're cordially invited to celebrate out story!".split(" ");

function Word({ word, index, total, progress }) {
  const start = index / total;
  const opacity = useTransform(progress, [start, Math.min(start + 0.22, 1)], [0.16, 1]);
  return (
    <motion.span className="invite-word" style={{ opacity }}>
      {word}{" "}
    </motion.span>
  );
}

export default function StoryIntro() {
  const ref = useRef(null);
  const calm = useReducedMotion() === true;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 75%", "end 55%"],
  });

  return (
    <section className="invite-line" id="story-intro" ref={ref}>
      <p>
        {WORDS.map((word, index) =>
          calm ? (
            <span className="invite-word" key={word}>
              {word}{" "}
            </span>
          ) : (
            <Word key={word} word={word} index={index} total={WORDS.length} progress={scrollYProgress} />
          ),
        )}
      </p>
    </section>
  );
}
