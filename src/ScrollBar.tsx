import { twMerge } from "tailwind-merge";
import { minmax } from "./utils";
import { captureMouseMove } from "./captureMouseMove";

export type ScrollBarProps = {
	contentSize: number;
	viewportSize: number;
	scrollPosition: number;
	onScroll?: (scrollPosition: number) => void;
	horizontal?: boolean;
	scrollBarWidth?: number;
	className?: string;
};

const MIN_THUMB_SIZE = 20;

export function ScrollBar({
	contentSize,
	viewportSize,
	scrollPosition,
	onScroll,
	horizontal = false,
	scrollBarWidth = 12,
	className,
}: ScrollBarProps) {
	const scrollRatio = viewportSize / contentSize;
	const thumbSize = Math.max(MIN_THUMB_SIZE, scrollRatio * viewportSize);
	const maxScrollPosition = contentSize - viewportSize;
	const thumbPosition =
		(scrollPosition / maxScrollPosition) * (viewportSize - thumbSize);

	const scrollBarVisible = contentSize > viewportSize;

	const translateToScrollPosition = (thumbPosition: number) => {
		return minmax(
			(thumbPosition / (viewportSize - thumbSize)) * maxScrollPosition,
			0,
			maxScrollPosition,
		);
	};

	const handleMouseDownOnThumb = (event: React.MouseEvent) => {
		if (!scrollBarVisible) return;
		if (event.button !== 0 || event.ctrlKey) return;
		event.preventDefault();
		event.stopPropagation();

		const startThumbPosition = thumbPosition;

		captureMouseMove(event, ({ deltaX, deltaY }) => {
			const delta = horizontal ? deltaX : deltaY;
			onScroll?.(translateToScrollPosition(startThumbPosition + delta));
		});
	};

	const handleMouseDownOnTrack = (event: React.MouseEvent) => {
		if (!scrollBarVisible) return;
		if (event.button !== 0 || event.ctrlKey) return;

		const startMousePosition = horizontal ? event.clientX : event.clientY;
		const rect = event.currentTarget.getBoundingClientRect();
		const clickPositionInTrack = horizontal
			? startMousePosition - rect.left
			: startMousePosition - rect.top;

		// Scroll to the position of the click
		// The thumb should be centered on the click position
		const startThumbPosition = clickPositionInTrack - thumbSize / 2;
		onScroll?.(translateToScrollPosition(startThumbPosition));

		captureMouseMove(event, ({ deltaX, deltaY }) => {
			const delta = horizontal ? deltaX : deltaY;
			onScroll?.(translateToScrollPosition(startThumbPosition + delta));
		});
	};

	return (
		<div
			className={twMerge(
				"relative select-none bg-white cursor-default",
				className,
			)}
			style={{
				[horizontal ? "width" : "height"]: viewportSize,
				[horizontal ? "height" : "width"]: scrollBarWidth,
			}}
			onMouseDown={handleMouseDownOnTrack}
		>
			{contentSize > viewportSize && (
				<div
					className={twMerge(
						"absolute inset-0 bg-[#7F7F7F]",
						horizontal
							? "inset-y-[2px] hover:inset-y-[1px] active:inset-y-[1px]"
							: "inset-x-[2px] hover:inset-x-[1px] active:inset-x-[1px]",
					)}
					onMouseDown={handleMouseDownOnThumb}
					style={{
						[horizontal ? "width" : "height"]: thumbSize,
						[horizontal ? "left" : "top"]: thumbPosition,
						borderRadius: scrollBarWidth - 2,
					}}
				/>
			)}
		</div>
	);
}
