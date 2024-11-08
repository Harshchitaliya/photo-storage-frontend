import { useState, useRef, useEffect } from "react";
import {
  Modal,
  Button,
  Label,
  Datepicker,
  Select,
  TextInput,
} from "flowbite-react";
import Portal from "../../components/Portal/Portal";

const FilterModal = ({ isOpen, setIsOpen, defaultFilters, onApply }) => {
  const [allFilters, setAllFilters] = useState(defaultFilters || {});
  const [position, setPosition] = useState({});
  const containerRef = useRef(null);

  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPosition({
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX + 10,
          width: rect.width,
        });
      }
    };
    updatePosition();
    setTimeout(updatePosition, 100);
    setAllFilters(defaultFilters || {});
    window.addEventListener("resize", updatePosition);
    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [isOpen]);

  return (
    <Modal show={isOpen} onClose={() => setIsOpen(false)}>
      <Modal.Body>
        <div>
          <Label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
            Date
          </Label>
          <div
            ref={containerRef}
            className="border border-gray-600 rounded-lg p-6"
          >
            {position && (
              <Portal position={position} wrapperId="datepicker">
                <Datepicker
                  className="[&_input]:border-0 [&_div]:top-2"
                  value={allFilters.date || null}
                  placeholder="Select a date"
                  onChange={(e) => setAllFilters({ ...allFilters, date: e })}
                  maxDate={new Date()}
                />
              </Portal>
            )}
          </div>
        </div>

        <div className="mt-4 ">
          <Label
            htmlFor="type"
            className="block mb-2 text-sm font-medium text-gray-900 dark:text-white "
          >
            Type
          </Label>
          <Select
            id="type"
          
            value={allFilters.type}
            onChange={(e) =>
              setAllFilters({ ...allFilters, type: e.target.value })
            }
          >
            <option value="">Select type...</option>
            <option value="ring">Ring</option>
            <option value="necklace">Necklace</option>
            <option value="earring">Earring</option>
            <option value="bracelet">Bracelet</option>
            <option value="chain">Chain</option>
            <option value="other">Other</option>
            <option value="none">None</option>
          </Select>
        </div>
        <div className="flex gap-4 w-full justify-between">
          <div className="mt-4 w-full">
            <Label
              htmlFor="price"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Price
            </Label>
            <TextInput
              id="price"
              type="number"
              value={allFilters.price}
              onChange={(e) =>
                setAllFilters({ ...allFilters, price: e.target.value })
              }
            />
          </div>
          <div className="mt-4 w-full">
            <Label
              htmlFor="quantity"
              value={allFilters.quantity}
              onChange={(e) =>
                setAllFilters({ ...allFilters, quantity: e.target.value })
              }
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              Quantity
            </Label>
            <TextInput id="quantity" type="number" />
          </div>
        </div>
      </Modal.Body>
      <Modal.Footer className="flex justify-between border-t-0">
        <Button onClick={() => setIsOpen(false)}>Close</Button>
        <div className="flex gap-2">
          <Button
            onClick={() => {
              onApply?.({});
              setIsOpen(false);
            }}
          >
            Reset
          </Button>
          <Button
            color="light"
            onClick={() => {
              onApply?.(allFilters);
              setIsOpen(false);
            }}
          >
            Search
          </Button>
        </div>
      </Modal.Footer>
    </Modal>
  );
};

export default FilterModal;
