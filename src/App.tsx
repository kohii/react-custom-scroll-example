import { ScrollPane } from "./ScrollPane";

const ITEM_HEIGHT = 30;

const items = Array.from({ length: 3000000 }, (_, i) => `Item ${i}`);
const totalHeight = ITEM_HEIGHT * items.length;
const viewportSize = 300;

export default function App() {
	return (
		<ScrollPane
			contentSize={totalHeight}
			viewportSize={viewportSize}
			className="border border-gray-200"
		>
			{(scrollPosition) => {
				const startIndex = Math.floor(scrollPosition / ITEM_HEIGHT);
				const endIndex = Math.min(
					Math.ceil((scrollPosition + viewportSize) / ITEM_HEIGHT) + 1,
					items.length,
				);
				const visibleItems = items.slice(startIndex, endIndex);

				const startPosition = startIndex * ITEM_HEIGHT;

				return (
					<div
						className="absolute w-full"
						style={{ top: startPosition - scrollPosition }}
					>
						{visibleItems.map((item) => (
							<div key={item} className="p-1" style={{ height: ITEM_HEIGHT }}>
								{item}
							</div>
						))}
					</div>
				);
			}}
		</ScrollPane>
	);
}
