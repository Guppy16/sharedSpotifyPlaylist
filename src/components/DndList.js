import React from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const grid = 8; // Used for padding

const getItemStyle = (isDragging, draggableStyle, inFilter) => ({
	// some basic styles to make the items look a bit nicer
	userSelect: "none",
	margin: `0 0 ${grid}px 0`,

	// change padding based on filter
	padding: inFilter ? grid * 2 : grid,

	// change background colour if dragging
	background: isDragging ? "lightgreen" : inFilter ? "green" : "darkseagreen",

	// styles we need to apply on draggables
	...draggableStyle
});

const getListStyle = isDraggingOver => ({
	background: isDraggingOver ? "#0d4506" : "#202020",
	padding: grid,
	width: '75vw'
});

export default function DndList(props) {
	return (
		<DragDropContext onDragEnd={props.onDragEnd}>
			<Droppable droppableId="droppable">
				{(provided, snapshot) => (
					<div
						{...provided.droppableProps}
						ref={provided.innerRef}
						style={getListStyle(snapshot.isDraggingOver)}
					>
						{props.items.map((item, index) => (
							<Draggable key={item.id} draggableId={item.id} index={index}>
								{(provided, snapshot) => (
									<div
										ref={provided.innerRef}
										{...provided.draggableProps}
										{...provided.dragHandleProps}
										style={getItemStyle(
											snapshot.isDragging,
											provided.draggableProps.style,
											item.render,
										)}
									>
										{index + 1}. {item.name}
									</div>
								)}
							</Draggable>
						))}
						{provided.placeholder}
					</div>
				)}
			</Droppable>
		</DragDropContext>
	);
}