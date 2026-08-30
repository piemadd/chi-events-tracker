export const defaultColors = [
  "#b80c00",
  "#ee5b00",
  "#ffd900",
  "#6ba900",
  "#007b04",
  "#007b4c",
  "#00a5c2",
  "#000765",
  "#3d00a0",
  "#940091"
];

const Tag = ({ tagInfo }) => {
  return (
    <div className="tag" style={{ backgroundColor: tagInfo[1], color: tagInfo[2] ?? '#000' }}>
      <p>{tagInfo[0]}</p>
    </div>
  );
};

export default Tag;
