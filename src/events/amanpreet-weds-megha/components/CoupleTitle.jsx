import { wedding } from '../data/wedding.js'

/** Identical large-name treatment everywhere; "weds" is always smaller. */
export default function CoupleTitle({ as: Tag = 'span', className = '' }) {
  return (
    <Tag className={`couple-title ${className}`.trim()}>
      <span className="couple-title-name">{wedding.firstName}</span>
      <span className="couple-title-weds">weds</span>
      <span className="couple-title-name">{wedding.secondName}</span>
    </Tag>
  )
}
