import React, { useRef, useEffect, useState } from "react";
import { Stage, Layer, Text, Rect, Transformer, Line } from "react-konva";
import Swal from "sweetalert2";
import logo from "../Assets/logo-coral.png";
import axiosClient from "../app-axios";
import Block from "../Components/block";
import Section from "../Components/section";
import DetailsPanel from "../Components/detailsPanel";
import "./canvas.css";
import jsPDF from "jspdf";
// import html2canvas from "html2canvas";

const CanvasEditor = () => {
  const [items, setItems] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [expandedPanelId, setExpandedPanelId] = useState(null);
  const [showMargin, setShowMargin] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [data, setData] = useState([]);

  const trRef = useRef();
  const layerRef = useRef();
  const minScale = 0.5;
  const maxScale = 1.3;

  const toggleMargin = () => setShowMargin((prev) => !prev);
  const toggleGrid = () => setShowGrid((prev) => !prev);
  const zoomIn = () => setScale((prev) => Math.min(prev * 1.1, maxScale));
  const zoomOut = () => setScale((prev) => Math.max(prev * 0.9, minScale));
  const resetZoom = () => setScale(1);

  const addText = () => {
    const newText = {
      type: "text",
      x: 100,
      y: 100,
      text: "Nuevo Texto",
      fontSize: 14,
      textColor: "black",
      fontFamily: "Arial",
      fontStyle: "normal",
      id: `✎ Elemento ${items.length + 1} : Texto`,
      draggable: true,
      width: "auto",
      height: "auto",
      lineHeight: 1.2,
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) => dragBoundFunc(pos, newText.shapeRef.current),
    };
    setItems((prev) => [...prev, newText]);
  };

  const addRect = () => {
    const newRect = {
      type: "rect",
      x: 180,
      y: 180,
      width: 100,
      height: 50,
      fillColor: "transparent",
      stroke: "gray",
      strokeWidth: 1,
      cornerRadius: 3,
      id: `☐ Elemento ${items.length + 1} : Rectangulo`,
      draggable: true,
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) => dragBoundFunc(pos, newRect.shapeRef.current),
    };
    setItems((prev) => [...prev, newRect]);
  };

  const addBlock = () => {
    const newBlock = {
      type: "block",
      x: 200,
      y: 200,
      width: 300,
      height: 100,
      borderRadius: 3,
      strokeWidth: 0.5,
      strokeColor: "#000000",
      title: "Título del bloque",
      titleSize: 14,
      titleColor: "#000000",
      titleFont: "Arial",
      titleAlign: "center",
      titleStyle: "bold",
      fillColor: "",
      titleFill: "#C9C9C9", // fondo del título
      titleHeight: 30,
      id: `⧈ Elemento ${items.length + 1} : Bloque `,
      draggable: true,
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) => dragBoundFunc(pos, newBlock.shapeRef.current),
    };
    setItems((prev) => [...prev, newBlock]);
  };

  const addSection = () => {
    const newSection = {
      type: "section",
      x: 200,
      y: 200,
      width: 300,
      height: "auto",
      borderRadius: 3,
      strokeWidth: 0.5,
      strokeColor: "#000000",
      title: "Título de la sección",
      titleColor: "#000000",
      titleFont: "Arial",
      titleAlign: "center",
      titleStyle: "bold",
      descriptionColor: "#4E4E4E",
      description: "Descripción",
      fillColor: "",
      id: `⧈ Elemento ${items.length + 1} : Sección `,
      draggable: true,
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) => dragBoundFunc(pos, newSection.shapeRef.current),
    };
    setItems((prev) => [...prev, newSection]);
  };

  const addVariable = (name) => {
    const newVariable = {
      type: "text",
      x: 150,
      y: 150,
      text: `{${name}}`,
      fontSize: 14,
      textColor: "#8e50f6",
      id: `♦︎ Variable ${items.length + 1} : ${name}`,
      draggable: true,
      width: "auto",
      shapeRef: React.createRef(),
      dragBoundFunc: (pos) => dragBoundFunc(pos, newVariable.shapeRef.current),
    };
    setItems((prev) => [...prev, newVariable]);
  };

  const updateItem = (id, updatedProps) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? updatedProps : item))
    );
  };

  const deleteItem = (id) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
    if (selectedId === id) setSelectedId(null);
  };

  const updateTextSize = (item) => {
    const textShape = item.shapeRef.current;
    if (textShape) textShape.height(textShape.textHeight());
  };

  const handleTextChange = (id, newText) => {
    const updatedItems = items.map((item) =>
      item.id === id ? { ...item, text: newText } : item
    );
    setItems(updatedItems);
    updateTextSize(updatedItems.find((item) => item.id === id));
  };

  const handleKeyPress = (event) => {
    if (event.key === "Delete" && selectedId !== null) {
      Swal.fire({
        text: "¿Estás seguro de eliminar la seleccion?",
        showCancelButton: true,
        confirmButtonColor: "#0c77bf",
        cancelButtonColor: "#ff1d63",
        confirmButtonText: "Eliminar",
        cancelButtonText: "Cancelar",
      }).then((result) => {
        if (result.isConfirmed) deleteItem(selectedId);
      });
    }
  };

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
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [selectedId]);

  useEffect(() => {
    const selectedNode = items.find((item) => item.id === selectedId);
    if (selectedNode && trRef.current && selectedNode.shapeRef.current) {
      trRef.current.nodes([selectedNode.shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    } else {
      trRef.current?.nodes([]);
      trRef.current?.getLayer().batchDraw();
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
    if (box.x < 0) newX = offsetX;
    else if (box.x + box.width > width) newX = width - box.width + offsetX;
    if (box.y < 0) newY = offsetY;
    else if (box.y + box.height > height) newY = height - box.height + offsetY;
    return { x: newX, y: newY };
  };

  const handleSaveTemplate = () => {
    const html = generateHTML(items);
    downloadHtmlFile(html);
  };

  // const handleGeneratePDF = () => {
  //   const element = document.getElementById("pdf-canvas");
  //   html2canvas(element, { useCORS: true }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/png");
  //     const pdf = new jsPDF("p", "pt", "letter");
  //     pdf.addImage(imgData, "PNG", 0, 0, 816, 1056);
  //     pdf.save("plantilla.pdf");
  //   });
  // };

  // Funcion para generar el pdf de acuerdo a la estructura HTML

  const handleGeneratePDF = () => {
    const html = generateHTML(items);
    const pdf = new jsPDF("p", "pt", "letter");
    pdf.html(html, {
      callback: (doc) => {
        doc.save("plantilla.pdf");
      },
    });
  };

  // Funcion para generar estructura HTML
  const generateHTML = (items) => {
    const htmlElements = items
      .map((item) => {
        if (item.type === "text") {
          return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; font-size: ${item.fontSize}px; color: ${item.textColor}; font-family: ${item.fontFamily};">${item.text}</div>`;
        } else if (item.type === "rect") {
          return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: ${item.height}px; background-color: ${item.fillColor};"></div>`;
        } else if (item.type === "section") {
          return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: auto; background-color: ${item.fillColor}; border: ${item.strokeWidth}px solid ${item.strokeColor}; padding: 10px; box-sizing: border-box; border-radius: ${item.borderRadius}px;">
                    <p style="font-size: 16px; color: ${item.titleColor}; font-weight: bold;">${item.title}</p>
                    <p style="font-size: 14px; color: ${item.descriptionColor}">${item.description}</p>
                  </div>`;
        } else if (item.type === "block") {
          return `<div style="position: absolute; left: ${item.x}px; top: ${item.y}px; width: ${item.width}px; height: auto; background-color: ${item.fillColor}; border: ${item.strokeWidth}px solid ${item.strokeColor}; padding: 10px; box-sizing: border-box; border-radius: ${item.borderRadius}px;">
                    <p style="font-size: 16px; color: ${item.titleColor}; font-weight: bold;">${item.title}</p>
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
    body, html { margin: 0; height: 1056px; ; width: 816px; overflow: hidden; background-color: gray; }
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

  // Funcion pra descargar estructura HTML
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
        <div className="content-buttons">
          <button onClick={handleSaveTemplate}>Guardar Plantilla</button>
          <button onClick={handleGeneratePDF}>Generar PDF</button>
        </div>
      </div>
      <div className="layout">
        <div className="barra-lateral-izq">
          <p>Información plantilla</p>
          <div className="info-plantilla">
            <select>
              <option> Seleccione la categoria </option>
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
              <button onClick={addSection}>Sección</button>
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
          <button onClick={toggleMargin}>{showMargin ? "𖢔" : "⿴"}</button>
          <button onClick={toggleGrid}>{showGrid ? "X" : "▦"}</button>
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
                    x={33}
                    y={33}
                    width={width - 65}
                    height={height - 65}
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
                      stroke="lightgray"
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
                            // rotation: node.rotation(),
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
                            // rotation: node.rotation(),
                          });
                          node.scaleX(1);
                          node.scaleY(1);
                        }}
                      />
                    );
                  } else if (item.type === "section") {
                    return (
                      <Section
                        key={idx}
                        {...item}
                        ref={item.shapeRef}
                        // isSelected={selectedId === item.id}
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
                            // rotation: node.rotation(),
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
                            // rotation: node.rotation(),
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
