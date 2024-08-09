import MobileSubheader from '@/components/Dashboard/Subheader/MobileSubheader';
import Subheader from '@/components/Dashboard/Subheader/Subheader';
import Header from '@/components/Header';
import TopBar from '@/components/TopBar/TopBar';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex flex-col">
			<Header />
			<div>{children}</div>
			<Subheader />
			<MobileSubheader />
		</div>
	);
}
