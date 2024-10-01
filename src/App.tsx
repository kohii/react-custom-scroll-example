import { VerticalScrollPane } from "./VerticalScrollPane";

const ITEM_HEIGHT = 30;

const items = Array.from({ length: 3000000 }, (_, i) => `Item ${i}`);
const totalHeight = ITEM_HEIGHT * items.length;
const viewportSize = 300;

export default function App() {
	return (
		<VerticalScrollPane
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
						className="absolute"
						style={{ top: startPosition - scrollPosition }}
					>
						{visibleItems.map((item) => (
							<div key={item} style={{ height: ITEM_HEIGHT }}>
								{item}
							</div>
						))}
					</div>
				);
			}}
		</VerticalScrollPane>
	);
}
