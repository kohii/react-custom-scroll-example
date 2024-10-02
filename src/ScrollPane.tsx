import { useState } from "react";
import { twMerge } from "tailwind-merge";
import { ScrollBar } from "./ScrollBar";
import { minmax } from "./utils";

export type ScrollPaneProps = {
	children: (scrollPosition: number) => React.ReactNode;
	contentSize: number;
	viewportSize: number;
	scrollBarWidth?: number;
	className?: string;
	style?: React.CSSProperties;
};

export function ScrollPane({
	children,
	contentSize,
	viewportSize,
	scrollBarWidth = 12,
	className,
	style,
}: ScrollPaneProps) {
	const [scrollPosition, setScrollPosition] = useState(0);

	const handleWheel = (event: React.WheelEvent) => {
		event.preventDefault();

		let deltaY = event.deltaY;

		// Adjust for deltaMode
		if (event.deltaMode === 1) {
			// DOM_DELTA_LINE
			const lineHeight = 16; // Approximate line height in pixels
			deltaY *= lineHeight;
		} else if (event.deltaMode === 2) {
			// DOM_DELTA_PAGE
			deltaY *= viewportSize;
		}

		setScrollPosition(
			minmax(scrollPosition + deltaY, 0, contentSize - viewportSize),
		);
	};

	return (
		<div
			className={twMerge("flex", className)}
			style={style}
			onWheel={handleWheel}
		>
			<div
				className="relative overflow-hidden flex-1 h-full"
				style={{ height: viewportSize }}
			>
				{children(scrollPosition)}
			</div>
			<ScrollBar
				contentSize={contentSize}
				viewportSize={viewportSize}
				scrollPosition={scrollPosition}
				onScroll={setScrollPosition}
				scrollBarWidth={scrollBarWidth}
			/>
		</div>
	);
}
