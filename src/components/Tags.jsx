import Tag from "./Tag";

const Tags = ({ tagsArray }) => {
  return (
    <div className="tagsHolder">
      {tagsArray.map((tag) => (
        <Tag tagInfo={tag} />
      ))}
    </div>
  );
};

export default Tags;
