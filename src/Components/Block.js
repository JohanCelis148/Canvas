import React, { useRef, useEffect, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';

const Block = ({
  x,
  y,
  width,
  height,
  title,
  fillColor,
  onClick,
  onDragEnd,
  onTransformEnd,
  titleColor,
  titleFont,
  titleAling,
  titleStyle,
  borderRadius,
  strokeWidth,
  strokeColor
}) => {

  return (
    <Group
      x={x}
      y={y}
      draggable
      onClick={onClick}
      onTap={onClick}
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
      <Text
        text={title}
        fontSize={16}
        fontFamily={titleFont}
        fill={titleColor}
        padding={10}
        width={width}
        align={titleAling}
        fontStyle={titleStyle}
      />
    </Group>
  );
};

export default Block;
