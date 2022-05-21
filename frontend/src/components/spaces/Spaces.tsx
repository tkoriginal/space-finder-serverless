import { Component, FC, useEffect, useState } from "react";
import { Space } from "../../model/Model";
import { DataService } from "../../services/DataService";
import SpaceComponent from "./SpaceComponent";
import ConfirmModalComponent from "./ConfirmModalComponent";

interface SpacesState {
  spaces: Space[];
  showModal: boolean;
  modalContent: string;
}

interface SpacesProps {
  dataService: DataService;
}
const Spaces: FC<SpacesProps> = ({ dataService }) => {
  const [spaces, setSpaces] = useState<Space[]>([]);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<string>("");

  useEffect(() => {
    const getSpace = async () => {
      setSpaces(await dataService.getSpaces());
    };
    getSpace();
  }, [dataService]);

  const reserveSpace = async (spaceId: string) => {
    const reservationResult = await dataService.reserveSpace(spaceId);
    if (reservationResult) {
      setShowModal(true);
      setModalContent(
        `You reserved the space with id ${spaceId} and got the reservation number ${reservationResult}`
      );
    } else {
      setShowModal(true);
      setModalContent(`You can't reserve the space with id ${spaceId}`);
    }
  };

  const renderSpaces = () => {
    return spaces.map((space) => (
      <SpaceComponent
        location={space.location}
        name={space.name}
        spaceId={space.spaceId}
        reserveSpace={reserveSpace}
      />
    ));
  };

  const closeModal = () => {
    setShowModal(false);
    setModalContent("");
  };

  return (
    <div>
      <h2>Welcome to the Spaces page!</h2>
      {renderSpaces()}
      <ConfirmModalComponent
        close={closeModal}
        content={modalContent}
        show={showModal}
      />
    </div>
  );
  
};

export default Spaces;