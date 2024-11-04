import React from "react";
import { Spinner } from "flowbite-react";

const Loader = (props) => {
  const { size = "lg", color = "white" } = props;
  return (
    <div role="status" className="flex  justify-center items-center gap-3">
      <Spinner color={color} size={size} />
      <span className=" dark:text-white text-lg">Loading...</span>
    </div>
  );
};

export default Loader;
