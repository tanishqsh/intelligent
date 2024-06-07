import dayjs from 'dayjs';
import { ResponsiveLine } from '@nivo/line';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(require('dayjs/plugin/relativeTime'));

const customColors = ['#cccccc'];

const FollowersMiniChart = ({ data = [] }: { data: any[] }) => {
	// find the range of the values dynamically
	let max = 0;
	let min = Infinity;
	const xValues = new Set();

	// Filter out the object with id "Followers" from the data array
	data = data.filter((item) => item.id !== 'Followers');

	data.forEach((d: any) => {
		d.data.forEach((p: any) => {
			if (p.y > max) {
				max = p.y;
			}
			if (p.y < min) {
				min = p.y;
			}
			xValues.add(dayjs(p.x).format('YYYY-MM-DD HH:mm:ssZ'));
		});
	});

	const userTimezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

	const lineData = data.map((d: any) => ({
		id: d.id,
		data: d.data.map((p: any) => ({
			x: dayjs(p.x).tz(userTimezone).toDate(),
			y: p.y,
		})),
	}));

	return (
		<ResponsiveLine
			areaOpacity={0.15}
			enableArea={true}
			data={lineData}
			areaBaselineValue={0}
			theme={{
				axis: {
					ticks: {
						line: {
							stroke: '#ededed',
						},
						text: {
							fill: '#666666', // Customize the label color
							fontSize: 10, // Customize the label font size
						},
					},
				},
				grid: {
					line: {
						stroke: '#FFAF34', // Customize the grid line color
						strokeWidth: 1, // Customize the grid line width
						strokeDasharray: '1 8', // Customize the grid line style (dashed)
					},
				},
				crosshair: {
					line: {
						stroke: '#AAAAAA', // Customize the crosshair line color
						strokeWidth: 1.5, // Customize the crosshair line width
						strokeDasharray: '2 2', // Customize the crosshair line style (dashed)
					},
				},
			}}
			margin={{ top: 10, right: 0, bottom: 0, left: 0 }}
			xScale={{ type: 'time', format: 'native', precision: 'hour' }}
			yScale={{ type: 'linear', stacked: false, min: 0, max: 'auto' }}
			yFormat=" >-.2f"
			curve="monotoneX"
			axisLeft={null}
			// axisLeft={null}
			axisBottom={null}
			// axisBottom={null}
			enableGridX={false}
			enableGridY={false}
			lineWidth={1}
			pointSize={0}
			colors={customColors}
			pointColor={{ theme: 'background' }}
			pointBorderWidth={2}
			pointBorderColor={{ from: 'serieColor' }}
			pointLabel="data.yFormatted"
			pointLabelYOffset={0}
			enableSlices="x"
			sliceTooltip={({ slice }) => {
				const likes = slice.points.find((point) => point.serieId === 'Likes')?.data.y || 0;
				const recasts = slice.points.find((point) => point.serieId === 'Recasts')?.data.y || 0;
				const total = Number(likes) + Number(recasts);

				return (
					<div className="bg-white/10 backdrop-blur-sm px-4 py-1 shadow-sm border border-[#ededed]/30 rounded-md">
						<div className="space-x-1">
							<div className="text-xs rounded-full text-[#a5a5a5] px-[6px] py-[2px] bg-[#AAAAAA]/2 font-medium inline-block">
								{Number(total)} reactions <span className="opacity-50"> {dayjs(slice.points[0].data.x).fromNow()}</span>
							</div>
						</div>
					</div>
				);
			}}
		/>
	);
};

export default FollowersMiniChart;
