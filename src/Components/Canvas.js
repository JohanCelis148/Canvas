import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Text, Rect, Transformer } from "react-konva";
import Swal from "sweetalert2";
import logo from "../Assets/logo-coral.png";
import axiosClient from "../app-axios";
import "./Canvas.css";

const DetailsPanel = ({ item, updateItem, deleteItem, isExpanded }) => {
  const handleInputChange = (prop, value) => {
    updateItem(item.id, { ...item, [prop]: value });
  };

  const confirmDeletion = () => {
    Swal.fire({
      // title: "¿Estás seguro de eliminar la seleccion?",
      text: "¿Estás seguro de eliminar la seleccion?",
      // icon: 'warning',
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

const generateHTML = (items) => {
  const htmlElements = items
    .map((item) => {
      if (item.type === "text") {
        return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; font-size: ${item.fontSize}px; color: ${item.textColor};">${item.text}</true>`;
      } else if (item.type === "rect") {
        return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: ${item.fillColor};"></div>`;
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
  const [showMargin, setShowMargin] = useState(false); // Estado para la visibilidad de la margen
  const [showGrid, setShowGrid] = useState(false);//Estado del grid

  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const trRef = useRef();

  const minScale = 0.5; // Permite hacer zoom out hasta la mitad del tamaño original
  const maxScale = 1; // El zoom original, no permite hacer zoom in más allá de esto

  const toggleMargin = () => {
    setShowMargin((prev) => !prev); // Alterna la visibilidad de la margen
  };

  const toggleGrid = () => {
    setShowGrid((prev) => !prev); // Alterna la visibilidad de la cuadrícula
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

  useEffect(() => {
        // Verifica si el elemento seleccionado aún existe
        const selectedNode = items.find((item) => item.id === selectedId);
        if (selectedNode && trRef.current) {
          trRef.current.nodes([selectedNode.shapeRef.current]);
          trRef.current.getLayer().batchDraw();
        } else {
          // Si no existe, asegúrate de que no hay ningún nodo en el Transformer
          if (trRef.current) {
            trRef.current.nodes([]);
            trRef.current.getLayer().batchDraw();
          }
        }
      }, [selectedId, items]);
    
      const handleSaveTemplate = () => {
        const html = generateHTML(items);
        downloadHtmlFile(html);
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
          // height: "auto",
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
          // Actualiza el alto del objeto de texto para que coincida con el alto del texto visible
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
    
      // Función que maneja el evento de teclado
      const handleKeyPress = (event) => {
        if (event.key === "Delete") {
          if (selectedId !== null) {
            Swal.fire({
              // title: "¿Estás seguro?",
              text: "¿Estás seguro de eliminar la seleccion?",
              // icon: 'warning',
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
      }, []); // El arreglo vacío asegura que el efecto se ejecute solo una vez
    
      // Agrega el event listener cuando el componente se monta
      useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
          window.removeEventListener("keydown", handleKeyPress);
        };
      }, [selectedId]); // Asegúrate de que useEffect se actualice si selectedId cambia
    
      //   tamaños del lienzo
      const pixelsPerInch = 96; // DPI estándar
      const letterWidthInches = 8.5; // Ancho en pulgadas para papel tamaño carta
      const letterHeightInches = 11; // Alto en pulgadas para papel tamaño carta
    
      const width = letterWidthInches * pixelsPerInch; // 816 px
      const height = letterHeightInches * pixelsPerInch; // 1056 px
    
      const dragBoundFunc = (pos, node) => {
        let newX = pos.x;
        let newY = pos.y;
    
        // Calcula los límites basados en las dimensiones del elemento
        const box = node.getClientRect();
        const offsetX = node.offsetX() ? node.offsetX() : 0;
        const offsetY = node.offsetY() ? node.offsetY() : 0;
    
        if (box.x < 0) {
          newX = offsetX; // Ajusta a la izquierda
        } else if (box.x + box.width > width) {
          newX = width - box.width + offsetX; // Ajusta a la derecha
        }
    
        if (box.y < 0) {
          newY = offsetY; // Ajusta arriba
        } else if (box.y + box.height > height) {
          newY = height - box.height + offsetY; // Ajusta abajo
        }
    
        return {
          x: newX,
          y: newY,
        };
      };

  return (
    <>
      <div className="header">
        <img src={logo} width={75} style={{ margin: 12 }} />
        <button onClick={handleSaveTemplate}>Guardar Plantilla</button>
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
              <button onClick={addRect}>bloque</button>
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
        </div>

        <div
          className="content-stage"
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
              <Layer>
                {showMargin && (
                  <Rect
                    x={50} // Margen izquierda de 50 px
                    y={50} // Margen superior de 50 px
                    width={width - 100} // Ancho del lienzo menos 100 px (50 px a cada lado)
                    height={height - 100} // Alto del lienzo menos 100 px (50 px arriba y abajo)
                    stroke="gray"
                    dash={[3, 3]} // Líneas discontinuas
                    listening={false} // Evita que el rectángulo intercepte eventos de mouse
                  />
                )}
                {items.map((item, idx) =>
                  React.createElement(item.type === "text" ? Text : Rect, {
                    key: idx,
                    ...item,
                    ref: item.shapeRef,
                    fill:
                      item.type === "text" ? item.textColor : item.fillColor,
                    onClick: () => {
                      setSelectedId(item.id);
                      setExpandedPanelId(item.id);
                    },
                    onTap: () => {
                      setSelectedId(item.id);
                      setExpandedPanelId(item.id);
                    },
                    onDragEnd: (e) => {
                      setSelectedId(item.id);
                      setExpandedPanelId(item.id);
                      updateItem(item.id, {
                        ...item,
                        x: e.target.x(),
                        y: e.target.y(),
                      });
                    },
                    onTransformEnd: (e) => {
                      const node = e.target;

                      updateItem(item.id, {
                        ...item,
                        width: Math.max(5, node.width() * node.scaleX()),
                        height: Math.max(5, node.height() * node.scaleY()),
                        rotation: node.rotation(),
                      });
                      node.scaleX(1);
                      node.scaleY(1);
                    },
                  })
                )}
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
