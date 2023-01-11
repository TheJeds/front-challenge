import React, { useRef, useState, useEffect } from "react";
import Moveable from "react-moveable";
import "./styles.css";

const App = () => {
  const [moveableComponents, setMoveableComponents] = useState([]);
  const [selected, setSelected] = useState(null);
  const [images, setImages] = useState([]);

  //Con esta funcion obtengo las fotos de la api
  const getImages = () => {
    return fetch("https://jsonplaceholder.typicode.com/photos");
  };

  //El useEffect los uso para que al iniciar la aplicación obtenga las imagenes y las seteo en nuestros useState de las imagenes
  useEffect(() => {
    getImages()
      .then((res) => res.json())
      .then((data) => {
        setImages(data);
      });
  }, []);

  const addMoveable = () => {
    // Create a new moveable component and add it to the array
    //const COLORS = ["red", "blue", "yellow", "green", "purple"];

    setMoveableComponents([
      ...moveableComponents,
      {
        id: Math.floor(Math.random() * Date.now()),
        top: 0,
        left: 0,
        width: 100,
        height: 100,
        //color: COLORS[Math.floor(Math.random() * COLORS.length)],
        image: images[Math.floor(Math.random() * images.length)].url,
        updateEnd: true,
      },
    ]);
  };

  //Se remueve el ultimo componente
  const removeMoveable = () => {
    setMoveableComponents(
      moveableComponents.slice(0, moveableComponents.length - 1)
    );
  };

  //Esta funcion se encarga de actualizar el estado de los componentes
  const updateMoveable = (id, newComponent, updateEnd = false) => {
    const updatedMoveables = moveableComponents.map((moveable, i) => {
      if (moveable.id === id) {
        return { id, ...newComponent, updateEnd };
      }
      return moveable;
    });
    setMoveableComponents(updatedMoveables);
  };

  const handleResizeStart = (index, e) => {
    console.log("e", e.direction);
    // Check if the resize is coming from the left handle
    const [handlePosX, handlePosY] = e.direction;
    // 0 => center
    // -1 => top or left
    // 1 => bottom or right

    // -1, -1
    // -1, 0
    // -1, 1
    if (handlePosX === -1) {
      console.log("width", moveableComponents, e);
      // Save the initial left and width values of the moveable component
      const initialLeft = e.left;
      const initialWidth = e.width;

      // Set up the onResize event handler to update the left value based on the change in width
    }
  };

  return (
    <main style={{ height: "100vh", width: "100vw" }}>
      <div style={{display:'flex', justifyContent:'space-around'}}>
        <button onClick={addMoveable}>Add Moveable1</button>
        <button className="buttonStyle" onClick={removeMoveable}>
          Remove last Moveable1
        </button>
      </div>
      <div
        id="parent"
        style={{
          position: "relative",
          background: "#F1F1F1",
          border: "2px dashed black",
          boxShadow: "14px 15px 30px 6px rgba(0,0,0,0.1)",
          borderRadius: "20px",
          height: "80vh",
          width: "80vw",
          margin: "auto",
        }}
      >
        {moveableComponents.map((item, index) => (
          <Component
            {...item}
            key={index}
            updateMoveable={updateMoveable}
            handleResizeStart={handleResizeStart}
            setSelected={setSelected}
            isSelected={selected === item.id}
          />
        ))}
      </div>
    </main>
  );
};

export default App;

const Component = ({
  updateMoveable,
  top,
  left,
  width,
  height,
  index,
  //color,
  id,
  setSelected,
  image,
  isSelected = false,
  updateEnd,
}) => {
  const ref = useRef();

  const [nodoReferencia, setNodoReferencia] = useState({
    top,
    left,
    width,
    height,
    index,
    //color,
    image,
    id,
  });

  let parent = document.getElementById("parent");
  let parentBounds = parent?.getBoundingClientRect();

  //con esta funcion se cambia el tamaño del componente
  const onResize = ({ target, width, height, drag }) => {
    const beforeTranslate = drag.beforeTranslate;
    ref.current.style.width = `${width}px`;
    ref.current.style.height = `${height}px`;
    ref.current.style.transform = `translate(${beforeTranslate[0]}px, ${beforeTranslate[1]}px)`;
  };

  const onResizeEnd = ({ lastEvent }) => {
    if (lastEvent) {
      ref.current.translate = lastEvent.drag.beforeTranslate;
    }
  };

  return (
    <>
      <div
        ref={ref}
        className="draggable"
        id={"component-" + id}
        style={{
          position: "absolute",
          top: top,
          left: left,
          width: width,
          height: height,
          borderRadius: "20px",
          //background: color,
          backgroundImage: `url(${image})`,
          backgroundSize: "cover",
        }}
        onClick={() => setSelected(id)}
      />

      <Moveable
        target={isSelected && ref.current}
        resizable
        draggable
        snappable={true}
        bounds={{
          left: 0,
          top: 0,
          right: parentBounds.right - 150,
          bottom: parentBounds.bottom - 60,
        }}
        onDrag={(e) => {
          updateMoveable(id, {
            top: e.top,
            left: e.left,
            width,
            height,
            //color,
            image,
          });
        }}
        onResize={onResize}
        onResizeEnd={onResizeEnd}
        keepRatio={false}
        throttleResize={1}
        throttleDrag={0}
        renderDirections={["nw", "n", "ne", "w", "e", "sw", "s", "se"]}
        edge={false}
        zoom={1}
        origin={false}
        padding={{ left: 0, top: 0, right: 0, bottom: 0 }}
      />
    </>
  );
};
