import React, { useRef, useEffect, useState } from "react";
import { Group, Rect, Text, Shape } from "react-konva";

const Block = ({
  x,
  y,
  width,
  height,
  title,
  fillColor,
  onClick,
  onTap,
  onDragEnd,
  onTransformEnd,
  titleColor,
  titleSize,
  titleFont,
  titleAlign,
  titleStyle,
  borderRadius,
  strokeWidth,
  strokeColor,
  titleFill,
  titleHeight,
}) => {
  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={onClick}
      onTap={onTap}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
    >
      <Rect
        width={width}
        height={height}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        cornerRadius={borderRadius}
      />
      <Shape
        sceneFunc={(context, shape) => {
          context.beginPath();
          context.moveTo(0, titleHeight);
          context.lineTo(0, borderRadius);
          context.arcTo(0, 0, borderRadius, 0, borderRadius);
          context.lineTo(width - borderRadius, 0);
          context.arcTo(width, 0, width, borderRadius, borderRadius);
          context.lineTo(width, titleHeight);
          context.closePath();
          context.fillStrokeShape(shape);
        }}
        fill={titleFill}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />
      <Text
        text={title}
        fontSize={titleSize}
        fontFamily={titleFont}
        fill={titleColor}
        verticalAlign="middle"
        align={titleAlign}
        fontStyle={titleStyle}
        width={width}
        height={titleHeight}
        // y={titleHeight / 2 - 8} // Centra verticalmente el texto en el rectángulo del título
      />
    </Group>
  );
};

export default Block;
