import { FC } from "react";
import genericImage from "../../assets/generic-image.jpg";
import "./SpaceComponent.css";

interface SpaceComponentProps {
  spaceId: string;
  name: string;
  location: string;
  photoUrl?: string;
  reserveSpace: (spaceId: string) => void;
}

const SpaceComponent: FC<SpaceComponentProps> = ({
  spaceId,
  name,
  location,
  photoUrl,
  reserveSpace,
}) => {
  const renderImage = () => {
    if (photoUrl) {
      return <img src={photoUrl} alt="" />;
    } else {
      return <img src={genericImage} alt="" />;
    }
  };

  return (
    <div className="spaceComponent">
      {renderImage()}
      <label className="name">{name}</label>
      <br />
      <label className="spaceId">{spaceId}</label>
      <br />
      <label className="location">{location}</label>
      <br />
      <button onClick={() => reserveSpace(spaceId)}>Reserve</button>
    </div>
  );
};

export default SpaceComponent;
