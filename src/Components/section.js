import React, { useRef, useEffect, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';

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
  titleFont,
  titleAling,
  titleStyle,
  borderRadius,
  strokeWidth,
  strokeColor
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
      <Text
        ref={titleRef}
        text={title}
        fontSize={16}
        fontFamily={titleFont}
        fill={titleColor}
        padding={10}
        width={width}
        align={titleAling}
        fontStyle={titleStyle}
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
