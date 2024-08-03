import dayjs from 'dayjs';
import { ResponsiveLine } from '@nivo/line';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import colors from '@/utils/colors';
import { useDuration } from './DurationContext';
import Duration from './Overview/Duration';
import { useMediaQuery } from 'react-responsive';
import { motion } from 'framer-motion';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(require('dayjs/plugin/relativeTime'));

// likes, recasts, followers
const customColors = [colors.amber[500], colors.amber[950], colors.rose[600]];

type Precision = 'hour' | 'day' | 'month';

const EngagementChart = ({ data = [] }: { data: any[] }) => {
	const isMobile = useMediaQuery({ query: '(max-width: 640px)' });

	const { duration } = useDuration();

	let tickValues = isMobile ? 'every 12 hours' : 'every 2 hour';
	let precision: Precision = 'hour';
	let format = '%I:%M %p';

	switch (duration) {
		case Duration.DAYS_7:
			tickValues = isMobile ? 'every 3 days' : 'every 24 hours';
			precision = 'hour';
			format = '%a, %d %b';
			break;
		case Duration.DAYS_30:
			tickValues = isMobile ? 'every 10 days' : 'every 2 days';
			precision = 'hour';
			format = '%e %b';
			break;
		case Duration.DAYS_180:
			tickValues = isMobile ? 'every 30 days' : 'every 7 days';
			precision = 'hour';
			format = '%m/%y';
			break;
		default:
			break;
	}

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
			x: dayjs(p.x).tz(userTimezone).toDate(),
			y: p.y,
		})),
	}));

	return (
		<ResponsiveLine
			areaBaselineValue={0}
			enableArea={true}
			areaOpacity={0.35}
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
						stroke: '#cccccc', // Customize the grid line color
						strokeWidth: 1, // Customize the grid line width
						strokeDasharray: '1 8', // Customize the grid line style (dashed)
					},
				},
				crosshair: {
					line: {
						stroke: '#fbbf24', // Customize the crosshair line color
						strokeWidth: 1, // Customize the crosshair line width
						strokeDasharray: '8', // Customize the crosshair line style (dashed)
					},
				},
			}}
			data={lineData}
			margin={{ top: 60, right: isMobile ? 50 : 60, bottom: isMobile ? 60 : 80, left: isMobile ? 100 : 100 }}
			xScale={{ type: 'time', format: 'native', precision: precision }}
			yScale={{ type: 'linear', stacked: false, min: 'auto', max: 'auto' }}
			yFormat=" >-.2f"
			curve="step"
			axisLeft={{
				tickSize: 15,
				tickPadding: isMobile ? 2 : 10,
				tickRotation: 0,
				legend: 'Engagement',
				legendOffset: -65,
				legendPosition: 'middle',
				tickValues: 10,
				format: (value) => `${value}`,
			}}
			// axisLeft={null}
			axisBottom={{
				format: format,
				legendOffset: 0,
				legendPosition: 'middle',
				tickSize: 15,
				tickPadding: 10,
				tickValues: '' + tickValues, // Increased interval to reduce label overlap
			}}
			// axisBottom={null}
			enableGridX={true}
			enableGridY={true}
			lineWidth={0}
			pointSize={isMobile ? 0.25 : 0.35}
			colors={customColors}
			pointColor={{ theme: 'background' }}
			pointBorderWidth={8}
			pointBorderColor={{ from: 'serieColor' }}
			pointLabel="data.yFormatted"
			pointLabelYOffset={0}
			enableSlices="x"
			animate={false}
			sliceTooltip={({ slice }) => {
				const likes = slice.points.find((point) => point.serieId === 'Likes')?.data.y || 0;
				const recasts = slice.points.find((point) => point.serieId === 'Recasts')?.data.y || 0;
				const follows = slice.points.find((point) => point.serieId === 'Followers')?.data.y || 0;

				return (
					<div className="bg-white/95 backdrop-blur-md z-[999999] relative px-4 py-2 shadow-sm border border-[#ededed]/30 rounded-md">
						<div className="text-xs text-black/50">
							{dayjs(slice.points[0].data.x).format('dddd, MMMM D, h:mm A')} ({dayjs(slice.points[0].data.x).fromNow()}){' '}
						</div>
						<div className="mt-2 space-x-1">
							<div className="text-xs rounded-full text-amber-500 px-[6px] py-[2px] bg-amber-500/10 font-medium inline-block">
								{Number(likes)} likes
							</div>
							<div className="text-xs rounded-full text-amber-600 px-[6px] py-[2px] bg-amber-600/10 font-medium inline-block">
								{Number(recasts)} recasts
							</div>
							<div className="text-xs rounded-full text-rose-500 px-[6px] py-[2px] bg-amber-500/10 font-medium inline-block">
								{Number(follows)} followers
							</div>
						</div>
					</div>
				);
			}}
			legends={[
				{
					anchor: 'top',
					direction: 'row',
					justify: false,
					translateX: 0,
					translateY: -30,
					itemsSpacing: 3,
					itemDirection: 'left-to-right',
					itemWidth: 70,
					itemHeight: 8,
					itemOpacity: 0.5,
					symbolSize: 8,
					symbolShape: 'circle',
					symbolBorderColor: 'rgba(0, 0, 0, .5)',
				},
			]}
		/>
	);
};

export default EngagementChart;
