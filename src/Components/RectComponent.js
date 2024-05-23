// RectComponent.js
import React, { forwardRef } from "react";
import { Rect } from "react-konva";

const RectComponent = forwardRef((props, ref) => {
  const {
    item,
    setSelectedId,
    setExpandedPanelId,
    updateItem,
  } = props;

  return (
    <Rect
      {...item}
      ref={ref}
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
});

export default RectComponent;
