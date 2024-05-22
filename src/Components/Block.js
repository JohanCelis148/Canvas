import React, { useRef, useEffect, useState } from 'react';
import { Group, Rect, Text } from 'react-konva';

const Block = ({ x, y, width, title, description, fillColor, onClick, onDragEnd, onTransformEnd, isSelected, titleColor, borderRadius, strokeWidth, strokeColor }) => {
  const titleRef = useRef();
  const descriptionRef = useRef();
  const [blockHeight, setBlockHeight] = useState(100);

  useEffect(() => {
    const updateHeight = () => {
      const titleHeight = titleRef.current ? titleRef.current.height() : 0;
      const descriptionHeight = descriptionRef.current ? descriptionRef.current.height() : 0;
      setBlockHeight(titleHeight + descriptionHeight + 20); // Add some padding
    };
    updateHeight();
  }, [title, description]);

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
        stroke={isSelected ? 'blue' : `${strokeColor}`}
        strokeWidth={isSelected ? 2 : `${strokeWidth}`}
        cornerRadius= {borderRadius}
      />
      <Text
        ref={titleRef}
        text={title}
        fontSize={16}
        fontFamily="Arial"
        fill={titleColor}
        padding={10}
        width={width}
      />
      <Text
        ref={descriptionRef}
        text={description}
        fontSize={14}
        fontFamily="Arial"
        fill="black"
        padding={10}
        y={titleRef.current ? titleRef.current.height() + 20 : 20} // Adjust position based on title height
        width={width}
      />
    </Group>
  );
};

export default Block;
