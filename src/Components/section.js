import React, { useRef, useEffect, useState } from 'react';
import { Group, Rect, Text, Shape } from 'react-konva';

const Block = ({
  x,
  y,
  width,
  title,
  description,
  fillColor,
  onClick,
  onDragEnd,
  onTransformEnd,
  descriptionColor,
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
  const titleRef = useRef();
  const descriptionRef = useRef();
  const [blockHeight, setBlockHeight] = useState(100);

  useEffect(() => {
    const updateHeight = () => {
      const titleHeight = titleRef.current ? titleRef.current.height() : 0;
      const descriptionHeight = descriptionRef.current ? descriptionRef.current.height() : 0;
      setBlockHeight(titleHeight + descriptionHeight + 10); // Add some padding
    };
    updateHeight();
  }, [title, description, width]);

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
        height={blockHeight}
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
        ref={titleRef}
        text={title}
        fontSize={titleSize}
        fontFamily={titleFont}
        fill={titleColor}
        padding={10}
        width={width}
        align={titleAlign}
        fontStyle={titleStyle}
        height={titleHeight}
      />
      <Text
        ref={descriptionRef}
        text={description}
        fontSize={14}
        fontFamily="Arial"
        fill={descriptionColor}
        padding={10}
        width={width}
        align="justify"
        y={titleRef.current ? titleRef.current.height() + 5 : 10} // Adjust position based on title height
      />
    </Group>
  );
};

export default Block;
