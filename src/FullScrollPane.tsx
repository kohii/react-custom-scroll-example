import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ScrollBar } from "./ScrollBar";
import { minmax } from "./utils";

export type FullScrollPaneProps = {
	children: (scrollPosition: { x: number; y: number }) => React.ReactNode;
	contentSize: { width: number; height: number };
	viewportSize: { width: number; height: number };
	scrollBarWidth?: number;
	className?: string;
	style?: React.CSSProperties;
};

export function FullScrollPane({
	children,
	contentSize,
	viewportSize,
	scrollBarWidth = 12,
	className,
	style,
}: FullScrollPaneProps) {
	const [scrollPosition, setScrollPosition] = useState({ x: 0, y: 0 });

	const handleWheel = (event: React.WheelEvent) => {
		event.preventDefault();

		let deltaX = event.deltaX;
		let deltaY = event.deltaY;

		// Adjust for deltaMode
		if (event.deltaMode === 1) {
			// DOM_DELTA_LINE
			const lineHeight = 16; // Approximate line height in pixels
			deltaX *= lineHeight;
			deltaY *= lineHeight;
		} else if (event.deltaMode === 2) {
			// DOM_DELTA_PAGE
			deltaX *= viewportSize.width;
			deltaY *= viewportSize.height;
		}

		let newPos: { x: number; y: number };
		if (Math.abs(deltaY) >= Math.abs(deltaX)) {
			const noScroll = contentSize.height <= viewportSize.height;
			newPos = {
				x: scrollPosition.x,
				y: noScroll
					? 0
					: minmax(
							scrollPosition.y + deltaY,
							0,
							contentSize.height - viewportSize.height,
						),
			};
		} else {
			const noScroll = contentSize.width <= viewportSize.width;
			newPos = {
				x: noScroll
					? 0
					: minmax(
							scrollPosition.x + deltaX,
							0,
							contentSize.width - viewportSize.width,
						),
				y: scrollPosition.y,
			};
		}

		if (newPos.x !== scrollPosition.x || newPos.y !== scrollPosition.y) {
			setScrollPosition(newPos);
		}
	};

	return (
		<div
			className={twMerge("relative grid", className)}
			style={{
				width: viewportSize.width + scrollBarWidth,
				height: viewportSize.height + scrollBarWidth,
				gridTemplateColumns: `1fr ${scrollBarWidth}px`,
				gridTemplateRows: `1fr ${scrollBarWidth}px`,
				...style,
			}}
			onWheel={handleWheel}
		>
			<div className="overflow-hidden w-full h-full">
				{children(scrollPosition)}
			</div>
			<ScrollBar
				contentSize={contentSize.height}
				viewportSize={viewportSize.height}
				scrollPosition={scrollPosition.y}
				onScroll={(y) => setScrollPosition((prev) => ({ ...prev, y }))}
				scrollBarWidth={scrollBarWidth}
				className="border-l border-gray-100"
			/>
			<ScrollBar
				contentSize={contentSize.width}
				viewportSize={viewportSize.width}
				scrollPosition={scrollPosition.x}
				onScroll={(x) => setScrollPosition((prev) => ({ ...prev, x }))}
				scrollBarWidth={scrollBarWidth}
				className="border-t border-gray-100"
				horizontal
			/>
		</div>
	);
}
