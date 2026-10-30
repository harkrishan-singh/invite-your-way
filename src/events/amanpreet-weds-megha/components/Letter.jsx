import { wedding } from '../data/wedding.js'
import { Flourish } from './Icons.jsx'
import { Reveal } from './Reveal.jsx'

export default function Letter({ message }) {
  return (
    <section className="sheet section" id="letter">
      <Reveal>
        <Flourish />
        <p className="letter">{message}</p>
        <p className="signoff"><span style={{ fontSize: '32px' }}>With love</span><br />{wedding.names}</p>
        <Flourish />
      </Reveal>
    </section>
  )
}
