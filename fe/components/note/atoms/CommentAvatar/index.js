import BeamAvatar from '../BeamAvatar';

const splitFixedLength = (str, size, prefix) => {
  const numChunks = Math.ceil(str.length / size);
  const chunks = new Array(numChunks);
  for (let i = 0, o = 0; i < numChunks; i++, o += size) {
    chunks[i] = prefix + str.substring(o, o + size);
  }
  return chunks;
}

const COLOR_HEX_LENGTH = 6;
export default function CommentAvatar({ hash, name }) {
  const missingHex = COLOR_HEX_LENGTH - (hash.length % COLOR_HEX_LENGTH);
  const filledHash = hash + '0'.repeat(missingHex);
  const colors = splitFixedLength(filledHash, COLOR_HEX_LENGTH, '#');
  return <BeamAvatar colors={colors} name={name} />;
}
