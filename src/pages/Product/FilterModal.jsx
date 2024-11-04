import { Modal, Button } from "flowbite-react";
const FilterModal = ({ isOpen, setIsOpen, reset }) => {
  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Body></Modal.Body>
      <Modal.Footer className="flex justify-between border-t-0">
        <Button onClick={() => setIsOpen(false)}>I accept</Button>
        <div className="flex gap-2">
          {reset && (
            <Button
              onClick={() => {
                reset(), setIsOpen(false);
              }}
            >
              Reset
            </Button>
          )}
          <Button color="gray" onClick={() => setIsOpen(false)}>
            Search
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
