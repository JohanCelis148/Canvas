import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Text, Rect, Transformer, Line } from "react-konva";
import Swal from "sweetalert2";
import logo from "../Assets/logo-coral.png";
import axiosClient from "../app-axios";
import Block from "./../Components/Block";
import "./Canvas.css";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const DetailsPanel = ({ item, updateItem, deleteItem, isExpanded }) => {
  const handleInputChange = (prop, value) => {
    updateItem(item.id, { ...item, [prop]: value });
  };

  const confirmDeletion = () => {
    Swal.fire({
      text: "¿Estás seguro de eliminar la seleccion?",
      showCancelButton: true,
      confirmButtonColor: "#37404d",
      cancelButtonColor: "#ff1d63",
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteItem(item.id);
      }
    });
  };

  return (
    <>
      <details className="content-details-item" open={isExpanded}>
        <summary>
          {item.id} <button onClick={confirmDeletion}>X</button>
        </summary>
        <div className="content-details-configuration">
          {item.type === "text" && (
            <>
              <div className="content-details-item-text1">
                <label>Texto: </label>
                <input
                  type="text"
                  value={item.text}
                  onChange={(e) => handleInputChange("text", e.target.value)}
                />
              </div>
              <div className="content-details-item-text1">
                <label>Fuente: </label>
                <select
                  value={item.fontFamily}
                  onChange={(e) =>
                    handleInputChange("fontFamily", e.target.value)
                  }
                >
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>
              <div className="content-details-item-text">
                <div className="content-details-item-textsub">
                  <label>Tamaño: </label>
                  <input
                    type="number"
                    value={item.fontSize}
                    onChange={(e) =>
                      handleInputChange("fontSize", parseInt(e.target.value))
                    }
                  />
                </div>

                <div className="content-details-item-textsub">
                  <label>Color: </label>
                  <input
                    type="color"
                    value={item.textColor}
                    onChange={(e) =>
                      handleInputChange("textColor", e.target.value)
                    }
                  />
                </div>
              </div>
            </>
          )}
          {item.type === "block" && (
            <>
              <div className="content-details-item-text1">
                <label>Título: </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="content-details-item-text1">
                <label>Descripción: </label>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
            </>
          )}
          <div className="content-details-item-text">
            <div className="content-details-item-textsub">
              <label>X: </label>
              <input
                type="number"
                value={item.x}
                onChange={(e) =>
                  handleInputChange("x", parseInt(e.target.value))
                }
              />
            </div>
            <div className="content-details-item-textsub">
              <label>Y: </label>
              <input
                type="number"
                value={item.y}
                onChange={(e) =>
                  handleInputChange("y", parseInt(e.target.value))
                }
              />
            </div>
          </div>

          <div className="content-details-item-text">
            <div className="content-details-item-textsub">
              <label>Ancho: </label>
              <input
                type="number"
                value={item.width}
                onChange={(e) =>
                  handleInputChange("width", parseInt(e.target.value))
                }
              />
            </div>
            <div className="content-details-item-textsub">
              <label>Alto: </label>
              <input
                type="number"
                value={item.height}
                onChange={(e) =>
                  handleInputChange("height", parseInt(e.target.value))
                }
              />
            </div>
          </div>

          {item.type === "rect" && (
            <div className="content-details-item-text1">
              <label>Relleno: </label>
              <input
                type="color"
                value={item.fillColor}
                onChange={(e) => handleInputChange("fillColor", e.target.value)}
              />
            </div>
          )}
        </div>
      </details>
    </>
  );
};

// const generateHTML = (items) => {
//   const htmlElements = items
//     .map((item) => {
//       if (item.type === "text") {
//         return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; font-size: ${item.fontSize}px; color: ${item.textColor};">${item.text}</true>`;
//       } else if (item.type === "rect") {
//         return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: ${item.fillColor};"></div>`;
//       }else if (item.type === "block") {
//         return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: ${item.fillColor};"></div>`;
//       }
//       return "";
//     })
//     .join("");

//   return `<!DOCTYPE html>
//   <html>
//   <head>
//   <title>Plantilla</title>
//   <style>
//   body, html { margin: 0; height: 1056px; ; width: 816px; overflow: hidden; background-color: gray;}
//   #canvas { width: 816px; height: 1056px; background-color: white; position: relative; }
// </style>
//   </head>
//   <body>
//   <div id="canvas">
//   ${htmlElements}
//   </div>
//   </body>
//   </html>`;
// };

// const downloadHtmlFile = (html) => {
//   const blob = new Blob([html], { type: "text/html" });
//   const url = URL.createObjectURL(blob);
//   const a = document.createElement("a");
//   a.href = url;
//   a.download = "plantilla.html";
//   document.body.appendChild(a);
//   a.click();
//   document.body.removeChild(a);
// };

const generateHTML = (items) => {
  const htmlElements = items
    .map((item) => {
      if (item.type === "text") {
        return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; font-size: ${item.fontSize}px; color: ${item.textColor}; font-family: ${item.fontFamily};">${item.text}</div>`;
      } else if (item.type === "rect") {
        return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: ${item.fillColor};"></div>`;
      } else if (item.type === "block") {
        return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; background-color: #C5C5C5; border: 1px solid black; padding: 10px; box-sizing: border-box;">
                  <div style="font-size: 16px; font-weight: bold;">${item.title}</div>
                  <div style="font-size: 14px;">${item.description}</div>
                </div>`;
      }
      return "";
    })
    .join("");

  return `<!DOCTYPE html>
  <html>
  <head>
  <title>Plantilla</title>
  <style>
  body, html { margin: 0; height: 1056px; ; width: 816px; overflow: hidden; background-color: gray;}
  #canvas { width: 816px; height: 1056px; background-color: white; position: relative; }
</style>
  </head>
  <body>
  <div id="canvas">
  ${htmlElements}
  </div>
  </body>
  </html>`;
};

const downloadHtmlFile = (html) => {
  const blob = new Blob([html], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "plantilla.html";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

const CanvasEditor = () => {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedPanelId, setExpandedPanelId] = useState(null);
  const [showMargin, setShowMargin] = useState(false);
  const [showGrid, setShowGrid] = useState(false);

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const trRef = useRef();
  const layerRef = useRef();

  const minScale = 0.5;
  const maxScale = 1;

  const toggleMargin = () => {
    setShowMargin((prev) => !prev);
  };

  const toggleGrid = () => {
    setShowGrid((prev) => !prev);
  };

  const zoomIn = () => {
    if (scale < maxScale) {
      const newScale = Math.min(scale * 1.1, maxScale);
      setScale(newScale);
    }
  };

  const zoomOut = () => {
    if (scale > minScale) {
      const newScale = Math.max(scale * 0.9, minScale);
      setScale(newScale);
    }
  };

  const resetZoom = () => {
    setScale(1);
  };

  const addText = () => {
    const newText = {
      type: "text",
      x: 100,
      y: 100,
      text: "Nuevo Texto",
      fontSize: 20,
      textColor: "black",
      fontFamily: "Arial",
      id: `✎ Texto ${items.length}`,
      draggable: true,
      width: "auto",
      height: "auto",
      lineHeight: 1.2,
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) => dragBoundFunc(pos, newText.shapeRef.current),
    };
    setItems([...items, newText]);
  };

  const addRect = () => {
    const newRect = {
      type: "rect",
      x: 180,
      y: 180,
      width: 100,
      height: 50,
      fillColor: "#C5C5C5",
      id: `☐ Rectangulo ${items.length}`,
      draggable: true,
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) => dragBoundFunc(pos, newRect.shapeRef.current),
    };
    setItems([...items, newRect]);
  };

  const addBlock = () => {
    const newBlock = {
      type: "block",
      x: 200,
      y: 200,
      width: 300,
      height: 300,
      title: "Título",
      titleColor: "#E42424", // Añade el color de fondo predeterminado
      description: "Descripción",
      fillColor: "#9E9E9E", // Añade el color de fondo predeterminado
      id: `⧈ Bloque ${items.length}`,
      draggable: true,
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) => dragBoundFunc(pos, newBlock.shapeRef.current),
    };
    setItems([...items, newBlock]);
  };

  const addPatientDetailsBlock = () => {
    const newPatientDetailsBlock = {
      type: "patientDetails",
      x: 100,
      y: 100,
      width: 300,
      height: 150,
      patientInfo: {
        name: "Paciente de Prueba",
        id: "1075123456",
        birthDate: "11/11/1991",
        age: "32 Años 6 Meses 10 Días",
        gender: "Masculino",
      },
      fillColor: "#C5C5C5",
      id: `⊙ Detalles del Paciente ${items.length}`,
      draggable: true,
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) =>
        dragBoundFunc(pos, newPatientDetailsBlock.shapeRef.current),
    };
    setItems([...items, newPatientDetailsBlock]);
  };

  const addVariable = (name) => {
    const newVariable = {
      type: "text",
      x: 150,
      y: 150,
      text: name,
      fontSize: 20,
      textColor: "#8e50f6",
      id: `♦︎ ${name} ${items.length}`,
      draggable: true,
      width: "auto",
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) => dragBoundFunc(pos, newVariable.shapeRef.current),
    };
    setItems([...items, newVariable]);
  };

  const updateItem = (id, updatedProps) => {
    const updatedItems = items.map((item) =>
      item.id === id ? updatedProps : item
    );
    setItems(updatedItems);
  };

  const deleteItem = (id) => {
    const updatedItems = items.filter((item) => item.id !== id);
    setItems(updatedItems);
    if (selectedId === id) {
      setSelectedId(null);
    }
  };

  const updateTextSize = (item) => {
    const textShape = item.shapeRef.current;
    if (textShape) {
      textShape.height(textShape.textHeight());
    }
  };

  const handleTextChange = (id, newText) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, text: newText } : item
    );
    setItems(updatedItems);
    updateTextSize(updatedItems.find((item) => item.id === id));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Delete") {
      if (selectedId !== null) {
        Swal.fire({
          text: "¿Estás seguro de eliminar la seleccion?",
          showCancelButton: true,
          confirmButtonColor: "#37404d",
          cancelButtonColor: "#ff1d63",
          confirmButtonText: "Eliminar",
          cancelButtonText: "Cancelar",
        }).then((result) => {
          if (result.isConfirmed) {
            deleteItem(selectedId);
          }
        });
      }
    }
  };

  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axiosClient.get("/variables");
        setData(response.data);
      } catch (error) {
        console.error("Error al obtener los datos:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [selectedId]);

  useEffect(() => {
    const selectedNode = items.find((item) => item.id === selectedId);
    if (selectedNode && trRef.current && selectedNode.shapeRef.current) {
      trRef.current.nodes([selectedNode.shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    } else {
      if (trRef.current) {
        trRef.current.nodes([]);
        trRef.current.getLayer().batchDraw();
      }
    }
  }, [selectedId, items]);

  const pixelsPerInch = 96;
  const letterWidthInches = 8.5;
  const letterHeightInches = 11;

  const width = letterWidthInches * pixelsPerInch;
  const height = letterHeightInches * pixelsPerInch;

  const dragBoundFunc = (pos, node) => {
    let newX = pos.x;
    let newY = pos.y;

    const box = node.getClientRect();
    const offsetX = node.offsetX() ? node.offsetX() : 0;
    const offsetY = node.offsetY() ? node.offsetY() : 0;

    if (box.x < 0) {
      newX = offsetX;
    } else if (box.x + box.width > width) {
      newX = width - box.width + offsetX;
    }

    if (box.y < 0) {
      newY = offsetY;
    } else if (box.y + box.height > height) {
      newY = height - box.height + offsetY;
    }

    return {
      x: newX,
      y: newY,
    };
  };

  const handleSaveTemplate = () => {
    const html = generateHTML(items);
    downloadHtmlFile(html);
  };

  const handleGeneratePDF = () => {
    const element = document.getElementById("pdf-canvas");
    html2canvas(element, {
      useCORS: true,
    }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "pt", "letter");
      pdf.addImage(imgData, "PNG", 0, 0, 612, 792);
      pdf.save("plantilla.pdf");
    });
  };

  const generateHTML = (items) => {
    const htmlElements = items
      .map((item) => {
        if (item.type === "text") {
          return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; font-size: ${item.fontSize}px; color: ${item.textColor}; font-family: ${item.fontFamily};">${item.text}</div>`;
        } else if (item.type === "rect") {
          return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: ${item.fillColor};"></div>`;
        } else if (item.type === "block") {
          return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: ${item.fillColor}; border: 1px solid black; padding: 10px; box-sizing: border-box;">
                    <div style="font-size: 16px; font-weight: bold;">${item.title}</div>
                    <div style="font-size: 14px;">${item.description}</div>
                  </div>`;
        } else if (item.type === "patientDetails") {
          return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: ${item.fillColor}; border: 1px solid black; padding: 10px; box-sizing: border-box;">
                    <div style="font-size: 14px;">Nombre: ${item.patientInfo.name}</div>
                    <div style="font-size: 14px;">ID: ${item.patientInfo.id}</div>
                    <div style="font-size: 14px;">Fecha de Nacimiento: ${item.patientInfo.birthDate}</div>
                    <div style="font-size: 14px;">Edad: ${item.patientInfo.age}</div>
                    <div style="font-size: 14px;">Género: ${item.patientInfo.gender}</div>
                  </div>`;
        }
        return "";
      })
      .join("");

    return `<!DOCTYPE html>
    <html>
    <head>
    <title>Plantilla</title>
    <style>
    body, html { margin: 0; height: 100%; width: 100%; overflow: hidden; background-color: gray; }
    #canvas { width: 100%; height: 100%; background-color: white; position: relative; }
  </style>
    </head>
    <body>
    <div id="canvas">
    ${htmlElements}
    </div>
    </body>
    </html>`;
  };

  const downloadHtmlFile = (html) => {
    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "plantilla.html";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <>
      <div className="header">
        <img src={logo} width={75} style={{ margin: 12 }} />
        <button onClick={handleSaveTemplate}>Guardar Plantilla</button>
        <button onClick={handleGeneratePDF}>Generar PDF</button>
      </div>

      <div className="layout">
        <div className="barra-lateral-izq">
          <p>Información plantilla</p>
          <div className="info-plantilla">
            <select>
              <option> -- Seleccione la categoria </option>
              <option> Biopsia </option>
              <option> Inmunohistoquimica </option>
              <option> Especimen </option>
            </select>
            <input type="text" placeholder="Nombre de la plantilla"></input>
          </div>
          <p>Herramientas</p>
          <div className="content-tools">
            <div className="content-items">
              <button onClick={addText}>Texto</button>
              <button onClick={addRect}>Rectángulo</button>
              <button onClick={addBlock}>Bloque</button>
            </div>
          </div>
          <p>Variables</p>
          <div className="content-variables">
            {data ? (
              <li>
                {data.map((item, index) => (
                  <div className="item-variables" key={index}>
                    {item.name}{" "}
                    <button onClick={() => addVariable(item.name)}>+</button>
                  </div>
                ))}
              </li>
            ) : (
              <p>Cargando datos...</p>
            )}
          </div>
        </div>

        <div className="content-help">
          <button onClick={zoomIn} disabled={scale >= maxScale}>
            +
          </button>
          <button onClick={resetZoom}>⟲</button>
          <button onClick={zoomOut} disabled={scale <= minScale}>
            -
          </button>
          <button onClick={toggleMargin}>
            {showMargin ? "𖢔" : "⿴"}
          </button>
          <button onClick={toggleGrid}>
            {showGrid ? "X" : "▦"}
          </button>
        </div>

        <div
          className="content-stage"
          id="pdf-canvas" // Añadir el id al div contenedor
          style={{
            transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
            transformOrigin: "top center",
            height: "100%",
          }}
        >
          <div>
            <Stage
              width={width}
              height={height}
              style={{
                backgroundColor: "white",
              }}
              onMouseDown={(e) => {
                const clickedOnEmpty = e.target === e.target.getStage();
                if (clickedOnEmpty) {
                  setSelectedId(null);
                  setExpandedPanelId(null);
                }
              }}
            >
              <Layer ref={layerRef}>
                {showMargin && (
                  <Rect
                    x={40}
                    y={40}
                    width={width - 100}
                    height={height - 100}
                    stroke="black"
                    dash={[3, 3]}
                    listening={false}
                  />
                )}
                {showGrid &&
                  Array.from({ length: Math.ceil(width / 10) }).map((_, i) => (
                    <Line
                      key={`v-${i}`}
                      points={[i * 16, 0, i * 16, height]}
                      stroke="gray"
                      strokeWidth={0.5}
                      listening={false}
                    />
                  ))}
                {showGrid &&
                  Array.from({ length: Math.ceil(height / 10) }).map((_, i) => (
                    <Line
                      key={`h-${i}`}
                      points={[0, i * 16, width, i * 16]}
                      stroke="gray"
                      strokeWidth={0.5}
                      listening={false}
                    />
                  ))}
                {items.map((item, idx) => {
                  if (item.type === "text") {
                    return (
                      <Text
                        key={idx}
                        {...item}
                        ref={item.shapeRef}
                        fill={item.textColor}
                        onClick={() => {
                          setSelectedId(item.id);
                          setExpandedPanelId(item.id);
                        }}
                        onTap={() => {
                          setSelectedId(item.id);
                          setExpandedPanelId(item.id);
                        }}
                        onDragEnd={(e) => {
                          setSelectedId(item.id);
                          setExpandedPanelId(item.id);
                          updateItem(item.id, {
                            ...item,
                            x: e.target.x(),
                            y: e.target.y(),
                          });
                        }}
                        onTransformEnd={(e) => {
                          const node = e.target;
                          updateItem(item.id, {
                            ...item,
                            width: Math.max(5, node.width() * node.scaleX()),
                            height: Math.max(5, node.height() * node.scaleY()),
                            rotation: node.rotation(),
                          });
                          node.scaleX(1);
                          node.scaleY(1);
                        }}
                      />
                    );
                  } else if (item.type === "rect") {
                    return (
                      <Rect
                        key={idx}
                        {...item}
                        ref={item.shapeRef}
                        fill={item.fillColor}
                        onClick={() => {
                          setSelectedId(item.id);
                          setExpandedPanelId(item.id);
                        }}
                        onTap={() => {
                          setSelectedId(item.id);
                          setExpandedPanelId(item.id);
                        }}
                        onDragEnd={(e) => {
                          setSelectedId(item.id);
                          setExpandedPanelId(item.id);
                          updateItem(item.id, {
                            ...item,
                            x: e.target.x(),
                            y: e.target.y(),
                          });
                        }}
                        onTransformEnd={(e) => {
                          const node = e.target;
                          updateItem(item.id, {
                            ...item,
                            width: Math.max(5, node.width() * node.scaleX()),
                            height: Math.max(5, node.height() * node.scaleY()),
                            rotation: node.rotation(),
                          });
                          node.scaleX(1);
                          node.scaleY(1);
                        }}
                      />
                    );
                  } else if (item.type === "block") {
                    return (
                      <Block
                        key={idx}
                        {...item}
                        ref={item.shapeRef}
                        isSelected={selectedId === item.id}
                        onClick={() => {
                          setSelectedId(item.id);
                          setExpandedPanelId(item.id);
                        }}
                        onTap={() => {
                          setSelectedId(item.id);
                          setExpandedPanelId(item.id);
                        }}
                        onDragEnd={(e) => {
                          setSelectedId(item.id);
                          setExpandedPanelId(item.id);
                          updateItem(item.id, {
                            ...item,
                            x: e.target.x(),
                            y: e.target.y(),
                          });
                        }}
                        onTransformEnd={(e) => {
                          const node = e.target;
                          updateItem(item.id, {
                            ...item,
                            width: Math.max(5, node.width() * node.scaleX()),
                            height: Math.max(5, node.height() * node.scaleY()),
                            rotation: node.rotation(),
                          });
                          node.scaleX(1);
                          node.scaleY(1);
                        }}
                      />
                    );
                  }
                  return null;
                })}
                <Transformer ref={trRef} />
              </Layer>
            </Stage>
          </div>
        </div>

        <div className="content-details">
          <p>Elementos</p>
          {items.map((item) => (
            <DetailsPanel
              key={item.id}
              item={item}
              updateItem={updateItem}
              deleteItem={deleteItem}
              isExpanded={item.id === expandedPanelId}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default CanvasEditor;
