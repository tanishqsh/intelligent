import dayjs from 'dayjs';
import { ResponsiveLine } from '@nivo/line';
dayjs.extend(require('dayjs/plugin/utc'));
dayjs.extend(require('dayjs/plugin/timezone'));

const customColors = ['#FFAF34', '#FACC16', '#0000ff', '#ff00ff', '#00ffff', '#ffff00'];

const EngagementChart = ({ data = [] }: { data: any[] }) => {
	// find the range of the values dynamically
	let max = 0;
	let min = Infinity;
	const xValues = new Set();

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

	// We need to convert the x values to the user's timezone
	const lineData = data.map((d: any) => ({
		id: d.id,
		data: d.data.map((p: any) => ({
			// @ts-ignore
			x: dayjs(p.x).tz(userTimezone).toDate(),
			y: p.y,
		})),
	}));

	return (
		<ResponsiveLine
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
						stroke: '#FFAF34', // Customize the crosshair line color
						strokeWidth: 1, // Customize the crosshair line width
						strokeDasharray: '8 8', // Customize the crosshair line style (dashed)
					},
				},
			}}
			data={lineData}
			margin={{ top: 100, right: 100, bottom: 100, left: 100 }}
			xScale={{ type: 'time', format: 'native', precision: 'hour' }}
			yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
			yFormat=" >-.2f"
			curve="monotoneX"
			axisLeft={{
				tickSize: 15,
				tickPadding: 10,
				tickRotation: 0,
				format: '.2s',
				legend: 'Engagement',
				legendOffset: -65,
				legendPosition: 'middle',
			}}
			axisTop={{
				format: '%I:%M %p',
				legendOffset: -65,
				legendPosition: 'middle',
				tickSize: 15,
				tickPadding: 10,
				tickValues: 'every 2 hours', // Increased interval to reduce label overlap
			}}
			axisBottom={{
				format: '',
				legend: 'Follower Growth vs Engagement',
				legendPosition: 'middle',
				legendOffset: 65,
			}}
			enableGridX={true}
			enableGridY={true}
			lineWidth={3}
			pointSize={12}
			colors={customColors}
			pointColor={{ theme: 'background' }}
			pointBorderWidth={1}
			pointBorderColor={{ from: 'serieColor' }}
			pointLabel="data.yFormatted"
			pointLabelYOffset={-12}
			enableSlices="x"
			sliceTooltip={({ slice }) => {
				// print serieId
				console.log(slice.points[0].serieId);

				const likes = slice.points.find((point) => point.serieId === 'Likes')?.data.y || 0;
				const recasts = slice.points.find((point) => point.serieId === 'Recasts')?.data.y || 0;
				const follows = slice.points.find((point) => point.serieId === 'Followers Gained')?.data.y || 0;
				const date = dayjs(slice.points[0].data.x).format('dddd, MMMM D, YYYY h:mm A');

				return (
					<div className="bg-white/20 backdrop-blur-md px-4 py-2 shadow-sm border border-[#ededed]/30 rounded-md">
						<div className="text-xs text-black/50">{date}</div>
						<div className="mt-2 space-x-1">
							<div className="text-xs rounded-full text-[#ffa013] px-[6px] py-[2px] bg-[#ffa013]/10 font-medium inline-block">
								{Number(likes)} likes
							</div>
							<div className="text-xs rounded-full text-[#ffcc00] px-[6px] py-[2px] bg-[#ffcc00]/10 font-medium inline-block">
								{Number(recasts)} recasts
							</div>
							<div className="text-xs rounded-full text-[#0033ff] px-[6px] py-[2px] bg-[#0033ff]/10 font-medium inline-block">
								{Number(follows)} followers
							</div>
						</div>
					</div>
				);
			}}
			animate={true}
			motionConfig="gentle"
			onMouseEnter={(data, event) => {
				// console.log('onMouseEnter', data?.points);
			}}
			legends={[
				{
					anchor: 'top-left',
					direction: 'row',
					justify: false,
					translateX: -75,
					translateY: -75,
					itemsSpacing: 2,
					itemDirection: 'left-to-right',
					itemWidth: 80,
					itemHeight: 12,
					itemOpacity: 0.75,
					symbolSize: 12,
					symbolShape: 'circle',
					symbolBorderColor: 'rgba(0, 0, 0, .5)',
				},
			]}
		/>
	);
};

export default EngagementChart;
