// Capture mouse move event and calculate the delta between the initial position and the current position until the mouse button is released.
export function captureMouseMove(
	initialPosition: { clientX: number; clientY: number },
	onMove: (event: { deltaX: number; deltaY: number }) => void,
) {
	const handleMouseMove = (event: MouseEvent) => {
		onMove({
			deltaX: event.clientX - initialPosition.clientX,
			deltaY: event.clientY - initialPosition.clientY,
		});
	};

	const handleMouseUp = () => {
		document.removeEventListener("mousemove", handleMouseMove);
		document.removeEventListener("mouseup", handleMouseUp);
	};
	document.addEventListener("mousemove", handleMouseMove);
	document.addEventListener("mouseup", handleMouseUp);
}
