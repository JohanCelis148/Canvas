import React from "react";
import Swal from "sweetalert2";

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
              <div className="content-details-item-text1">
                <label></label>
                <select
                  value={item.fontStyle}
                  onChange={(e) =>
                    handleInputChange("fontStyle", e.target.value)
                  }
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                  <option value="bold">Negrita</option>
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
          {item.type === "section" && (
            <>
              <div className="content-details-item-block">
                <label>Título: </label>
                <input
                  type="text"
                  value={item.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                />
              </div>
              <div className="content-details-item-block">
                <label>Fuente: </label>
                <select
                  value={item.titleFont}
                  onChange={(e) =>
                    handleInputChange("titleFont", e.target.value)
                  }
                >
                  <option value="Arial">Arial</option>
                  <option value="Verdana">Verdana</option>
                  <option value="Helvetica">Helvetica</option>
                  <option value="Times New Roman">Times New Roman</option>
                  <option value="Courier New">Courier New</option>
                </select>
              </div>
              <div className="content-details-item-block">
                <label></label>
                <select
                  value={item.titleStyle}
                  onChange={(e) =>
                    handleInputChange("titleStyle", e.target.value)
                  }
                >
                  <option value="normal">Normal</option>
                  <option value="italic">Italic</option>
                  <option value="bold">Negrita</option>
                </select>
              </div>
              <div className="content-details-item-block">
                <label>Color Titulo: </label>
                <input
                  type="color"
                  value={item.titleColor}
                  onChange={(e) =>
                    handleInputChange("titleColor", e.target.value)
                  }
                />
              </div>
              <div className="content-details-item-block">
                <label>Descripción: </label>
                <textarea
                  value={item.description}
                  onChange={(e) =>
                    handleInputChange("description", e.target.value)
                  }
                />
              </div>
              
              <div className="content-details-item-block">
                <label>Color Descripción: </label>
                <input
                  type="color"
                  value={item.descriptionColor}
                  onChange={(e) =>
                    handleInputChange("descriptionColor", e.target.value)
                  }
                />
              </div>
              <div className="content-details-item-block">
                <label>Tamaño Borde: </label>
                <input
                  type="number"
                  value={item.strokeWidth}
                  onChange={(e) =>
                    handleInputChange("strokeWidth", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="content-details-item-block">
                <label>Borde radius: </label>
                <input
                  type="number"
                  value={item.borderRadius}
                  min={0}
                  onChange={(e) =>
                    handleInputChange("borderRadius", parseInt(e.target.value))
                  }
                />
              </div>
              <div className="content-details-item-block">
                <label>Color Borde: </label>
                <input
                  type="color"
                  value={item.strokeColor}
                  onChange={(e) =>
                    handleInputChange("strokeColor", e.target.value)
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

export default DetailsPanel;
