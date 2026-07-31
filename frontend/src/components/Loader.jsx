import React from "react";

function Loader() {
  return (
    <div className="relative h-12 w-12 animate-loader-spin">
      <div className="absolute left-0 top-0 h-5 w-5 rounded-full bg-neutral-700"></div>

      <div className="absolute right-0 top-0 h-5 w-5 rounded-full bg-neutral-700"></div>

      <div className="absolute bottom-0 left-0 h-5 w-5 rounded-full bg-neutral-700"></div>

      <div className="absolute bottom-0 right-0 h-5 w-5 rounded-full bg-neutral-700"></div>
    </div>
  );
}

export default Loader;